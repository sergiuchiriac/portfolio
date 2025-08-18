import { NextRequest, NextResponse } from 'next/server';
import { 
  generateBlogPost, 
  generateMultipleBlogPosts, 
  getContentDirectory, 
  verifyContentDirectory, 
  listExistingBlogPosts 
} from '@/lib/generateArticlePerplexity';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, filename, multiple, keywords } = body;

    // Validate request body
    if (!keyword && !multiple) {
      return NextResponse.json(
        { error: 'Missing required field: keyword or multiple' },
        { status: 400 }
      );
    }

    if (multiple && (!keywords || !Array.isArray(keywords) || keywords.length === 0)) {
      return NextResponse.json(
        { error: 'Multiple mode requires keywords array' },
        { status: 400 }
      );
    }

    // Verify content directory before proceeding
    const contentDirStatus = verifyContentDirectory();
    console.log('Content directory status:', contentDirStatus);

    if (!contentDirStatus.exists) {
      console.log(`Content directory will be created at: ${contentDirStatus.path}`);
    }

    // Generate single blog post
    if (keyword) {
      try {
        const result = await generateBlogPost(keyword, filename);
        
        // Get updated content directory status
        const updatedStatus = verifyContentDirectory();
        const existingPosts = listExistingBlogPosts();
        
        return NextResponse.json({
          success: true,
          message: 'Blog post generated successfully',
          data: {
            keyword,
            filePath: result.filePath,
            content: result.content,
            filename: filename || `${keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}.mdx`,
            frontmatter: {
              title: result.content.match(/^# (.+)$/m)?.[1] || `Complete Guide to ${keyword}`,
              summary: result.content.split('\n\n')[1] || `A comprehensive guide to ${keyword}`,
              content: result.content
            },
            contentDirectory: {
              path: updatedStatus.path,
              exists: updatedStatus.exists,
              writable: updatedStatus.writable,
              totalFiles: updatedStatus.files
            },
            existingPosts: existingPosts.map(post => ({
              filename: post.filename,
              size: post.size,
              modified: post.modified
            }))
          }
        });
      } catch (error) {
        console.error('Error generating single blog post:', error);
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to generate blog post',
            details: error instanceof Error ? error.message : 'Unknown error',
            contentDirectory: verifyContentDirectory()
          },
          { status: 500 }
        );
      }
    }

    // Generate multiple blog posts
    if (multiple && keywords) {
      try {
        const results = await generateMultipleBlogPosts(keywords);
        
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;
        
        // Get updated content directory status
        const updatedStatus = verifyContentDirectory();
        const existingPosts = listExistingBlogPosts();
        
        return NextResponse.json({
          success: true,
          message: `Generated ${successCount} out of ${keywords.length} blog posts`,
          data: {
            total: keywords.length,
            successful: successCount,
            failed: failedCount,
            results: results.map(result => ({
              keyword: result.keyword,
              success: result.success,
              filePath: result.filePath,
              error: result.success ? null : 'Generation failed'
            })),
            contentDirectory: {
              path: updatedStatus.path,
              exists: updatedStatus.exists,
              writable: updatedStatus.writable,
              totalFiles: updatedStatus.files
            },
            existingPosts: existingPosts.map(post => ({
              filename: post.filename,
              size: post.size,
              modified: post.modified
            }))
          }
        });
      } catch (error) {
        console.error('Error generating multiple blog posts:', error);
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to generate multiple blog posts',
            details: error instanceof Error ? error.message : 'Unknown error',
            contentDirectory: verifyContentDirectory()
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        contentDirectory: verifyContentDirectory()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contentDirStatus = verifyContentDirectory();
    const existingPosts = listExistingBlogPosts();
    
    return NextResponse.json({
      message: 'Blog Generation API',
      contentDirectory: {
        path: contentDirStatus.path,
        exists: contentDirStatus.exists,
        writable: contentDirStatus.writable,
        totalFiles: contentDirStatus.files
      },
      existingPosts: existingPosts.map(post => ({
        filename: post.filename,
        size: post.size,
        modified: post.modified
      })),
      endpoints: {
        POST: {
          description: 'Generate blog posts',
          body: {
            single: {
              keyword: 'string (required)',
              filename: 'string (optional)'
            },
            multiple: {
              multiple: 'boolean (true)',
              keywords: 'string[] (required)'
            }
          },
          examples: {
            single: {
              keyword: 'React Hooks',
              filename: 'react-hooks-guide'
            },
            multiple: {
              multiple: true,
              keywords: ['React', 'Vue', 'Angular']
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in GET endpoint:', error);
    return NextResponse.json({
      message: 'Blog Generation API',
      error: 'Failed to get status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 