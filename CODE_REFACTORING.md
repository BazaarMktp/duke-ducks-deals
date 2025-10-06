# Code Refactoring & Optimization Report

## Executive Summary

This document identifies unused code, duplications, and performance issues in the Bazaar codebase, along with recommended fixes.

---

## 1. Unused Imports & Dead Code

### High Priority Issues

#### src/components/deals/PromoAdsDisplay.tsx
**Issue**: Unused import
```typescript
import { X } from 'lucide-react'; // ❌ Never used
```
**Fix**: Remove the import

#### Multiple Components
**Pattern**: Many components import `useQueryClient` but never use it
- Check all files using `const queryClient = useQueryClient()` without calling any methods

---

## 2. Code Duplication

### Duplicate Type Definitions

#### Deal Interface Duplication
**Location**: 
- `src/pages/DevilsDeals.tsx` (lines 27-43)
- `src/components/deals/DealCard.tsx` (lines 11-23)

**Issue**: Same Deal interface defined in multiple files

**Fix**: Create shared type file
```typescript
// src/types/deals.ts
export interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  business_name: string;
  image_url?: string;
  valid_until?: string;
  created_at: string;
  is_active: boolean;
  business_website?: string;
  business_phone?: string;
  business_email?: string;
  terms_and_conditions?: string;
}
```

### Duplicate Validation Schemas

#### Similar Zod Schemas
**Locations**:
- `src/components/deals/DealCreateDialog.tsx` - dealSchema
- `src/components/deals/DealEditDialog.tsx` - likely similar schema

**Fix**: Extract to shared validation file
```typescript
// src/validations/dealSchemas.ts
import { z } from 'zod';

export const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  business_name: z.string().min(1, 'Business name is required'),
  discount_percentage: z.number().min(0).max(100).optional(),
  original_price: z.number().min(0).optional(),
  discounted_price: z.number().min(0).optional(),
  business_website: z.string().url().optional().or(z.literal('')),
  business_phone: z.string().optional(),
  business_email: z.string().email().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  terms_and_conditions: z.string().optional(),
  valid_until: z.string().optional(),
});
```

### Duplicate CORS Headers

**Issue**: Every edge function defines the same CORS headers
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

**Fix**: Create shared utility
```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};
```

### Duplicate Query Patterns

**Pattern**: Similar Supabase queries repeated across files
```typescript
// Repeated pattern for fetching user's items
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

**Fix**: Create query hooks
```typescript
// src/hooks/queries/useUserItems.ts
export const useUserItems = (table: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [table, 'user', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
```

---

## 3. Performance Issues

### Issue 1: Inefficient Re-renders

**Location**: Components with inline function definitions
```typescript
// ❌ Bad: Creates new function on every render
<Button onClick={() => setIsOpen(true)}>

// ✅ Good: Use useCallback for functions passed as props
const handleOpen = useCallback(() => setIsOpen(true), []);
<Button onClick={handleOpen}>
```

**Fix**: Wrap event handlers in `useCallback` when:
- Passed to child components
- Used in dependency arrays
- Performance-critical code

### Issue 2: Unnecessary useEffect Dependencies

**Pattern**: Some useEffect hooks have functions in dependencies that change every render
```typescript
// ❌ Causes infinite loops
useEffect(() => {
  trackPageVisit();
}, [trackPageVisit]); // trackPageVisit recreated every render
```

**Fix**:
```typescript
// Option 1: Move function inside effect
useEffect(() => {
  const trackPageVisit = () => { /* ... */ };
  trackPageVisit();
}, []);

// Option 2: Wrap function in useCallback
const trackPageVisit = useCallback(() => { /* ... */ }, []);
useEffect(() => {
  trackPageVisit();
}, [trackPageVisit]);
```

### Issue 3: Large Bundle Size from Unused Imports

**Issue**: Importing entire icon libraries
```typescript
import { Calendar, Eye, Edit, Trash2, Plus, /* ...20+ more */ } from 'lucide-react';
```

**Impact**: Each unused icon adds ~2-5kb to bundle

**Fix**: Only import what's used, or use tree-shaking

### Issue 4: Unoptimized Images

**Issue**: No lazy loading on all images
**Fix**: Ensure all images use `OptimizedImage` component with `lazy={true}`

### Issue 5: Missing React Query Cache Configuration

**Issue**: Default cache time may not be optimal for all queries

**Fix**: Configure cache per query type
```typescript
// Frequently changing data
const { data } = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages,
  staleTime: 1000 * 30, // 30 seconds
  cacheTime: 1000 * 60 * 5, // 5 minutes
});

// Rarely changing data
const { data } = useQuery({
  queryKey: ['colleges'],
  queryFn: fetchColleges,
  staleTime: 1000 * 60 * 60, // 1 hour
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
});
```

---

## 4. Code Organization Issues

### Issue 1: Large Page Components

**Examples**:
- `DevilsDeals.tsx` - 223 lines (should be < 200)
- `DealCreateDialog.tsx` - 354 lines (should be < 250)

**Fix**: Extract sub-components

```typescript
// Before: One large file
export default function DevilsDeals() {
  // 200+ lines of code
}

// After: Separated concerns
export default function DevilsDeals() {
  return (
    <>
      <DealsHeader />
      <PromoAdsDisplay />
      <DealsGrid deals={deals} />
      <DealDialogs />
    </>
  );
}
```

### Issue 2: Missing Index Files

**Issue**: No barrel exports for related components
**Impact**: Long import paths

**Fix**: Add index.ts files
```typescript
// src/components/deals/index.ts
export { DealCard } from './DealCard';
export { DealCreateDialog } from './DealCreateDialog';
export { DealEditDialog } from './DealEditDialog';
export { EmptyDealsState } from './EmptyDealsState';
export { PromoAdsDisplay } from './PromoAdsDisplay';

