# Business-Controlled Discounts & Click Earnings — End-to-End

Give business managers a real lever: they choose a **discount %** the creator can offer (e.g. 10% off a $50 gift card → buyer sees $45), set a **per-click payout (CPC)** for creators, and cap their exposure with a **discount budget**. Every creator-side surface reflects the discounted price + CPC, and every click/conversion debits the manager's budgets in real time.

---

## 1. The data model (manager's control panel)

Extend `BizCampaign` with the manager's three levers + live spend:

```text
BizCampaign {
  ...existing,
  discountPercent: number,       // 0–50, what the buyer sees off
  discountBudget: number,        // max $ the business will subsidize (discounts)
  discountSpent: number,         // live-tracked
  cpcRate: number,               // $ paid to creator per click (e.g. $0.05)
  clickBudget: number,           // max $ for click payouts
  clickSpent: number,            // live-tracked
  payoutsPaused: boolean,        // auto-flip when a budget hits 0
}
```

Same fields on the creator-facing `Campaign` (read-only mirror) so creators see the offer.

---

## 2. Manager UX — Business Dashboard

**Create / Edit Campaign modal** gets a new "Offer & Payouts" section:

- Discount % slider (0–50%) with live preview: "Original $50 → Buyer pays **$45**"
- Discount budget input ($) with helper: "Covers ~111 redemptions at this rate"
- CPC rate input ($/click), default $0.05
- Click budget input ($) with helper: "Covers ~2,000 clicks"
- Toggle: Pause payouts manually

**Campaigns tab card** gains a "Manager Controls" strip:
- Discount badge (e.g. "10% OFF")
- Two budget bars: Discount spent / budget · Clicks spent / budget
- Quick actions: Pause, Top-up budget (+$100 / +$500 / custom), Edit discount
- Status pill auto-updates to "PAUSED — budget exhausted" when either budget hits 0

**Overview stats** add two tiles: "Discount Spend" and "Click Spend" (live).

---

## 3. Creator-side reflection

Wherever a campaign/business is shown to creators, surface the offer:

- **Campaigns list & BusinessDetail**: discount ribbon "10% OFF for your audience" + crossed-out original price next to discounted price (especially the Gift Card spotlight: $50 → ~~$50~~ **$45**).
- **Generated link / QR**: includes the discount code visually ("Your audience saves 10% with `alex-tribe`").
- **Dashboard link card**: shows the active CPC rate ("$0.05/click") and a small badge if payouts are paused so creators aren't surprised.

---

## 4. Click-based earnings (the new earning model)

Today the simulated tick only credits creators on conversions. Add CPC:

- On every simulated click bump for a link, look up the campaign's `cpcRate` and credit `clickBump * cpcRate` to the creator's `earned` + `balance.available`, **and** debit the campaign's `clickSpent`.
- On every conversion, in addition to commission, debit `discountSpent += originalPrice * discountPercent` (mirrors the subsidy the business is paying the buyer).
- When `clickSpent >= clickBudget` → stop crediting clicks (link still tracks impressions, no $).
- When `discountSpent >= discountBudget` → flip `payoutsPaused = true`, conversions stop, creator card shows "Offer paused".
- Activity feed gets new event types: `💸 +$0.05 click payout from {biz}`, `⚠️ Discount budget exhausted on {campaign}`.

---

## 5. End-to-end loop after this change

```text
Manager sets: 10% off, $500 discount budget, $0.05 CPC, $100 click budget
   ↓
Campaign appears to creators with "10% OFF · $0.05/click" badges
   ↓
Creator generates link / QR — buyer-facing price is auto-discounted
   ↓
Simulated clicks roll in:
   • Creator earned += clicks × $0.05   (until click budget hits $100)
   • Manager clickSpent ticks up live on dashboard
   ↓
Simulated conversions:
   • Creator earned += sale × commission%
   • Manager discountSpent += sale × 10%   (until $500 cap)
   ↓
When either budget exhausts → campaign auto-pauses, both sides notified
   ↓
Manager can top-up budget or change discount → ripples instantly to creators
```

---

## Technical notes

- All logic stays in `AffiliateContext.tsx` (no backend). Add helpers: `topUpCampaignBudget(id, kind, amount)`, `setCampaignDiscount(id, pct)`, `setCampaignCPC(id, rate)`, `pauseCampaign(id)`.
- The existing `setInterval` tick is the single place that mutates clicks/earnings — extend it to also handle CPC credit + budget debits + auto-pause.
- New helper `getDiscountedPrice(original, campaign)` used by Gift Card spotlight, Campaigns cards, BusinessDetail, and link share dialogs.
- Persisted via existing `STORAGE_KEY` so manager budgets survive refresh.
- Defaults for existing seeded campaigns: 10% discount, $500 discount budget, $0.05 CPC, $100 click budget — so the demo is alive immediately.

---

## Files touched

- `src/contexts/AffiliateContext.tsx` — new fields, helpers, tick logic
- `src/components/business/CreateCampaignModal.tsx` — Offer & Payouts section
- `src/pages/BusinessOwnerDashboard.tsx` — manager controls strip + new stat tiles + edit modal fields
- `src/data/sampleCampaigns.ts` — add discount/CPC defaults
- `src/components/GiftCardSpotlight.tsx` — show discounted price
- `src/pages/Campaigns.tsx` + `src/pages/BusinessDetail.tsx` — discount ribbon, CPC badge, paused state
- `src/pages/Dashboard.tsx` + `src/components/CampaignAnalytics.tsx` — show CPC earnings split + paused indicator
- `src/components/LinkQRDialog.tsx` — "your audience saves X%" line

Approve to build, or tell me what to trim/change.
