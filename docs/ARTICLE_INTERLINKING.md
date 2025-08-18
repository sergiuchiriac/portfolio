# Article Interlinking System

## Overview
The article interlinking system automatically creates relevant internal links between blog articles to improve SEO and user experience.

## How It Works

### Relevance Scoring System
Articles are now linked based on a sophisticated relevance scoring system:

- **Title Match**: 5 points (highest weight)
- **Summary Match**: 4 points (high weight)  
- **Keyword Match**: 3 points (medium weight)
- **Semantic Relationship**: 1 point per related keyword

**Minimum Threshold**: Articles must score 7+ points to be considered for interlinking.

### Smart Link Placement
- Links are placed in relevant sections when possible
- Falls back to conclusion section if no relevant section found
- Maximum of 2-3 interlinks per article
- Only adds links when they genuinely enhance reader understanding

## Recent Improvements

### Before (Problem)
- Links were added to ALL articles regardless of relevance
- Excessive interlinking (5+ links per article)
- Poor user experience with irrelevant suggestions

### After (Solution)
- **Relevance-based linking**: Only articles with 7+ relevance score get links
- **Quality over quantity**: Maximum 2-3 relevant links per article
- **Smart placement**: Links appear in contextually relevant sections
- **Natural flow**: No forced or irrelevant connections

## Usage

### Generate New Article with Smart Interlinking
```typescript
import { generateBlogPost } from '../src/lib/generateArticlePerplexity';

const result = await generateBlogPost("React Performance");
// Automatically adds relevant interlinks to existing articles
```

### Clean Up Existing Excessive Links
```typescript
import { cleanupExcessiveInterlinks } from '../src/lib/generateArticlePerplexity';

// Remove excessive interlinks from existing articles
await cleanupExcessiveInterlinks();
```

### Run Cleanup Script
```bash
# Clean up existing excessive interlinks
npx tsx scripts/cleanup-interlinks.ts
```

## Configuration

### Relevance Thresholds
- **New Article Generation**: 7+ points required for interlinking
- **Existing Article Updates**: 6+ points required for suggestions
- **Manual Interlinking**: 6+ points required for recommendations

### Link Limits
- **Per Article**: Maximum 2-3 interlinks
- **Per Section**: Maximum 1 interlink per section
- **Quality Control**: Only genuinely relevant connections

## Best Practices

1. **Let the system decide**: Don't force interlinks where they don't fit
2. **Quality over quantity**: Better to have 1 relevant link than 5 irrelevant ones
3. **Natural placement**: Links should flow naturally with the content
4. **Reader value**: Only link when it genuinely helps the reader

## Monitoring

The system provides detailed logging:
- Relevance scores for each potential link
- Number of links added/removed
- Articles skipped due to low relevance
- Cleanup statistics

## Troubleshooting

### Too Many Links
Run the cleanup script:
```bash
npx tsx scripts/cleanup-interlinks.ts
```

### No Links Being Added
Check relevance scores in logs. Articles need 7+ points for automatic linking.

### Irrelevant Links
The new system should prevent this, but you can manually remove unwanted links.

## Future Enhancements

- Machine learning-based relevance scoring
- User feedback integration for link quality
- A/B testing for optimal link placement
- Analytics tracking for interlink performance 