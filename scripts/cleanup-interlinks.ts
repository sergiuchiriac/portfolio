#!/usr/bin/env tsx

import { cleanupExcessiveInterlinks } from '../src/lib/generateArticlePerplexity';

async function main() {
  console.log('🧹 Starting cleanup of excessive interlinks...\n');
  
  try {
    await cleanupExcessiveInterlinks();
    console.log('\n✅ Cleanup completed successfully!');
    console.log('\nYour articles should now have a reasonable number of interlinks.');
    console.log('Future articles will only include relevant interlinks based on content relevance.');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

main(); 