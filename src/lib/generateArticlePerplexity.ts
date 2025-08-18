interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface BlogArticle {
  title: string;
  content: string;
  excerpt: string; // This will be used as summary in the output
  keywords: string[];
  readingTime: string;
  publishDate: string; // This will be used as publishedAt in the output
}

interface ExistingArticle {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
  relevanceScore?: number;
}

// Function to analyze existing articles and find relevant interlinking opportunities
const findInterlinkingOpportunities = (keyword: string, existingArticles: ExistingArticle[]): ExistingArticle[] => {
  const relevantArticles: ExistingArticle[] = [];
  
  // Convert keyword to lowercase for better matching
  const keywordLower = keyword.toLowerCase();
  const keywordWords = keywordLower.split(/\s+/);
  
  existingArticles.forEach(article => {
    let relevanceScore = 0;
    
    // Check if keyword appears in title (highest weight)
    if (article.title.toLowerCase().includes(keywordLower)) {
      relevanceScore += 5;
    }
    
    // Check if keyword appears in summary (high weight)
    if (article.summary.toLowerCase().includes(keywordLower)) {
      relevanceScore += 4;
    }
    
    // Check if keyword appears in article keywords (medium weight)
    if (article.keywords.some(k => k.toLowerCase().includes(keywordLower))) {
      relevanceScore += 3;
    }
    
    // Check for semantic relationships (lower weight)
    article.keywords.forEach(articleKeyword => {
      const articleKeywordLower = articleKeyword.toLowerCase();
      keywordWords.forEach(word => {
        if (articleKeywordLower.includes(word) || word.includes(articleKeywordLower)) {
          relevanceScore += 1;
        }
      });
    });
    
    // Only include articles with sufficient relevance (minimum threshold: 6)
    if (relevanceScore >= 6) {
      relevantArticles.push({
        ...article,
        relevanceScore
      });
    }
  });
  
  // Sort by relevance score (highest first)
  return relevantArticles.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

// Function to extract keywords from existing articles
const extractKeywordsFromContent = (content: string): string[] => {
  // Simple keyword extraction - look for common technical terms, frameworks, etc.
  const commonTechTerms = [
    'react', 'typescript', 'javascript', 'next.js', 'node.js', 'python', 'java', 'css', 'html',
    'api', 'database', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'testing', 'deployment', 'performance', 'security', 'scalability', 'microservices', 'saas',
    'machine learning', 'ai', 'data science', 'frontend', 'backend', 'fullstack', 'devops'
  ];
  
  const contentLower = content.toLowerCase();
  const foundKeywords = commonTechTerms.filter(term => contentLower.includes(term));
  
  // Also extract any words that appear multiple times (potential keywords)
  const words = contentLower.match(/\b\w{4,}\b/g) || [];
  const wordCounts: { [key: string]: number } = {};
  
  words.forEach(word => {
    if (word.length > 4 && !commonTechTerms.includes(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Add words that appear at least 3 times
  const frequentWords = Object.entries(wordCounts)
    .filter(([_, count]) => count >= 3)
    .map(([word, _]) => word)
    .slice(0, 5); // Limit to top 5
  
  return [...foundKeywords, ...frequentWords];
};

// Function to get existing articles with enhanced metadata
const getExistingArticlesForInterlinking = (): ExistingArticle[] => {
  try {
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');
    
    const contentDir = getContentDirectory();
    
    if (!fs.existsSync(contentDir)) {
      return [];
    }
    
    const files = fs.readdirSync(contentDir);
    const mdxFiles = files.filter((file: string) => file.endsWith('.mdx'));
    
    return mdxFiles.map((filename: string) => {
      const filePath = path.join(contentDir, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data: metadata, content } = matter(source);
      
      // Extract slug from filename
      const slug = path.basename(filename, '.mdx');
      
      // Extract keywords from content if not present in metadata
      const keywords = metadata.keywords || extractKeywordsFromContent(content);
      
      return {
        slug,
        title: metadata.title || 'Untitled',
        summary: metadata.summary || metadata.excerpt || '',
        keywords: Array.isArray(keywords) ? keywords : [keywords].filter(Boolean)
      };
    });
  } catch (error) {
    console.error('Error getting existing articles for interlinking:', error);
    return [];
  }
};

// Function to update existing articles with interlinks to new articles
const updateExistingArticlesWithInterlinks = (newArticleSlug: string, newArticleTitle: string, newArticleKeywords: string[]) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');
    
    const contentDir = getContentDirectory();
    const files = fs.readdirSync(contentDir);
    const mdxFiles = files.filter((file: string) => file.endsWith('.mdx') && file !== `${newArticleSlug}.mdx`);
    
    mdxFiles.forEach((filename: string) => {
      const filePath = path.join(contentDir, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data: metadata, content } = matter(source);
      
      // Calculate relevance score for this article
      let relevanceScore = 0;
      const contentLower = content.toLowerCase();
      const titleLower = (metadata.title || '').toLowerCase();
      const summaryLower = (metadata.summary || metadata.excerpt || '').toLowerCase();
      
      // Check for keyword relevance with weighted scoring
      newArticleKeywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Title match (highest weight)
        if (titleLower.includes(keywordLower)) {
          relevanceScore += 5;
        }
        
        // Summary match (high weight)
        if (summaryLower.includes(keywordLower)) {
          relevanceScore += 4;
        }
        
        // Content match (medium weight)
        if (contentLower.includes(keywordLower)) {
          relevanceScore += 2;
        }
        
        // Check for semantic relationships
        const keywordWords = keywordLower.split(/\s+/);
        if (metadata.keywords && Array.isArray(metadata.keywords)) {
          metadata.keywords.forEach((articleKeyword: string) => {
            const articleKeywordLower = articleKeyword.toLowerCase();
            keywordWords.forEach(word => {
              if (articleKeywordLower.includes(word) || word.includes(articleKeywordLower)) {
                relevanceScore += 1;
              }
            });
          });
        }
      });
      
      // Only add link if relevance score meets minimum threshold (7 or higher)
      if (relevanceScore >= 7) {
        console.log(`Adding interlink to ${filename} (relevance score: ${relevanceScore})`);
        
        // Find a good place to add the interlink (preferably in a relevant section)
        const lines = content.split('\n');
        let updatedContent = content;
        let linkAdded = false;
        
        // Look for sections that might be related to the new article
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith('##') || line.startsWith('###')) {
            const headingLower = line.toLowerCase();
            if (newArticleKeywords.some(keyword => headingLower.includes(keyword.toLowerCase()))) {
              // Add interlink after this heading
              const interlink = `\n\nFor more detailed information, check out our guide on [${newArticleTitle}](/blog/${newArticleSlug}).\n`;
              updatedContent = content.replace(line, line + interlink);
              linkAdded = true;
              break;
            }
          }
        }
        
        // If no good section found, add at the end before conclusion
        if (!linkAdded) {
          const conclusionIndex = content.toLowerCase().indexOf('## conclusion');
          if (conclusionIndex !== -1) {
            const interlink = `\n\n**Related Reading**: For more insights, explore our comprehensive guide on [${newArticleTitle}](/blog/${newArticleSlug}).\n\n`;
            updatedContent = content.slice(0, conclusionIndex) + interlink + content.slice(conclusionIndex);
            linkAdded = true;
          }
        }
        
        // Only update if content actually changed and link was added
        if (linkAdded && updatedContent !== content) {
          const updatedMdx = matter.stringify(updatedContent, metadata);
          fs.writeFileSync(filePath, updatedMdx, 'utf8');
          console.log(`✅ Updated ${filename} with interlink to ${newArticleSlug} (relevance: ${relevanceScore})`);
        }
      } else {
        console.log(`⏭️  Skipping ${filename} - relevance score too low (${relevanceScore}/7)`);
      }
    });
  } catch (error) {
    console.error('Error updating existing articles with interlinks:', error);
  }
};

