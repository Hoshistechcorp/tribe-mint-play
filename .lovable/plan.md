# End-to-End Flow Audit — What's Missing

I traced both the **Creator** and **Business** journeys through every page and the simulated `AffiliateContext`. Here's a frank gap analysis grouped by funnel, plus what's worth fixing.

---

## 🟢 Creator Funnel (works end-to-end)

```text
Landing → Onboarding (role: Creator) → Dashboard
   ↓                ↓                        ↓
Search ───→ BusinessDetail ─→ Generate Link → Dashboard updates live
   ↓                                         ↓
Campaigns → Join → Link auto-created → Dashboard → Payouts → Withdraw → Tx history
```

This loop is solid — context state, simulated click ticking, confetti, toasts, withdrawal modal all wired up.

## 🟠 Business Funnel (mostly works, some dead ends)

```text
Landing → Onboarding (role: Business) → Business Dashboard
                                              ↓
                                  Create Campaign → list updates
                                  Edit/View Campaign → ❌ no-op
                                  Affiliates tab → ❌ static, no detail view
                                  Profile edit → ✅ works
```

---

## ❌ Gaps Found (ranked by impact)

### 1. Critical — broken / dead UI controls
| Where | What's broken |
|---|---|
| `BusinessOwnerDashboard` campaigns tab | 👁 View and ✏️ Edit buttons do nothing |
| `BusinessOwnerDashboard` stats | "Total Revenue / Affiliates / Rating" are hardcoded strings, don't reflect created campaigns |
| `BusinessDetail` | `isOwner` is hardcoded `false` — edit mode is unreachable |
| `CreatorProfile` "Add Payment Method" | Adds a placeholder row "New Method / Configure details…" — no input form (the proper form exists only in Payouts) |
| Two separate payment-method stores | `CreatorProfile` has its own list, `Payouts`/`AffiliateContext` has another — they never sync |

### 2. High — disconnected state across pages
| Where | What's missing |
|---|---|
| Creator profile data | Onboarding collects displayName, niche, socials → **discarded**. `CreatorProfile` shows hardcoded "Alex Thompson" |
| Business profile data | Onboarding collects business name/category/commission → **discarded**. `BusinessOwnerDashboard` shows hardcoded "The Mint Garden" |
| Business → Creator link | A business owner creates a campaign → it doesn't appear in the Creator's `/campaigns` list (separate `sampleCampaigns` array) |
| Creator earnings → Business revenue | Creator generates clicks/conversions on a link → business dashboard revenue numbers stay static |
| Leaderboard | 100% hardcoded — current user never appears, can't see own rank |
| Dashboard badges | Hardcoded `earned: true/false` — never react to actual milestones (clicks, earnings, links count) |

### 3. Medium — navigation gaps
| Missing entry point | Impact |
|---|---|
| No nav link to `/leaderboard` from Creator Dashboard or Navbar | Page is orphaned |
| No nav link to `/campaigns` from Creator Dashboard | Creators have to go back to landing |
| No login/sign-in concept | Onboarding goes straight to dashboard; no way to "switch role" or revisit onboarding |
| `BusinessDetail` "Join" button on a campaign | Routes to `/campaigns` page instead of joining inline |

### 4. Low — polish
- All data resets on page refresh (no `localStorage` persistence) — context starts fresh every session
- "Total Earned" on Dashboard uses `balance.totalEarned` (static $4,250) instead of summing live link earnings
- Withdrawal pending status never auto-flips to "completed"
- No empty state for businesses with zero campaigns in BusinessDetail
- Notifications / activity feed for creators (only businesses have one)

---

## 🛠 Recommended Fix Priority

**Phase 1 — Wire the existing flows** (highest ROI, low effort)
1. Persist `AffiliateContext` to `localStorage` so demo state survives refresh
2. Save Onboarding output into context → use it in `CreatorProfile` & `BusinessOwnerDashboard`
3. Unify payment methods (delete duplicate state in `CreatorProfile`, read from context)
4. Add Leaderboard + Campaigns links to Creator Dashboard header

**Phase 2 — Make the Business side reactive** (medium effort)
5. Move campaigns list into context so business-created campaigns appear in `/campaigns`
6. Compute Business Dashboard stats from real campaign + link data
7. Make View / Edit buttons in business campaigns tab open a modal

**Phase 3 — Connect the two sides** (the big one)
8. When a creator's link "earns," increment the matching business's revenue
9. Inject current creator into Leaderboard with live rank
10. Auto-award badges when thresholds hit (first link, $100 earned, 10 links, etc.)

**Phase 4 — Polish**
11. Auto-complete pending withdrawals after ~10s (simulated)
12. Add a creator activity feed mirroring the business one
13. Add a "Switch to business view" toggle in Navbar for the demo

---

## How would you like to proceed?

Pick what to tackle and I'll build it:
- **A — Just Phase 1** (quick wins: persistence + onboarding data + nav links + unified payments)
- **B — Phases 1 + 2** (fix everything on each side, but keep them independent)
- **C — Full end-to-end (Phases 1–3)** (the real demo: business actions ripple to creator side and vice versa)
- **D — Custom** — tell me which specific gaps to fix