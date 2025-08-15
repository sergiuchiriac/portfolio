# Stripe Configuration

This project now supports both test and production Stripe price IDs. The system automatically switches between them based on the `NODE_ENV` environment variable.

## Configuration

### Environment Variables

To use production price IDs, set these environment variables:

```bash
# Production price IDs
STRIPE_SINGLE_CALL_PRICE_ID_PROD=price_your_production_single_call_price_id_here
STRIPE_UNLIMITED_CALLS_PRICE_ID_PROD=price_your_production_unlimited_calls_price_id_here

# Set NODE_ENV to production
NODE_ENV=production
```

### Current Setup

- **Test Environment** (`NODE_ENV !== 'production'`):
  - Single Call: `price_1RwNz8IrXdG4sJIRUumSHe59`
  - Unlimited Calls: `price_1QZ00000000000000000000`

- **Production Environment** (`NODE_ENV === 'production'`):
  - Single Call: Uses `STRIPE_SINGLE_CALL_PRICE_ID_PROD` or falls back to test ID
  - Unlimited Calls: Uses `STRIPE_UNLIMITED_CALLS_PRICE_ID_PROD` or falls back to test ID

## How It Works

The system uses the `src/lib/stripeConfig.ts` file to manage price IDs:

1. **Environment Detection**: Automatically detects if running in production
2. **Fallback Logic**: If production environment variables aren't set, falls back to test IDs
3. **Type Safety**: Maintains TypeScript type safety with `as const`

## Usage

The configuration is automatically imported and used in `src/data/resume.tsx`:

```typescript
import { STRIPE_CONFIG } from "@/lib/stripeConfig";

export const DATA = {
  // ... other data
  stripe: STRIPE_CONFIG,
} as const;
```

## Deployment

When deploying to production:

1. Set `NODE_ENV=production`
2. Set your production Stripe price ID environment variables
3. The system will automatically use production price IDs

## Testing

To test locally with production IDs:
```bash
NODE_ENV=production STRIPE_SINGLE_CALL_PRICE_ID_PROD=price_prod_123 npm run dev
``` 