const generateArticlePerplexity = async (keyword: string): Promise<BlogArticle> => {
  // Get existing articles for interlinking
  const existingArticles = getExistingArticlesForInterlinking();
  const interlinkingOpportunities = findInterlinkingOpportunities(keyword, existingArticles);
  
  // Build interlinking context for the prompt
  let interlinkingContext = '';
  if (interlinkingOpportunities.length > 0) {
    const articleList = interlinkingOpportunities.map(article => 
      `- **${article.title}** (slug: ${article.slug}) - ${article.summary}`
    ).join('\n');
    
    interlinkingContext = `\n## Interlinking Requirements (IMPORTANT):
You MAY include relevant interlinks to existing articles when they genuinely add value to the reader and are contextually relevant. Here are the existing articles you can reference:

${articleList}

IMPORTANT GUIDELINES FOR INTERLINKING:
- Only include interlinks when they genuinely add value to the reader
- Don't force interlinks - they should flow naturally with the content
- Only link to articles that are directly relevant to the current section/topic
- Maximum of 2-3 interlinks throughout the entire article
- If no relevant connections exist, don't include any interlinks

When writing your content, naturally incorporate links to these existing articles using this format: [link text](/blog/[slug])

Example of good interlinking:
"If you're new to web development, you might want to start with our [React fundamentals guide](/blog/react-basics) before diving into advanced patterns."

Example of when NOT to interlink:
- Don't add links just to meet a quota
- Don't link to articles that are only tangentially related
- Don't force connections that don't make sense

CRITICAL: Only include interlinks where they genuinely enhance the reader's understanding. Quality over quantity.`;
  }

  const prompt = `You are an expert content writer and SEO specialist. Create a comprehensive, engaging blog article about "${keyword}" that provides real value to readers.

  Generate a complete blog article with the following structure and requirements:

  ## Article Structure:
  1. **Title**: Create a compelling, SEO-optimized title (MAXIMUM 60 characters - this is critical for SEO)
  2. **Summary**: Write a concise summary (MAXIMUM 160 characters - this is critical for SEO meta descriptions)
  3. **Content**: Write a comprehensive article (1500-2000 words) with:
     - Engaging introduction (DO NOT repeat the title)
     - 4-6 main sections with descriptive headings
     - Practical tips, examples, and actionable advice
     - Conclusion with key takeaways
     - Include 3-5 different, contextually relevant images using this format: ![Alt text for image](image-url-here)
     - Each image must specifically relate to its section's topic (e.g., "real estate investment charts" for investment sections, not generic business images)
     - CRITICAL: Before placing any image, analyze the section's main topic and search for specific, relevant visual content
     - Use proper markdown formatting (headers, lists, bold, italic, etc.)
     - Include relevant statistics, case studies, or examples when appropriate
     - Make it conversational and easy to read
     - CRITICAL: Write content naturally without citation markers like [1], [2], [3] - present information directly
     - Ensure it's informative and provides real value${interlinkingContext}

  ## Content Guidelines:
  - Write in a professional yet conversational tone
  - Use natural, human language that flows well
  - Avoid overly technical jargon unless necessary
  - Include practical examples and actionable insights
  - Use subheadings to break up content for readability
  - Include relevant data or statistics when possible
  - Make it comprehensive but not overwhelming
  - Focus on providing value to the reader
  - Use markdown formatting appropriately
  - DO NOT repeat the title in the introduction - start directly with content
  - Write as if you're having a conversation with a knowledgeable colleague
  - CRITICAL: When including images, search for and use DIFFERENT images for each section - never repeat the same image URL
  - CRITICAL: Each image must be contextually relevant to its section - analyze the section's main topic and search for specific, relevant images
  - CRITICAL: Avoid using dashes (—) anywhere in the content - use proper punctuation instead
  - Use clear, professional language without unnecessary punctuation marks
  - Write with clarity and precision - avoid any writing that could be considered casual or informal
  - Maintain a business-appropriate tone throughout the entire article
  
  ## CRITICAL: NO CITATION MARKERS:
  - DO NOT include citation markers like [1], [2], [3], [4], etc. anywhere in the content
  - DO NOT include reference numbers or citation brackets
  - Write content as if you're sharing knowledge directly, not citing external sources
  - If mentioning statistics or facts, present them naturally without citation markers
  - The content should read like a natural blog post, not an academic paper

  ## SEO Requirements (CRITICAL):
  - **Title**: Must be exactly 60 characters or less for optimal SEO
  - **Summary**: Must be exactly 160 characters or less for optimal meta description
  - **Title format**: Use main keyword first, then benefit or year if relevant
  - **Summary format**: Start with action words, include main benefit, end with call to action
  - **Examples of good titles**: "React Hooks Guide: Master State Management" (49 chars)
  - **Examples of good summaries**: "Learn React Hooks to build better components. Master useState, useEffect, and custom hooks with practical examples." (159 chars)

  ## Image Guidelines:
  - Search for and include 3-5 relevant, high-quality images that enhance the article content
  - Use descriptive alt text for accessibility
  - Place images strategically throughout the content
  - Use this format: ![Descriptive alt text](image-url-here)
  
  ## CRITICAL IMAGE SELECTION REQUIREMENTS:
  - Each image MUST be contextually relevant to its specific section content
  - Generate specific search queries for each image based on the section's topic
  - For example, if writing about "real estate investment," search for: "real estate investment charts", "property investment portfolio", "real estate market trends"
  - If writing about "dividend investing," search for: "stock market dividend charts", "investment portfolio dashboard", "dividend growth visualization"
  - If writing about "SaaS development," search for: "software development team", "SaaS dashboard interface", "cloud infrastructure technology"
  
  ## Image Search Strategy:
  - Analyze each section's main topic and create specific search terms
  - Use technical, professional terminology in your searches
  - Avoid generic terms like "business" or "success" - be specific
  - Search for images that show the actual concepts, tools, or processes mentioned
  - Use different images for different sections - don't repeat the same image
  - Include images from Unsplash, Pexels, or similar free stock photo services
  - Make sure each image URL is different and relevant to its section

  ## Output Format:
  Return the article in this exact JSON structure:
  {
    "title": "Your compelling title here (MAX 60 characters)",
    "summary": "Your concise summary here (MAX 160 characters)",
    "content": "Your full markdown content with images here (DO NOT include title at the beginning)"
  }

  CRITICAL: The title and summary MUST stay within the character limits for SEO. Test your output:
  - Title: Count characters and ensure it's 60 or less
  - Summary: Count characters and ensure it's 160 or less

  CRITICAL IMAGE REQUIREMENT: You MUST search for and include 3-5 DIFFERENT, contextually relevant images throughout your article. Each image should be:
  - Different from the others (different URLs)
  - SPECIFICALLY relevant to the section's main topic (not just generally related to the article)
  - Show the actual concepts, tools, or processes mentioned in that section
  - Use specific search terms like "real estate investment charts" instead of generic "business success"
  - High-quality and professional
  - From free stock photo services like Unsplash or Pexels
  - Properly formatted with descriptive alt text that explains the specific relevance

  ## FINAL INSTRUCTIONS:
  ## IMAGE SELECTION:
  Before searching for any image, analyze the section's content and create a specific search query. 
  - For investment topics: search "investment portfolio charts", "financial growth graphs", "market analysis dashboard"
  - For technology topics: search "software development workspace", "coding interface", "tech team collaboration"
  - For business topics: search "business strategy planning", "market research analysis", "growth metrics dashboard"
  - NEVER use generic terms like "business success", "professional work", or "modern office" - be specific to the content!
  
  ## CONTENT STYLE:
  - Write as a natural blog post, not an academic paper
  - NEVER include citation markers like [1], [2], [3], [4], etc.
  - Present information directly and conversationally
  - If mentioning facts or statistics, state them naturally without references
  - The content should read like you're sharing knowledge with a friend
  
  ## PROFESSIONAL WRITING STANDARDS:
  - CRITICAL: Never use em dashes (—) or en dashes (–) anywhere in the content
  - Use proper punctuation: periods, commas, semicolons, and colons as appropriate
  - Write with clarity and precision - every sentence should be clear and purposeful
  - Avoid unnecessary punctuation marks or decorative writing elements
  - Maintain a business-professional tone throughout - no casual language or slang
  - Use complete sentences and proper grammar at all times
  - Ensure the writing is clean, readable, and suitable for a professional audience

  Make sure the content is well-researched, engaging, and provides genuine value to readers interested in "${keyword}". The content should start directly with the introduction, not with a repeated title. Write in a natural, human way that feels like you're sharing valuable insights with a friend.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      }),
    });

    if (!response.ok) {
      const errPayload = await response.text();
      console.error('Perplexity error payload:', errPayload);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data: PerplexityResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content.trim();
      
      try {
        // Try to parse as JSON first
        const parsedContent = JSON.parse(content);
        
        // Validate and fix SEO requirements
        let title = parsedContent.title || `Complete Guide to ${keyword}`;
        let summary = parsedContent.summary || `A comprehensive guide to ${keyword} covering everything you need to know.`;
        
        // Ensure title is 60 characters or less
        if (title.length > 60) {
          console.warn(`Title too long (${title.length} chars), truncating to 60 characters`);
          title = title.substring(0, 57) + '...';
        }
        
        // Ensure summary is 160 characters or less
        if (summary.length > 160) {
          console.warn(`Summary too long (${summary.length} chars), truncating to 160 characters`);
          summary = summary.substring(0, 157) + '...';
        }
        
        console.log(`SEO Validation - Title: ${title.length}/60 chars, Summary: ${summary.length}/160 chars`);
        
        return {
          title: title,
          excerpt: summary,
          keywords: [keyword, 'guide', 'tutorial', 'tips', 'best practices'],
          content: parsedContent.content || content,
          readingTime: '5 min read',
          publishDate: new Date().toISOString().split('T')[0]
        };
      } catch (parseError) {
        // If JSON parsing fails, treat the entire content as markdown
        return {
          title: `Complete Guide to ${keyword}`,
          excerpt: `Learn ${keyword} with practical examples and best practices. Master the fundamentals and advanced techniques.`,
          keywords: [keyword, 'guide', 'tutorial', 'tips', 'best practices'],
          content: `## Introduction
${keyword} is a fascinating and important topic that many people are eager to learn about. Whether you're just getting started or looking to deepen your knowledge, this comprehensive guide will walk you through everything you need to know in a clear, practical way.

## What is ${keyword}?
${keyword} represents a concept, technology, or subject that has significant relevance in today's world. It's something that can truly make a difference in how you approach your work, projects, or understanding of the field.

## Key Benefits
- **Benefit 1**: A clear explanation of the first major advantage you'll gain
- **Benefit 2**: How this can improve your workflow and productivity  
- **Benefit 3**: The long-term value and impact on your success

## How to Get Started
Getting started with ${keyword} is easier than you might think. Here's a straightforward approach:

1. **Step 1**: Begin with the basics - understanding the fundamentals
2. **Step 2**: Move into practical implementation and hands-on practice
3. **Step 3**: Test, validate, and refine your approach

## Best Practices
Here are some proven strategies that successful practitioners use:

- **Practice 1**: A detailed explanation of why this approach works
- **Practice 2**: How to implement this effectively in real situations
- **Practice 3**: Common pitfalls to avoid and how to overcome them

## Common Challenges and Solutions
You'll likely encounter some challenges along the way. Here's how to handle them:

**Challenge 1**: A realistic description of what you might face
*Solution*: A practical, actionable approach to solving this issue

**Challenge 2**: Another common obstacle you might encounter  
*Solution*: A proven method for working through this challenge

## Conclusion
${keyword} offers significant opportunities for those willing to learn and implement it properly. By following this guide and staying committed to the process, you'll be well-equipped to succeed and see real results in your work.`,
          readingTime: '5 min read',
          publishDate: new Date().toISOString().split('T')[0]
        };
      }
    } else {
      throw new Error('No response content from Perplexity API');
    }
  } catch (error) {
    console.error('Error generating article with Perplexity:', error);
    return {
      title: `Complete Guide to ${keyword}`,
      excerpt: `Learn ${keyword} with practical examples and best practices. Master the fundamentals and advanced techniques.`,
      keywords: [keyword, 'guide', 'tutorial', 'tips', 'best practices'],
      content: `## Introduction
${keyword} is a fascinating and important topic that many people are eager to learn about. Whether you're just getting started or looking to deepen your knowledge, this comprehensive guide will walk you through everything you need to know in a clear, practical way.

## What is ${keyword}?
${keyword} represents a concept, technology, or subject that has significant relevance in today's world. It's something that can truly make a difference in how you approach your work, projects, or understanding of the field.

## Key Benefits
- **Benefit 1**: A clear explanation of the first major advantage you'll gain
- **Benefit 2**: How this can improve your workflow and productivity  
- **Benefit 3**: The long-term value and impact on your success

## How to Get Started
Getting started with ${keyword} is easier than you might think. Here's a straightforward approach:

1. **Step 1**: Begin with the basics - understanding the fundamentals
2. **Step 2**: Move into practical implementation and hands-on practice
3. **Step 3**: Test, validate, and refine your approach

## Best Practices
Here are some proven strategies that successful practitioners use:

- **Practice 1**: A detailed explanation of why this approach works
- **Practice 2**: How to implement this effectively in real situations
- **Practice 3**: Common pitfalls to avoid and how to overcome them

## Common Challenges and Solutions
You'll likely encounter some challenges along the way. Here's how to handle them:

**Challenge 1**: A realistic description of what you might face
*Solution*: A practical, actionable approach to solving this issue

**Challenge 2**: Another common obstacle you might encounter  
*Solution*: A proven method for working through this challenge

## Conclusion
${keyword} offers significant opportunities for those willing to learn and implement it properly. By following this guide and staying committed to the process, you'll be well-equipped to succeed and see real results in your work.`,
      readingTime: '5 min read',
      publishDate: new Date().toISOString().split('T')[0]
    };
  }
};

