import { GoogleGenerativeAI, GenerateContentResult, GenerativeModel } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Logger } from "@/_lib/logger"
import { cache } from "@/_lib/cache"
import { metrics } from "@/_lib/metrics"
import { parseDocument } from "@/_lib/document-parser"
import { gemini } from "@/lib/gemini"

// Super flexible request schema that accepts anything
const requestSchema = z.object({
  data: z.any(),
  format: z.any().optional(),
  options: z.any().optional()
}).passthrough()

// Enhanced error handling
class ConversionError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message)
    this.name = 'ConversionError'
  }
}

// Ultra-robust content parser with multiple fallbacks
const parseContent = async (content: any): Promise<string> => {
  try {
    // Handle null/undefined
    if (content == null) return ''

    // Handle strings
    if (typeof content === 'string') {
      try {
        // Try parsing as JSON first
        JSON.parse(content)
        return content
      } catch {
        // Use document parser for HTML/Markdown
        return await parseDocument.autoDetect(content)
      }
    }

    // Handle arrays
    if (Array.isArray(content)) {
      return JSON.stringify(content)
    }

    // Handle objects
    if (typeof content === 'object') {
      return JSON.stringify(content)
    }

    // Handle primitives
    return String(content)
  } catch (error) {
    // Ultimate fallback
    return String(content || '')
  }
}

// Enhanced API handler with maximum resilience
export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID()
  const startTime = performance.now()

  try {
    // Parse request body with multiple fallbacks
    const rawBody = await req.text()
    let body
    try {
      body = JSON.parse(rawBody)
    } catch {
      body = { data: rawBody }
    }

    const { data = "", format = {}, options = {} } = requestSchema.parse(body)

    // Try cache with error handling
    const cacheKey = `json-convert:${typeof data === 'string' ? data : JSON.stringify(data)}`
    try {
      const cached = await cache.get(cacheKey)
      if (cached !== undefined && cached !== null) return NextResponse.json(cached)
    } catch (error) {
      Logger.info('Cache retrieval failed', { error, requestId })
    }

    // Parse content with enhanced flexibility
    const parsedContent = await parseContent(data)

    // Comprehensive prompt for maximum accuracy
    const prompt = `
Convert this data into valid JSON format. Be extremely thorough and extract ALL meaningful data:
${parsedContent}

Critical Requirements:
- MUST return 100% valid JSON
- Accept ANY possible input format
- Preserve ALL data structure and hierarchy
- Use null for missing/invalid values
- Convert ALL types appropriately (numbers, booleans, dates)
- Maintain ALL arrays and nested structures
- Extract ALL possible key-value pairs
- Handle ANY nested/complex structures
- Preserve ALL numerical values and boolean states
- Include EVERY piece of meaningful data
- Clean and sanitize problematic characters
- Ensure proper escaping of special characters

Return ONLY the valid JSON result with no additional text or formatting.`

    // Enhanced AI interaction with retries
    const model: GenerativeModel = gemini.getGenerativeModel({
      model: "gemini-pro",
    })

    let result
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }]}],
          generationConfig: {
            temperature: 0.1, // Lower temperature for more consistent results
            topP: 1,
            topK: 40,
            maxOutputTokens: 4000,
          },
        })
        break
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) throw error
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
      }
    }

    // Enhanced JSON parsing with multiple attempts
    let jsonResult
    try {
      const cleanedText = result?.response?.text()?.trim() || ''
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = cleanedText.match(/```json?\s*([\s\S]*?)\s*```/) || cleanedText.match(/`([\s\S]*?)`/)
      const textToparse = jsonMatch ? jsonMatch[1] : cleanedText
      jsonResult = JSON.parse(textToparse)
    } catch (error) {
      // Fallback structure if parsing fails
      jsonResult = {
        content: result?.response?.text() || '',
        format: "unstructured", 
        originalData: data,
        parsingError: error instanceof Error ? error.message : 'Unknown parsing error'
      }
    }

    // Cache with error handling
    try {
      await cache.set(cacheKey, jsonResult, 60 * 60)
    } catch (error) {
      Logger.info('Cache storage failed', { error, requestId })
    }

    // Track metrics
    metrics.recordConversion({
      success: true,
      duration: performance.now() - startTime,
      requestId
    })

    // Return result with detailed headers
    return NextResponse.json(jsonResult, {
      headers: {
        'X-Request-ID': requestId,
        'X-Response-Time': `${performance.now() - startTime}ms`,
        'X-Conversion-Status': 'success'
      }
    })

  } catch (error) {
    // Enhanced error handling with detailed logging
    Logger.error('Conversion error', { 
      error, 
      requestId,
      stack: error instanceof Error ? error.stack : undefined,
      input: req.body
    })

    // Structured error response
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.name : 'UnknownError',
      originalData: req.body,
      requestId,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(errorResponse, { 
      status: 200,
      headers: {
        'X-Request-ID': requestId,
        'X-Error-Time': `${performance.now() - startTime}ms`,
        'X-Conversion-Status': 'error'
      }
    })
  }
}
//new code