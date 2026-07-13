# Supabase Credentials for Testing Insights Fix

## Project Reference
- **Project Ref:** `lufozqtrwrmowzojxcoi`
- **Region:** (inferred from URL)
- **Status:** Active

## API Keys
### Anon Key (Public — Safe for Client-Side)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4
```
**Role:** `anon` — Read-only access to public tables

### Service Role Key (Private — Server-Side Only)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI5NzA2MywiZXhwIjoyMDkyODczMDYzfQ.WpASqQnVFjE3vYvr0QMvNjAOLAMTVJg5HndXmU1rzXQ
```
**Role:** `service_role` — Full admin access (never expose to client)

## Database Tables

### Table: `public.insights`
- **Columns:** id, slug, tag, title, subtitle, date, author, source, source_url, summary, img, content_md, featured, category, published, created_at, updated_at
- **RLS:** Enabled
- **Articles:** 17 seed articles (see migrate-insights.sql)
- **Status:** ✓ All articles have `published = true`

## RLS Policies (After Fix)

### Current Policies (Broken)
```sql
-- OLD — Only allows authenticated users
DROP POLICY "insights_read_authenticated" ON public.insights;
CREATE POLICY "insights_read_authenticated"
  ON public.insights
  FOR SELECT
  TO authenticated
  USING (published = true);
```

### Fixed Policies (Solution)
```sql
-- NEW — Allow both anon and authenticated
CREATE POLICY "insights_read_anon"
  ON public.insights
  FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "insights_read_authenticated"
  ON public.insights
  FOR SELECT
  TO authenticated
  USING (published = true);
```

## Test Queries

### Via Supabase SQL Editor
```sql
-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'insights'
ORDER BY policyname;

-- Test data exists
SELECT COUNT(*) as total_articles,
       COUNT(*) FILTER (WHERE published = true) as published,
       COUNT(DISTINCT category) as unique_categories
FROM public.insights;

-- Sample articles
SELECT id, slug, title, category, featured, published
FROM public.insights
ORDER BY created_at DESC
LIMIT 5;
```

### Via Client-Side Console (circle.retbaa.com)
```javascript
// Test with anon key
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'

const supabase = createClient(
  'https://lufozqtrwrmowzojxcoi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4'
)

const { data, error } = await supabase
  .from('insights')
  .select('id, slug, title, category, featured, published')
  .eq('published', true)
  .limit(5)

console.log('Data:', data?.length ?? 0, 'articles')
console.log('Error:', error)
```

## Expected Results After Fix

### Insights Page Load
- ✓ Console shows: `[Insights] Résultat: 17 articles`
- ✓ Featured article visible (Hermès vs LVMH)
- ✓ Grid displays 16 additional articles
- ✓ Filters populated: Tout, Vision, Veille Marché, Afrique, Marché Luxe, Stratégie, Géopolitique, Tech & IA, Distribution
- ✓ Modal opens without errors
- ✓ Markdown content renders (titles, lists, images)

### Before Fix (Current Broken State)
- ✗ Console shows: `[Insights] Aucun article retourné, retry...` → `[Insights] Utilisation du fallback`
- ✗ Only 1 fallback article displayed
- ✗ Filters: only default set
- ✗ Modal has no markdown content

## Deployment Notes

1. **Code Fix:** Deploy `src/pages/InsightsPage.jsx` immediately (next release)
2. **RLS Fix:** Execute `scripts/fix-insights-rls.sql` in Supabase SQL Editor
   - Can be done before or after code deployment
   - No downtime required
   - Can be reverted with SQL if needed

3. **Verification:** After both fixes, test on circle.retbaa.com/insights
   - Check browser console for success logs
   - Load 3-4 articles and verify modal content
   - Test filter selection

## Troubleshooting

### If articles still don't load after RLS fix:
1. Verify RLS policies in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'insights';
   ```
2. Check browser console for network errors
3. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
4. Clear browser cache and rebuild

### To debug RLS issues:
```sql
-- Check if article is published
SELECT id, slug, title, published
FROM public.insights
WHERE slug = 'bifurcation-hermes-lvmh-2026';

-- Test policy with anon role
SET ROLE anon;
SELECT COUNT(*) FROM public.insights WHERE published = true;
RESET ROLE;
```