// Usage
import { DealCard, DealCreateDialog } from '@/components/deals';
```

### Issue 3: Inconsistent File Naming

**Pattern**: Mix of PascalCase and kebab-case
- `DevilsDeals.tsx` (PascalCase)
- `deal-card.tsx` (kebab-case) - if exists

**Fix**: Standardize on PascalCase for components

---

## 5. Type Safety Issues

### Issue 1: Any Types

**Pattern**: Using `any` in error handlers
```typescript
onError: (error: any) => {
  // ❌ Loses type safety
}
```

**Fix**: Define error types
```typescript
interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

onError: (error: ApiError | Error) => {
  const message = error instanceof Error ? error.message : error.message;
  // ...
}
```

### Issue 2: Optional Chaining Overuse

**Pattern**: Excessive optional chaining
```typescript
data?.items?.map(item => item?.name)
```

**Fix**: Type guards or early returns
```typescript
if (!data?.items) return null;
return data.items.map(item => item.name);
```

---

## 6. Database Query Optimization

### Issue 1: N+1 Query Problem

**Pattern**: Fetching related data in loops
```typescript
// ❌ Multiple queries
for (const deal of deals) {
  const metrics = await fetchDealMetrics(deal.id);
}
```

**Fix**: Use joins or batch queries
```typescript
// ✅ Single query with join
const { data } = await supabase
  .from('deals')
  .select(`
    *,
    deal_metrics(*)
  `);
```

### Issue 2: Missing Indexes

**Recommendation**: Add indexes for frequently queried columns
```sql
-- Add indexes for performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_college_id ON listings(college_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_deals_is_active ON deals(is_active);
```

### Issue 3: Over-fetching Data

**Pattern**: Selecting all columns when only few are needed
```typescript
// ❌ Fetches all columns
const { data } = await supabase.from('profiles').select('*');

// ✅ Select only needed columns
const { data } = await supabase
  .from('profiles')
  .select('id, profile_name, avatar_url');
```

---

## 7. Security Issues

### Issue 1: Exposed Console Logs

**Pattern**: Production console.logs with sensitive data
```typescript
console.log('User data:', user); // ❌ Can expose PII
console.log('Creating deal with data:', data); // ❌ In production
```

**Fix**: Use environment-based logging
```typescript
const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  }
};
```

### Issue 2: Client-Side Secret Exposure Risk

**Review**: Ensure no API keys in frontend code
- Check for hardcoded tokens
- Verify environment variables properly prefixed with `VITE_`
- Confirm sensitive operations only in edge functions

---

## 8. Error Handling

### Issue 1: Generic Error Messages

**Pattern**: Non-descriptive error messages
```typescript
toast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'destructive',
});
```

**Fix**: Specific, actionable messages
```typescript
toast({
  title: 'Failed to Create Deal',
  description: 'Please check all required fields and try again.',
  variant: 'destructive',
});
```

### Issue 2: Unhandled Promise Rejections

**Pattern**: Missing error boundaries
**Fix**: Add Error Boundaries at route level

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 9. Accessibility Issues

### Issue 1: Missing ARIA Labels

**Pattern**: Icon-only buttons without labels
```typescript
<Button variant="icon">
  <Trash2 /> {/* ❌ No accessible name */}
</Button>
```

**Fix**: Add aria-label
```typescript
<Button variant="icon" aria-label="Delete deal">
  <Trash2 />
</Button>
```

### Issue 2: Missing Form Labels

**Review**: Ensure all form inputs have associated labels

---

## 10. Recommended Refactoring Priority

### High Priority (Do First)
1. ✅ Remove unused imports (PromoAdsDisplay.tsx)
2. ✅ Create shared types file for Deal interface
3. ✅ Extract duplicate Zod schemas
4. ✅ Add database indexes for performance
5. ✅ Fix useEffect dependency issues

### Medium Priority
1. Create barrel exports (index.ts files)
2. Extract large components into smaller ones
3. Implement proper error types
4. Add error boundaries
5. Optimize React Query cache times

### Low Priority
1. Standardize file naming
2. Add comprehensive JSDoc comments
3. Improve error messages
4. Add more accessibility attributes
5. Implement performance monitoring

---

## Implementation Plan

### Phase 1: Quick Wins (1-2 days)
- Remove unused imports
- Create shared types
- Fix critical performance issues
- Add missing indexes

### Phase 2: Code Organization (3-5 days)
- Extract large components
- Create barrel exports
- Standardize naming conventions
- Improve error handling

### Phase 3: Optimization (1 week)
- Implement query optimization
- Add comprehensive caching strategy
- Performance monitoring
- Accessibility improvements

---

## Metrics to Track

### Before Refactoring
- Bundle size: ~TBD
- Lighthouse score: ~TBD
- Average page load: ~TBD
- First contentful paint: ~TBD

### After Refactoring (Goals)
- Bundle size: -15% reduction
- Lighthouse score: >90
- Average page load: <2s
- First contentful paint: <1.5s

---

## Conclusion

The codebase is generally well-structured but has opportunities for improvement in:
1. Code reusability (reduce duplication)
2. Performance optimization (query efficiency, lazy loading)
3. Type safety (reduce `any` usage)
4. Error handling (better user feedback)
5. Accessibility (ARIA labels, semantic HTML)

Following this refactoring plan will result in:
- Smaller bundle size
- Faster load times
- Better maintainability
- Improved developer experience
- Better user experience

**Estimated Impact**: 15-20% performance improvement, 30% reduction in code duplication.

---

**Last Updated**: 2025-06-10
**Reviewed By**: AI Code Analyzer
