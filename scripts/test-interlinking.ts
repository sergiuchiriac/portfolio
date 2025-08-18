#!/usr/bin/env tsx

import { 
  generateBlogPost, 
  updateAllArticlesWithInterlinks, 
  getExistingArticlesForInterlinking,
  findInterlinkingOpportunities 
} from '../src/lib/generateArticlePerplexity';

async function testInterlinking() {
  console.log('🧪 Testing Article Interlinking System\n');

  try {
    // 1. Check existing articles
    console.log('1. 📚 Checking existing articles...');
    const existingArticles = getExistingArticlesForInterlinking();
    console.log(`   Found ${existingArticles.length} existing articles:`);
    existingArticles.forEach(article => {
      console.log(`   - ${article.title} (${article.slug})`);
    });

    // 2. Test interlinking opportunities for a specific keyword
    console.log('\n2. 🔍 Testing interlinking opportunities...');
    const opportunities = findInterlinkingOpportunities('saas', existingArticles);
    console.log(`   Found ${opportunities.length} articles relevant to 'saas':`);
    opportunities.forEach(article => {
      console.log(`   - ${article.title} (relevance score: ${article.relevanceScore})`);
    });

    // 3. Generate a new article (this will automatically add interlinks)
    console.log('\n3. ✍️  Generating new article with interlinks...');
    const result = await generateBlogPost('React Performance Optimization');
    console.log(`   ✅ Generated article: ${result.filePath}`);

    // 4. Update all existing articles with interlinks
    console.log('\n4. 🔗 Updating all existing articles with interlinks...');
    await updateAllArticlesWithInterlinks();
    console.log('   ✅ Interlinking update completed!');

    // 5. Final check of updated articles
    console.log('\n5. 📊 Final article status...');
    const updatedArticles = getExistingArticlesForInterlinking();
    console.log(`   Total articles: ${updatedArticles.length}`);
    
    console.log('\n🎉 Interlinking test completed successfully!');
    console.log('\nYour articles are now interconnected with relevant internal links.');
    console.log('This improves SEO, user engagement, and content discoverability.');

  } catch (error) {
    console.error('❌ Error during interlinking test:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testInterlinking();
}

export { testInterlinking }; 