// Function to generate and save MDX file
export const generateAndSaveMDX = async (keyword: string, outputPath?: string): Promise<string> => {
  try {
    const article = await generateArticlePerplexity(keyword);
    
    // Create MDX content without YAML frontmatter - clean and natural format
    const mdxContent = `# ${article.title}

${article.excerpt}

${article.content}`;

    // If outputPath is provided, save to file
    if (outputPath) {
      const fs = require('fs');
      const path = require('path');
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
      
      fs.writeFileSync(outputPath, mdxContent, 'utf8');
      console.log(`MDX file saved to: ${outputPath}`);
      
      // Verify file was created
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`File verification: ${outputPath} exists, size: ${stats.size} bytes`);
      } else {
        console.warn(`Warning: File was not created at ${outputPath}`);
      }
    }
    
    return mdxContent;
  } catch (error) {
    console.error('Error generating MDX:', error);
    throw error;
  }
};

// Utility function to get the correct content directory path
export const getContentDirectory = (): string => {
  const path = require('path');
  
  try {
    // In Next.js environment, we need to go up from the build directory to the project root
    const currentDir = process.cwd();
    
    // Check if we're in .next directory (build environment)
    if (currentDir.includes('.next')) {
      // Go up from .next/server to project root, then to content
      return path.join(currentDir, '..', '..', '..', 'content');
    }
    
    // Check if we're in src/lib or similar subdirectory
    if (currentDir.includes('src')) {
      return path.join(currentDir, '..', '..', 'content');
    }
    
    // If we're in the project root
    if (currentDir.includes('portfolio')) {
      return path.join(currentDir, 'content');
    }
    
    // Fallback: try to find the project root by looking for package.json
    let searchDir = currentDir;
    while (searchDir !== path.dirname(searchDir)) {
      if (require('fs').existsSync(path.join(searchDir, 'package.json'))) {
        return path.join(searchDir, 'content');
      }
      searchDir = path.dirname(searchDir);
    }
    
    // Last resort: use current directory
    return path.join(currentDir, 'content');
  } catch (error) {
    console.error('Error in path resolution:', error);
    // Fallback to process.cwd()
    return path.join(process.cwd(), 'content');
  }
};

