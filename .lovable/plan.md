

# End-to-End Frontend Feature Review & Enhancement Plan

## Current State Summary

The project has **11 pages** — all using hardcoded mock data with no backend. Here's what exists and what's missing:

| Page | Status | Gaps |
|------|--------|------|
| Landing (Index) | Complete | None |
| Search Results | Complete | No link generation after finding a business |
| Business Detail | Complete | Reviews are static, no "promote this" flow |
| Campaigns | Complete | Join action just copies text, no state change |
| Dashboard (Creator) | Complete | No real link generation/tracking simulation |
| Payouts | Complete | Withdrawal has no confirmation or history update |
| Leaderboard | Complete | Static data, no tie to creator actions |
| Creator Profile | Complete | Save does nothing persistent |
| Business Dashboard | Complete | Campaign creation modal doesn't add to list |
| Onboarding | Complete | Doesn't persist role or redirect properly |

## Plan: Polish Affiliate Link Tracking & Payouts (Mock/Demo)

Since we're keeping it demo, the goal is to make the **end-to-end user journey feel real** with local state management, simulated tracking, and working UI flows.

### 1. Affiliate Link Tracking Simulation

**Files: `src/pages/Dashboard.tsx`, `src/pages/BusinessDetail.tsx`, `src/pages/Campaigns.tsx`**

- Add a shared local state context (`src/contexts/AffiliateContext.tsx`) that stores:
  - Generated affiliate links (business ID, unique code, click count, conversions, earnings)
  - Active campaign joins
- On Business Detail page: add a "Promote This" button that generates a trackable link and saves it to context
- On Campaigns page: "Join Campaign" actually adds campaign to context and shows it in Dashboard
- On Dashboard: links and earnings pull from context instead of hardcoded arrays
- Add a simulated "click counter" that increments randomly over time (setInterval) to show live tracking
- Add a "Copy Link" action with toast confirmation and clipboard write

### 2. Payouts & Withdrawals Enhancement

**Files: `src/pages/Payouts.tsx`**

- Add a withdrawal confirmation modal with:
  - Selected amount display
  - Selected payment method
  - "Confirm Withdrawal" button
  - Processing state with spinner
- After confirming: deduct from available balance, add a new transaction to the list with "pending" status
- Add a "Mark as Default" action for payment methods that actually updates state
- Add an "Add Payment Method" mini form (type + details) that appends to the list

### 3. Affiliate Context Provider

**New file: `src/contexts/AffiliateContext.tsx`**

- React context with `useState` for:
  - `affiliateLinks`: array of generated links with click/conversion/earning data
  - `joinedCampaigns`: array of campaign IDs the user has joined
  - `balance`: available, pending, total earned, total withdrawn
  - `transactions`: earnings and withdrawal history
- Helper functions: `generateLink()`, `joinCampaign()`, `requestWithdrawal()`, `addPaymentMethod()`
- Wrap app in provider via `App.tsx`

### 4. Connect the Dots

**Files: `src/pages/SearchResults.tsx`, `src/pages/BusinessDetail.tsx`**

- On search results: each business card gets a small "Generate Link" icon button
- On business detail: prominent "Promote This Business" CTA that generates link + navigates to dashboard
- Campaign join → appears in dashboard active links section
- Withdrawal → updates balance and transaction list immediately

### Files Changed/Created

| Action | File |
|--------|------|
| Create | `src/contexts/AffiliateContext.tsx` |
| Edit | `src/App.tsx` (wrap with provider) |
| Edit | `src/pages/Dashboard.tsx` (use context) |
| Edit | `src/pages/Payouts.tsx` (withdrawal flow, payment methods) |
| Edit | `src/pages/Campaigns.tsx` (join state) |
| Edit | `src/pages/BusinessDetail.tsx` (promote button) |
| Edit | `src/pages/SearchResults.tsx` (generate link button) |

