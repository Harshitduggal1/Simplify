import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { PDFDocument } from 'pdf-lib';
import { metrics } from "@/_lib/metrics";
//added
// Initialize Gemini with error handling
const initializeAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

const genAI = initializeAI();

// Advanced file processing with error handling and validation
class FileProcessor {
  static async processFile(filename: string, buffer: Buffer) {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'xlsx':
      case 'xls':
        return await this.processExcel(buffer, filename);
      case 'csv':
        return await this.processCSV(buffer, filename);
      case 'pdf':
        return await this.processPDF(buffer, filename);
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }

  static async processExcel(buffer: Buffer, filename: string) {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const result: Record<string, any[]> = {};

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        result[sheetName] = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
          defval: null,
          blankrows: false
        });
      }

      return {
        type: 'excel',
        filename,
        sheets: result,
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      console.error(`Error processing Excel ${filename}:`, error);
      throw new Error(`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processCSV(buffer: Buffer, filename: string) {
    try {
      const content = buffer.toString('utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return {
        type: 'csv',
        filename,
        data: records
      };
    } catch (error) {
      console.error(`Error processing CSV ${filename}:`, error);
      throw new Error(`Failed to process CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async processPDF(buffer: Buffer, filename: string) {
    try {
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();
      const textContent: string[] = [];

      for (const page of pages) {
        // Get text using a more reliable method
        const { width, height } = page.getSize();
        const text = await this.extractTextFromPage(page);
        if (text.trim()) {
          textContent.push(text);
        }
      }

      return {
        type: 'pdf',
        filename,
        content: textContent.join('\n').trim(),
        pageCount: pages.length,
        summary: textContent.length > 0 ? 'Text extracted successfully' : 'No text content found'
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async extractTextFromPage(page: any): Promise<string> {
    try {
      // Get page dimensions
      const { width, height } = page.getSize();
      
      // Extract text content using PDF-lib's lower-level APIs
      const textContent: string[] = [];
      const operators = await page.getOperators();
      
      operators.forEach((op: any) => {
        if (op.operator === 'Tj' || op.operator === 'TJ') {
          const text = Array.isArray(op.args[0])
            ? op.args[0].map((item: any) => 
                typeof item === 'string' ? item : ''
              ).join('')
            : op.args[0];
          
          if (text && typeof text === 'string') {
            textContent.push(text);
          }
        }
      });

      return textContent.join(' ');
    } catch (error) {
      console.error('Error extracting text from PDF page:', error);
      return '';
    }
  }

  static async combineDataSources(results: any[]) {
    // Combine data from different sources
    const combined = {
      spreadsheets: results.filter(r => r.type === 'spreadsheet'),
      csvs: results.filter(r => r.type === 'csv'),
      pdfs: results.filter(r => r.type === 'pdf'),
      totalRecords: 0,
      commonFields: new Set(),
      dateRange: { start: null, end: null },
      numericalColumns: new Set(),
      categoricalColumns: new Set()
    };

    // Analyze common fields and data types
    results.forEach(result => {
      if (result.type === 'spreadsheet' || result.type === 'csv') {
        const data = result.type === 'csv' ? result.data : result.sheets[0].data;
        if (data.length > 0) {
          Object.keys(data[0]).forEach(key => {
            combined.commonFields.add(key);
            // Analyze data types
            const value = data[0][key];
            if (typeof value === 'number') {
              combined.numericalColumns.add(key);
            } else if (typeof value === 'string') {
              combined.categoricalColumns.add(key);
            }
          });
        }
      }
    });

    return combined;
  }
}

// Advanced analytics generation
class AnalyticsGenerator {
  private model: any;
  private readonly maxChunkSize: number = 50000;
  private readonly maxSampleSize: number = 1000;

  constructor() {
    this.model = null;
  }

  setModel(model: any) {
    if (!model) {
      throw new Error('Invalid model provided');
    }
    this.model = model;
  }

  async generateAnalytics(data: any, section: any, filename: string) {
    try {
      this.validateModel();
      const processedData = await this.processLargeData(data);
      
      const analytics = {
        primary: {},
        deep: {}
      };

      // Process metrics with retry logic
      const processMetric = async (metric: string, type: 'primary' | 'deep', retries = 3) => {
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            const prompt = this.buildPrompt(processedData, type, [metric]);
            const response = await this.model.generateContent({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              }
            });

            const result = this.safeParseResponse(response.response.text());
            if (result.analysis && result.analysis[metric]) {
              return result.analysis[metric];
            }
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for ${metric}:`, error);
            if (attempt === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
        return this.getFallbackMetric(metric);
      };

      // Process all metrics with Promise.all
      const [primaryResults, deepResults] = await Promise.all([
        Promise.all(section.subsections.primary.map((metric: string) => 
          processMetric(metric, 'primary').then(result => [metric, result])
        )),
        Promise.all(section.subsections.deep.map((metric: string) => 
          processMetric(metric, 'deep').then(result => [metric, result])
        ))
      ]);

      analytics.primary = Object.fromEntries(primaryResults);
      analytics.deep = Object.fromEntries(deepResults);

      return analytics;
    } catch (error) {
      console.error('Analytics generation error:', error);
      return this.getFallbackResponse(section);
    }
  }

  private validateModel() {
    if (!this.model) {
      throw new Error('Model not initialized. Call setModel() first.');
    }
  }

  private buildPrompt(data: string, sectionKey: string, metrics: string[]): string {
    return `Analyze this ${sectionKey} data and provide insights. Return ONLY a JSON object without any markdown formatting or code blocks.

Data: ${data}

Required Metrics: ${metrics.join(', ')}

Response must be a valid JSON object with this exact structure (no additional formatting):
{
  "analysis": {
    "${metrics[0]}": {
      "summary": "detailed findings",
      "key_points": ["point 1", "point 2"],
      "metrics": {"metric1": "value1"},
      "recommendations": ["rec 1", "rec 2"]
    }
  },
  "overall_summary": "overview",
  "confidence_score": 0.95
}`;
  }

  private safeParseResponse(text: string): any {
    try {
      // Remove any markdown formatting or code blocks
      let cleanText = text.replace(/```json\n?|\n?```/g, '');
      cleanText = cleanText.replace(/^[\s\n]*{/, '{').replace(/}[\s\n]*$/, '}');
      
      // Attempt to parse the cleaned JSON
      const parsed = JSON.parse(cleanText);
      
      // Validate the response structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid response structure');
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing response:', error, '\nOriginal text:', text);
      return {
        analysis: {
          "default": {
            summary: "Analysis pending",
            key_points: [],
            metrics: {},
            recommendations: []
          }
        },
        overall_summary: "Analysis pending", 
        confidence_score: 0
      };
    }
  }

  private getFallbackResponse(section: any) {
    return {
      primary: Object.fromEntries(
        section.subsections.primary.map((key: string) => [key, `Analysis pending for ${key}`])
      ),
      deep_metrics: Object.fromEntries(
        section.subsections.deep.map((key: string) => [key, `Deep analysis pending for ${key}`])
      )
    };
  }

  private async processLargeData(data: any): Promise<string> {
    try {
      const formattedData = this.formatData(data);
      const chunks = this.splitIntoChunks(formattedData, this.maxChunkSize);
      return chunks[0]; // Use first chunk for analysis
    } catch (error) {
      console.error('Error processing large data:', error);
      return JSON.stringify({
        error: 'Data processing failed',
        type: data.type,
        filename: data.filename
      });
    }
  }

  private splitIntoChunks(text: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  private formatData(data: any): string {
    if (Array.isArray(data)) {
      return JSON.stringify(data.map(item => this.cleanData(item)));
    }
    return JSON.stringify(this.cleanData(data));
  }

  private cleanData(data: any): any {
    if (typeof data !== 'object' || data === null) return data;
    
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        cleaned[key] = typeof value === 'object' 
          ? this.cleanData(value)
          : value;
      }
    }
    return cleaned;
  }

  private generateSummaryStats(rows: any[]): any {
    return {
      totalRows: rows.length,
      columns: Object.keys(rows[0] || {}),
      dataTypes: this.analyzeDataTypes(rows[0] || {}),
      sampleStats: this.calculateBasicStats(rows)
    };
  }

  private analyzeDataTypes(row: any): Record<string, string> {
    const types: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      types[key] = this.getDetailedType(value);
    }
    return types;
  }

  private getDetailedType(value: any): string {
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'float';
    }
    if (value instanceof Date) return 'date';
    return typeof value;
  }

  private calculateBasicStats(rows: any[]): any {
    // Add basic statistical calculations
    // This is a simplified version - expand based on your needs
    return {
      rowCount: rows.length,
      columnCount: Object.keys(rows[0] || {}).length,
      // Add more stats as needed
    };
  }

  private getFallbackMetric(metric: string) {
    return {
      summary: `Analysis pending for ${metric}`,
      key_points: [`Unable to analyze ${metric}`],
      metrics: {},
      recommendations: [`Retry analysis for ${metric}`]
    };
  }
}
//ai
// Main request handler with enhanced error handling and validation
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files?.length) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    if (files.some(file => file.size > 500 * 1024 * 1024)) {
      return NextResponse.json({ success: false, error: 'File size exceeds 500MB limit' }, { status: 400 });
    }

    // Process files and generate analytics
    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const processedData = await FileProcessor.processFile(file.name, buffer);
          
          // Create analytics generator without constructor args
          const analyticsGenerator = new AnalyticsGenerator();
          
          // Set the model after instantiation
          analyticsGenerator.setModel(genAI.getGenerativeModel({ model: "gemini-pro" }));

          // Define analytics sections based on file type
          const section = {
            title: "File Analysis", 
            subsections: {
              primary: [
                "Data Overview",
                "Key Metrics", 
                "Data Quality",
                "Patterns & Trends"
              ],
              deep: [
                "Statistical Analysis",
                "Anomaly Detection",
                "Data Distribution",
                "Correlation Analysis",
                "Time Series Patterns"
              ]
            }
          };
          
          const analytics = await analyticsGenerator.generateAnalytics(
            processedData,
            section,
            file.name
          );

          return {
            filename: file.name,
            processedData,
            analytics,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          throw error;
        }
      })
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    const failedResults = results
      .filter((result): result is PromiseRejectedResult => 
        result.status === 'rejected'
      )
      .map(result => ({
        error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
      }));

    return NextResponse.json({
      success: true,
      results: successfulResults,
      errors: failedResults,
      totalFiles: files.length,
      successfulFiles: successfulResults.length,
      failedFiles: failedResults.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
//FEATURES ADDED