// Utility function to list existing blog posts in content directory
export const listExistingBlogPosts = (): Array<{ filename: string; filePath: string; size: number; modified: Date }> => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const contentDir = getContentDirectory();
    
    if (!fs.existsSync(contentDir)) {
      console.log(`Content directory does not exist: ${contentDir}`);
      return [];
    }
    
    const files = fs.readdirSync(contentDir);
    const mdxFiles = files.filter((file: string) => file.endsWith('.mdx'));
    
    return mdxFiles.map((filename: string) => {
      const filePath = path.join(contentDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        filePath,
        size: stats.size,
        modified: stats.mtime
      };
    });
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return [];
  }
};

// Utility function to verify content directory structure
export const verifyContentDirectory = (): { exists: boolean; path: string; writable: boolean; files: number } => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const contentDir = getContentDirectory();
    const exists = fs.existsSync(contentDir);
    
    if (!exists) {
      return { exists: false, path: contentDir, writable: false, files: 0 };
    }
    
    // Check if directory is writable
    const testFile = path.join(contentDir, '.test-write');
    let writable = false;
    
    try {
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      writable = true;
    } catch (error) {
      writable = false;
    }
    
    // Count existing files
    const files = fs.readdirSync(contentDir).filter((file: string) => file.endsWith('.mdx')).length;
    
    return { exists: true, path: contentDir, writable, files };
  } catch (error) {
    console.error('Error verifying content directory:', error);
    return { exists: false, path: '', writable: false, files: 0 };
  }
};

