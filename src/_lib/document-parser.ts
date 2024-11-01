import { JSDOM } from 'jsdom'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkStringify from 'remark-stringify'

export const parseDocument = {
  async fromHtml(html: string): Promise<string> {
    const dom = new JSDOM(html)
    return dom.window.document.body.textContent || ''
  },

  async fromMarkdown(markdown: string): Promise<string> {
    const result = await unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkStringify)
      .process(markdown)
    return String(result)
  },

  async autoDetect(content: string): Promise<string> {
    if (content.trim().startsWith('<')) {
      return this.fromHtml(content)
    } else if (content.includes('```') || content.includes('##')) {
      return this.fromMarkdown(content)
    }
    return content
  }
}
