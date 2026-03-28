

# TribeMint Landing Page Remix — Full Redesign Plan

## Overview
Completely redesign the landing page to match the reference screenshots and design DNA: dual-audience funnel, Gen-Z native typography (Syne + Instrument Serif), electric lime (#BEFF3B) accent on military green (#2D3B2D), bento grid layouts, social feed mockup hero, floating sticker notifications, and split-screen CTAs. The existing search bar with all its filter features stays intact.

## Design System Updates

**File: `src/index.css`**
- Add Google Fonts: Syne (bold geometric display) + Instrument Serif (italic elegance)
- New CSS variables: `--lime: #BEFF3B`, `--military-green: #2D3B2D`, `--military-dark: #1A2A1A`
- New gradient utilities: `bg-military`, `text-lime`
- Marquee animation keyframes (infinite horizontal scroll)

**File: `tailwind.config.ts`**
- Add `lime` and `military` color tokens
- Add Syne + Instrument Serif to font families
- Add marquee animation keyframe

## Navbar Redesign

**File: `src/components/Navbar.tsx`**
- Simplify nav links to: "How It Works", "Earn", "Tiers", "For Businesses"
- Two CTA buttons always visible: "For Businesses" (outlined) + "Start Earning →" (filled military green)
- Use Syne font for logo "TribeMint" with leaf icon
- Remove theme toggle from nav (keep in settings only)

## Hero Section Remix

**File: `src/components/HeroSection.tsx`**
- Keep the search bar and all filter functionality exactly as-is
- Replace current hero text with left-aligned layout matching reference:
  - "Powered by AuraLink" badge pill
  - Large Syne heading: "Get paid to share what you already love." with "you already love." in Instrument Serif italic
  - Subtext: "Promote restaurants, hotels, clubs, events, and gift cards... Earn 10-15% on every sale."
  - Two large CTAs: "Start Earning Free →" (military green) + "I'm a Business 🏨" (lime)
  - Trust indicators below: "Live now" dot, "💰 24hr payouts", "🔗 One link = tracked forever"
- Add social feed mockup on the right side showing fake creator posts with earnings, handles, tier badges
- Floating sticker notifications: "+$47 just now", "Gift card sold!", "142 clicks today" with slight rotation

## Marquee Bar (New Component)

**File: `src/components/MarqueeBar.tsx`**
- Military green background with lime border top/bottom
- Infinite scrolling categories in bold caps: 🍽️ RESTAURANTS · 🏨 HOTELS · 🍸 LOUNGES · 🎵 CLUBS · 🎪 EVENTS · 🎁 GIFT CARDS · ✈️ TRAVEL · ⚽ SPORTS · 📚 COURSES
- Lime text on military green, TikTok energy

## How It Works Remix

**File: `src/components/HowItWorks.tsx`**
- Expand to 5 steps matching reference: Sign Up Free → Browse Campaigns → Get Your Link → Share Everywhere → Earn & Cash Out
- Large watermark background numbers (1-5)
- Emoji-led with hover pop effects
- "🌿 HOW IT WORKS" pill badge above
- Heading: "Five steps to your first bag." with "bag." in Instrument Serif italic lime color
- 3-column top row + 2-column bottom row grid layout

## What You Earn — Bento Grid (New Component)

**File: `src/components/EarnBentoGrid.tsx`**
- "💰 WHAT YOU EARN FROM" pill badge
- Heading: "Promote the entire ecosystem." with "ecosystem." in Instrument Serif italic
- Subtext: "Every product in iBloov is promotable. One link, tracked from click to cash."
- Bento grid layout:
  - **Gift Cards** (2-column span, military green bg, featured): "10-15% per card sold" — math spelled out
  - **Event Tickets**: "10-15% per ticket"
  - **Venue Bookings**: "8-12% per booking"
  - **Travel Packages**: "8-15% per package"
  - **Learning Courses**: "15-20% per enrollment"
  - **Sportmate**: "5-10% per booking"
- Each card has emoji icon, title, description, lime commission badge

## Win-Win-Win Section (New Component)

**File: `src/components/ThreeSidesSection.tsx`**
- Dark military green background
- "🤝 EVERYBODY EATS" pill badge
- Heading: "Three sides. All winning." with "All winning." in lime/green gradient
- Three cards side by side: Creators, Businesses, Tourists
- Each card with emoji icon, colored label badge, bold heading, description, 5 checkmark benefits
- Check colors: green for creators, red/orange for businesses, blue for tourists

## Tier System (Replaces GamificationSection)

**File: `src/components/TierSection.tsx`**
- "🌱 → 💎 LEVEL UP" pill badge
- Heading: "Grow your rank. Grow your rate." with "Grow your rate." in Instrument Serif italic
- 5 tier cards horizontally: Seedling (5-10%), Sprout (Base +2%), Grower (Base +5%, highlighted), Tribe Leader (Base +8%), Mint Master (Base +12%)
- Each card: tier label, emoji icon, name, requirement, commission badge, perk list
- Grower card has green border/highlight as "active" tier

## Gift Card Spotlight (New Component)

**File: `src/components/GiftCardSpotlight.tsx`**
- Dark military green background
- "🎁 AURALINK × TRIBEMINT" pill badge
- Heading: "Sell gift cards. Keep your cut." with "Keep your cut." in lime italic
- Description + "Start Selling Gift Cards →" CTA
- Right side: 2x2 grid of gift card previews (Classic Dinner $50, Fine Dining $100, Chef's Table $200, Celebration $500) each with "You earn $X" lime badge

## For Businesses Section (New Component)

**File: `src/components/ForBusinessesSection.tsx`**
- "🏨 FOR RESTAURANTS, HOTELS & VENUES" pill badge
- Large heading: "Stop paying for impressions. Pay for results." with "Pay for results." in military green italic
- Description paragraph + "Launch Your Campaign →" CTA
- Right side: dark dashboard mockup card showing 47 Active Creators, $18.4K Revenue Driven, 6.7x Campaign ROI, weekly bar chart
- Below: 6 benefit cards in 3x2 grid (Performance-Only Pricing $0, Full-Funnel Attribution 100%, Gift Card Distribution 3.2x, AI Creator Matching, Campaign Dashboard 6.7x, AuraLink Connected 15 cards)

## Demo Video Section (New Component)

**File: `src/components/DemoVideoSection.tsx`**
- "🎬 SEE IT WORK" pill badge
- Heading: "From link to cash out." with "cash out." in italic
- Dark image placeholder with lime play button overlay
- "Watch TribeMint in action" text

## Split-Screen CTA (Replace CTASection)

**File: `src/components/CTASection.tsx`**
- Two-column split: left military green for creators, right dark for businesses
- Creator side: "Stop recommending for free" + proof points + lime CTA
- Business side: "Your next customer is in someone's DMs" + proof points + green CTA

## Index Page Assembly

**File: `src/pages/Index.tsx`**
- New section order:
  1. Navbar
  2. HeroSection (with search bar preserved)
  3. MarqueeBar
  4. HowItWorks (5 steps)
  5. EarnBentoGrid
  6. ThreeSidesSection (dark)
  7. TierSection
  8. GiftCardSpotlight (dark)
  9. ForBusinessesSection
  10. DemoVideoSection
  11. CTASection (split-screen)
  12. Footer

## Files Created (7 new)
- `src/components/MarqueeBar.tsx`
- `src/components/EarnBentoGrid.tsx`
- `src/components/ThreeSidesSection.tsx`
- `src/components/TierSection.tsx`
- `src/components/GiftCardSpotlight.tsx`
- `src/components/ForBusinessesSection.tsx`
- `src/components/DemoVideoSection.tsx`

## Files Modified (6)
- `src/index.css` — new fonts, colors, utilities
- `tailwind.config.ts` — new tokens, animations
- `src/components/Navbar.tsx` — simplified, dual CTA
- `src/components/HeroSection.tsx` — redesigned layout, keep search bar
- `src/components/HowItWorks.tsx` — 5 steps, new design
- `src/components/CTASection.tsx` — split-screen
- `src/pages/Index.tsx` — new section assembly

## Files Removed/Replaced
- `src/components/FeaturesSection.tsx` — replaced by bento grid + business section
- `src/components/GamificationSection.tsx` — replaced by TierSection