// Utility function to manually update all existing articles with interlinks
export const updateAllArticlesWithInterlinks = async (): Promise<void> => {
  try {
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');
    
    const contentDir = getContentDirectory();
    const files = fs.readdirSync(contentDir);
    const mdxFiles = files.filter((file: string) => file.endsWith('.mdx'));
    
    console.log(`Found ${mdxFiles.length} articles to process for interlinking...`);
    
    // First, collect all article metadata
    const articles = mdxFiles.map((filename: string) => {
      const filePath = path.join(contentDir, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data: metadata, content } = matter(source);
      const slug = path.basename(filename, '.mdx');
      
      return {
        slug,
        title: metadata.title || 'Untitled',
        summary: metadata.summary || metadata.excerpt || '',
        keywords: metadata.keywords || extractKeywordsFromContent(content),
        content,
        filePath
      };
    });
    
    // Process each article for interlinking
    articles.forEach((article: any, index: number) => {
      console.log(`Processing ${index + 1}/${articles.length}: ${article.title}`);
      
      // Find relevant articles to link to using the same scoring system
      const relevantArticles = articles.filter((otherArticle: any) => {
        if (otherArticle.slug === article.slug) return false;
        
        // Calculate relevance score
        let relevanceScore = 0;
        const articleTitleLower = article.title.toLowerCase();
        const articleSummaryLower = article.summary.toLowerCase();
        const articleKeywords = article.keywords || [];
        
        // Check title relevance
        if (otherArticle.title.toLowerCase().includes(articleTitleLower) || 
            articleTitleLower.includes(otherArticle.title.toLowerCase())) {
          relevanceScore += 5;
        }
        
        // Check summary relevance
        if (otherArticle.summary.toLowerCase().includes(articleSummaryLower) || 
            articleSummaryLower.includes(otherArticle.summary.toLowerCase())) {
          relevanceScore += 4;
        }
        
        // Check keyword overlap
        const commonKeywords = articleKeywords.filter((k: string) => 
          otherArticle.keywords.some((ok: string) => 
            k.toLowerCase().includes(ok.toLowerCase()) || ok.toLowerCase().includes(k.toLowerCase())
          )
        );
        if (commonKeywords.length > 0) {
          relevanceScore += commonKeywords.length * 2;
        }
        
        // Only include if relevance score meets threshold
        return relevanceScore >= 6;
      });
      
      if (relevantArticles.length > 0) {
        console.log(`  Found ${relevantArticles.length} relevant articles for interlinking`);
        
        let updatedContent = article.content;
        let linksAdded = 0;
        
        // Add interlinks to relevant sections (limit to 2 most relevant)
        relevantArticles
          .sort((a: any, b: any) => {
            // Simple relevance sorting based on title similarity
            const aScore = a.title.toLowerCase().includes(article.title.toLowerCase()) ? 2 : 0;
            const bScore = b.title.toLowerCase().includes(article.title.toLowerCase()) ? 2 : 0;
            return bScore - aScore;
          })
          .slice(0, 2)
          .forEach((relevantArticle: any) => {
            const interlink = `\n\n**Related Reading**: For more insights, explore our guide on [${relevantArticle.title}](/blog/${relevantArticle.slug}).\n`;
            
            // Try to add before conclusion
            const conclusionIndex = updatedContent.toLowerCase().indexOf('## conclusion');
            if (conclusionIndex !== -1) {
              updatedContent = updatedContent.slice(0, conclusionIndex) + interlink + updatedContent.slice(conclusionIndex);
              linksAdded++;
            }
          });
        
        // Only update if content changed
        if (linksAdded > 0) {
          const { data: metadata } = matter(fs.readFileSync(article.filePath, 'utf-8'));
          const updatedMdx = matter.stringify(updatedContent, metadata);
          fs.writeFileSync(article.filePath, updatedMdx, 'utf8');
          console.log(`  ✅ Added ${linksAdded} interlinks to ${article.slug}`);
        } else {
          console.log(`  ⚠️  No suitable location found for interlinks in ${article.slug}`);
        }
      } else {
        console.log(`  ℹ️  No relevant articles found for ${article.slug}`);
      }
    });
    
    console.log('✅ Interlinking update completed!');
  } catch (error) {
    console.error('Error updating all articles with interlinks:', error);
    throw error;
  }
};

