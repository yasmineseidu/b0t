# Known Issues

This document tracks known issues in the b0t codebase that are not blocking but should be addressed.

## Build-Time Issues

### ~~Next.js Static Generation Errors~~ ✅ FIXED

**Status**: Fixed on 2025-01-23
**Fixed in**: Commit 8cba0d3
**Severity**: Low
**First Identified**: 2025-01-23

**Description**:
During `npm run build`, Next.js encounters errors when trying to statically generate certain pages:

1. **404 Page (`/not-found`)**
   ```
   Error: <Html> should not be imported outside of pages/_document
   Error occurred prerendering page "/404"
   ```

2. **Auth Signin Page (`/auth/signin`)**
   ```
   TypeError: Cannot read properties of null (reading 'useState')
   Error occurred prerendering page "/auth/signin"
   ```

**Impact**:
- Build fails to complete the static optimization phase
- **Does NOT affect development mode** (`npm run dev` works fine)
- **Does NOT affect runtime functionality** (all pages work correctly when accessed)
- Only affects production build static generation

**Root Cause**:
- Next.js 15 App Router attempting to statically generate pages with client-side hooks
- Root layout contains client components (SessionProvider, ClientProvider, ErrorBoundary)
- These components use React hooks that cannot be executed during static generation

**Workaround**:
- Development mode works perfectly (`npm run dev`)
- The build error was previously hidden by a duplicate `todoist` configuration error
- Pages function correctly at runtime despite build-time errors

**Resolution**:
1. Created `src/pages/_document.tsx` and `src/pages/_error.tsx` for Pages Router compatibility
2. Converted `src/app/not-found.tsx` to client component with 'use client' directive
3. Created `src/app/auth/layout.tsx` with `dynamic: 'force-dynamic'` configuration
4. Added `dynamic: 'force-dynamic'` to root `src/app/layout.tsx`
5. Added null guards for `searchParams` in register and credentials pages

**Result**: Build now completes successfully with all 20 pages generated. ✅

**Related Files**:
- `src/app/not-found.tsx`
- `src/app/auth/signin/page.tsx`
- `src/app/layout.tsx`
- `src/app/global-error.tsx`
- `src/components/providers/SessionProvider.tsx`
- `src/components/providers/ClientProvider.tsx`

---

## Test Issues

### ~~Credential lastUsed Timestamp Tests~~ ✅ FIXED

**Status**: Fixed on 2025-01-23
**Fixed in**: Commit updating test expectations

**Description**:
Two credential tests were failing because they expected `db.update` to be called when retrieving credentials. The `lastUsed` timestamp update was intentionally removed from `getCredential()` for performance reasons (credentials are cached, reducing unnecessary write load).

**Resolution**:
Updated tests to match current implementation:
- Removed expectation for `db.update` call in `getCredential` test
- Removed dedicated "should update lastUsed timestamp" test
- Added comments explaining the performance optimization

**Files Changed**:
- `src/lib/workflows/__tests__/credentials.test.ts`

---

## Notes

- This file tracks issues discovered during the PandaDoc module integration
- New issues should be added with date, description, impact, and potential fixes
- Mark issues as FIXED when resolved with commit reference