// Function to clean up excessive or irrelevant interlinks from existing articles
export const cleanupExcessiveInterlinks = async (): Promise<void> => {
  try {
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');
    
    const contentDir = getContentDirectory();
    const files = fs.readdirSync(contentDir);
    const mdxFiles = files.filter((file: string) => file.endsWith('.mdx'));
    
    console.log(`Found ${mdxFiles.length} articles to check for excessive interlinks...`);
    
    let totalLinksRemoved = 0;
    
    mdxFiles.forEach((filename: string) => {
      const filePath = path.join(contentDir, filename);
      const source = fs.readFileSync(filePath, 'utf-8');
      const { data: metadata, content } = matter(source);
      
      // Look for excessive interlink patterns
      const interlinkPatterns = [
        /For more detailed information, check out our guide on \[.*?\]\(\/blog\/.*?\)\./g,
        /\*\*Related Reading\*\*: For more insights, explore our guide on \[.*?\]\(\/blog\/.*?\)\./g
      ];
      
      let updatedContent = content;
      let linksRemoved = 0;
      
      interlinkPatterns.forEach(pattern => {
        const matches = updatedContent.match(pattern);
        if (matches && matches.length > 2) {
          // Remove excessive links, keep only the first 2
          const firstTwoMatches = matches.slice(0, 2);
          let tempContent = updatedContent;
          
          // Remove all matches first
          matches.forEach((match: string) => {
            tempContent = tempContent.replace(match, '');
          });
          
          // Add back only the first two
          firstTwoMatches.forEach((match: string) => {
            tempContent = tempContent + '\n\n' + match;
          });
          
          updatedContent = tempContent;
          linksRemoved += matches.length - 2;
        }
      });
      
      // Only update if content changed
      if (linksRemoved > 0) {
        const updatedMdx = matter.stringify(updatedContent, metadata);
        fs.writeFileSync(filePath, updatedMdx, 'utf8');
        console.log(`  ✅ Cleaned up ${linksRemoved} excessive interlinks from ${filename}`);
        totalLinksRemoved += linksRemoved;
      } else {
        console.log(`  ℹ️  No excessive interlinks found in ${filename}`);
      }
    });
    
    console.log(`✅ Cleanup completed! Removed ${totalLinksRemoved} excessive interlinks total.`);
  } catch (error) {
    console.error('Error cleaning up excessive interlinks:', error);
    throw error;
  }
};

// Helper function to generate blog post in content directory
export const generateBlogPost = async (keyword: string, filename?: string): Promise<{ content: string; filePath: string }> => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Generate the article
    const article = await generateArticlePerplexity(keyword);
    
    // Create filename from keyword if not provided
    const safeFilename = filename || keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Create MDX content with frontmatter matching existing format
    const mdxContent = `---
title: "${article.title}"
publishedAt: "${article.publishDate}"
summary: "${article.excerpt}"
keywords: ${JSON.stringify(article.keywords)}
---

${article.content}
`;

    // Get the correct content directory path
    const contentDir = getContentDirectory();
    const filePath = path.join(contentDir, `${safeFilename}.mdx`);
    
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`Content directory resolved to: ${contentDir}`);
    console.log(`Target file path: ${filePath}`);
    console.log(`Expected project content folder: ${path.join(process.cwd(), 'content')}`);
    
    // Ensure content directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
      console.log(`Created content directory: ${contentDir}`);
    } else {
      console.log(`Content directory already exists: ${contentDir}`);
    }
    
    // Save the file
    fs.writeFileSync(filePath, mdxContent, 'utf8');
    console.log(`Blog post saved to: ${filePath}`);
    
    // Update existing articles with interlinks to this new article
    updateExistingArticlesWithInterlinks(safeFilename, article.title, article.keywords);
    
    // Verify file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`File verification: ${filePath} exists, size: ${stats.size} bytes`);
      
      // Also check if we can find the file in the expected project content folder
      const expectedProjectContent = path.join(process.cwd(), 'content');
      if (expectedProjectContent !== contentDir) {
        console.log(`Note: Files are being saved to: ${contentDir}`);
        console.log(`Expected project content folder: ${expectedProjectContent}`);
        
        // Try to also save a copy to the project content folder
        try {
          if (!fs.existsSync(expectedProjectContent)) {
            fs.mkdirSync(expectedProjectContent, { recursive: true });
          }
          const projectFilePath = path.join(expectedProjectContent, `${safeFilename}.mdx`);
          fs.writeFileSync(projectFilePath, mdxContent, 'utf8');
          console.log(`Also saved copy to project content folder: ${projectFilePath}`);
        } catch (copyError) {
          console.log(`Could not save copy to project content folder: ${copyError}`);
        }
      }
    } else {
      console.warn(`Warning: File was not created at ${filePath}`);
    }
    
    return {
      content: mdxContent,
      filePath: filePath
    };
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
};

// Utility function to generate multiple blog posts
export const generateMultipleBlogPosts = async (keywords: string[]): Promise<Array<{ keyword: string; filePath: string; success: boolean }>> => {
  const results = [];
  
  for (const keyword of keywords) {
    try {
      const result = await generateBlogPost(keyword);
      results.push({
        keyword,
        filePath: result.filePath,
        success: true
      });
      console.log(`✅ Generated blog post for: ${keyword}`);
    } catch (error) {
      console.error(`❌ Failed to generate blog post for: ${keyword}`, error);
      results.push({
        keyword,
        filePath: '',
        success: false
      });
    }
  }
  
  return results;
};

export default generateArticlePerplexity;

/*
USAGE EXAMPLES:

// 1. Generate a single article and get the content
const article = await generateArticlePerplexity("React Hooks");
console.log(article.title);
console.log(article.content);

// 2. Generate and save as MDX file
const mdxContent = await generateAndSaveMDX("TypeScript Best Practices", "./my-article.mdx");

// 3. Generate blog post in content directory (recommended)
const result = await generateBlogPost("Next.js Performance");
console.log(`Blog post saved to: ${result.filePath}`);

// 4. Generate multiple blog posts
const keywords = ["React", "TypeScript", "Next.js", "Tailwind CSS"];
const results = await generateMultipleBlogPosts(keywords);
results.forEach(result => {
  if (result.success) {
    console.log(`✅ ${result.keyword}: ${result.filePath}`);
  } else {
    console.log(`❌ ${result.keyword}: Failed`);
  }
});

// 5. Custom filename
const customResult = await generateBlogPost("Machine Learning", "ai-ml-guide");
console.log(`Custom blog post saved to: ${customResult.filePath}`);

// 6. Update all existing articles with interlinks (useful for retroactive linking)
await updateAllArticlesWithInterlinks();

// 7. Check existing articles for interlinking opportunities
const existingArticles = getExistingArticlesForInterlinking();
const opportunities = findInterlinkingOpportunities("React", existingArticles);
console.log(`Found ${opportunities.length} articles to interlink with React`);

// 8. Clean up excessive interlinks from existing articles
await cleanupExcessiveInterlinks();

INTERLINKING FEATURES:

✅ Automatic interlinking when creating new articles
✅ Two-way linking system (new articles link to existing ones, existing ones get updated)
✅ Smart keyword matching for relevant interlinks
✅ Natural placement of interlinks in relevant sections
✅ Manual interlinking updates for existing content
✅ SEO-friendly internal linking structure

The system automatically:
- Analyzes existing articles for relevant keywords and topics
- Suggests interlinks to the AI when generating new content
- Updates existing articles with links to newly created content
- Maintains a connected content ecosystem
*/ 