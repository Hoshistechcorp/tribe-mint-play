import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ibloovLogo from "@/assets/ibloov-logo.jpeg";

/* ─── animation helper ─── */
const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

/* ─── Pill label ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block px-3 py-1.5 rounded-full bg-military/8 border border-military/15 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-4">
    {children}
  </span>
);

const Index = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    navigate(`/search?${params.toString()}`);
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20 sm:pb-0" itemScope itemType="https://schema.org/WebPage">
        <Navbar />

        {/* ═══════════════════════════════════════════════
            1 · HERO
        ═══════════════════════════════════════════════ */}
        <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-20 bg-background overflow-hidden" aria-label="Hero">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="text-center space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                <span>by</span>
                <img src={ibloovLogo} alt="Ibloov" className="h-3.5 sm:h-5 w-auto object-contain" />
              </div>

              {/* 1. Crystal-clear headline */}
              <h1 className="text-[2.4rem] leading-[1.05] sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-foreground">
                Earn commission promoting restaurants,&nbsp;hotels&nbsp;&&nbsp;venues
              </h1>

              {/* 2. One-sentence subheadline */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                TribeMint is a hospitality affiliate platform that connects content creators with restaurants, hotels, bars, lounges, and clubs. Creators earn commission on every sale they drive — businesses pay only for results.
              </p>

              {/* 3. Primary CTA + Secondary CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button onClick={() => navigate("/onboarding")}
                  className="px-8 py-4 font-extrabold bg-military text-lime rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity shadow-mint">
                  Start Earning — Free →
                </button>
                <button onClick={() => navigate("/business-dashboard")}
                  className="px-8 py-4 font-extrabold bg-background text-foreground rounded-full text-sm sm:text-base border-2 border-border hover:border-foreground/40 transition-colors">
                  I'm a Business
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">⚡ <strong>30-sec sign-up</strong></span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">💸 <strong>24h payouts</strong></span>
                <span className="w-1 h-1 rounded-full bg-border hidden sm:inline" />
                <span className="hidden sm:flex items-center gap-1.5">🌍 <strong>Global</strong></span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Marquee */}
        <div className="bg-military border-y-2 border-lime/30 py-2.5 overflow-hidden" aria-hidden="true">
          <div className="animate-marquee whitespace-nowrap flex">
            {[0, 1].map((i) => (
              <span key={i} className="text-lime text-xs sm:text-sm font-extrabold font-heading tracking-[0.12em] uppercase mx-4">
                🍽️ RESTAURANTS · 🏨 HOTELS · 🍸 LOUNGES · 🎵 CLUBS · 🎪 EVENTS · 🎁 GIFT CARDS · ✈️ TRAVEL ·{" "}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            4 · WHAT IT IS
        ═══════════════════════════════════════════════ */}
        <section id="what-it-is" className="py-16 sm:py-24 bg-background" aria-label="What TribeMint is">
          <div className="container max-w-3xl">
            <motion.div {...fadeUp} className="space-y-6">
              <SectionLabel>What TribeMint Is</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                A commission-based affiliate platform{" "}
                <span className="font-display italic text-lime">built for hospitality.</span>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  TribeMint is a two-sided marketplace that connects hospitality businesses — restaurants, hotels, bars, lounges, and clubs — with content creators who promote them to their audiences.
                </p>
                <p>
                  Creators earn a percentage of every sale, booking, or gift card purchase made through their unique tracking link. Businesses pay nothing upfront — they only pay when a creator drives a measurable result.
                </p>
                <p>
                  The platform is a property of <strong className="text-foreground">Ibloov</strong>. It is software — specifically, a web-based platform with a creator dashboard, business dashboard, campaign management tools, gift card distribution, and payout processing via Stripe Connect.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                {[
                  { label: "Product type", value: "Web platform (SaaS)" },
                  { label: "Revenue model", value: "Commission per sale" },
                  { label: "Cost to creators", value: "$0 — always free" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-gradient-card border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{item.label}</p>
                    <p className="text-sm font-bold font-heading mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            5 · WHO IT'S FOR
        ═══════════════════════════════════════════════ */}
        <section id="who-its-for" className="py-16 sm:py-24 bg-card" aria-label="Who TribeMint is for">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="space-y-8">
              <div className="text-center">
                <SectionLabel>Who It's For</SectionLabel>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                  Two sides.{" "}
                  <span className="font-display italic">One platform.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div {...fadeUp} className="p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-card space-y-4">
                  <span className="text-3xl">📱</span>
                  <h3 className="text-lg font-extrabold font-heading">Content Creators</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Food bloggers, travel influencers, lifestyle creators</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Micro-influencers with 500+ followers</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Anyone who recommends restaurants, bars, or hotels to their audience</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> No minimum follower count to join — earn on impact, not reach</li>
                  </ul>
                  <button onClick={() => navigate("/onboarding")}
                    className="w-full py-3 bg-military text-lime rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                    Join as Creator →
                  </button>
                </motion.div>
                <motion.div {...fadeUp} className="p-6 sm:p-8 rounded-2xl bg-background border border-border shadow-card space-y-4">
                  <span className="text-3xl">🏢</span>
                  <h3 className="text-lg font-extrabold font-heading">Hospitality Businesses</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Restaurants, cafés, and fine dining establishments</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Hotels, resorts, and boutique stays</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Bars, lounges, nightclubs, and event venues</li>
                    <li className="flex items-start gap-2"><span className="text-lime mt-0.5">✓</span> Any venue that wants to grow through creator-driven word of mouth</li>
                  </ul>
                  <button onClick={() => navigate("/business-dashboard")}
                    className="w-full py-3 bg-background text-foreground rounded-xl font-bold text-sm border-2 border-border hover:border-foreground/40 transition-colors">
                    Launch a Campaign →
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            6 · PROBLEMS WE SOLVE
        ═══════════════════════════════════════════════ */}
        <section id="problems" className="py-16 sm:py-24 bg-background" aria-label="Problems TribeMint solves">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="space-y-8">
              <div className="text-center">
                <SectionLabel>Problems We Solve</SectionLabel>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                  Real pain points.{" "}
                  <span className="font-display italic text-military">Concrete fixes.</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { who: "Creators", pain: "You recommend restaurants, hotels, and bars to your audience — but earn nothing from it.", fix: "TribeMint gives you a tracked link. Every booking, purchase, or gift card sold through it earns you 8–22% commission." },
                  { who: "Creators", pain: "Brands only work with creators who have 100K+ followers.", fix: "TribeMint has no minimum follower count. You earn based on conversions, not vanity metrics." },
                  { who: "Businesses", pain: "You spend on social ads and influencer posts with no way to track actual revenue impact.", fix: "TribeMint tracks every click, sign-up, and purchase. You see exactly which creator drove which sale." },
                  { who: "Businesses", pain: "You pay influencers upfront with no guarantee of results.", fix: "With TribeMint, you pay commission only when a creator generates a real sale. Zero upfront cost." },
                ].map((p, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
                    <span className="px-2 py-0.5 rounded-md bg-military/10 text-[10px] font-bold uppercase text-muted-foreground">{p.who}</span>
                    <p className="text-sm font-bold text-foreground">{p.pain}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">→ {p.fix}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            7 · HOW IT WORKS
        ═══════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-card" aria-label="How TribeMint works">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-12">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                From sign-up to payout in{" "}
                <span className="font-display italic text-lime">five steps.</span>
              </h2>
            </motion.div>
            <div className="space-y-0">
              {[
                { num: "01", title: "Create your free account", desc: "Sign up as a creator or a business. It takes 30 seconds. No credit card, no subscriptions, no commitments." },
                { num: "02", title: "Browse hospitality campaigns", desc: "Creators find restaurants, hotels, bars, and venues running affiliate campaigns with listed commission rates (8–22%)." },
                { num: "03", title: "Get your unique tracking link", desc: "Each creator gets a unique, tracked affiliate link per business. One click to generate, instantly ready to share." },
                { num: "04", title: "Share with your audience", desc: "Post your link on Instagram, TikTok, Twitter, YouTube, WhatsApp, or anywhere your audience follows you. Every click and conversion is tracked." },
                { num: "05", title: "Earn commission, withdraw anytime", desc: "You earn a percentage of every sale made through your link. Payouts are processed via Stripe Connect within 24 hours." },
              ].map((step, i) => (
                <motion.div key={step.num} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="flex gap-5 sm:gap-8 py-6 border-b border-border last:border-0">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-military flex items-center justify-center text-lime font-heading font-extrabold text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-extrabold font-heading text-base sm:text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            8 · CORE FEATURES
        ═══════════════════════════════════════════════ */}
        <section id="features" className="py-16 sm:py-24 bg-background" aria-label="Core features">
          <div className="container max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-12">
              <SectionLabel>Core Features</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                What you get{" "}
                <span className="font-display italic">out of the box.</span>
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { emoji: "🔗", title: "Unique Affiliate Links", desc: "Each creator gets a tracked link per business. Every click, sign-up, and purchase is attributed in real time." },
                { emoji: "📊", title: "Creator Dashboard", desc: "See your clicks, conversions, earnings, and active campaigns in one dashboard. Track performance by link, by business, by day." },
                { emoji: "🎁", title: "Gift Card Distribution", desc: "Creators can sell Ibloov gift cards for enrolled venues through their links and earn 10–15% commission on every card sold." },
                { emoji: "💰", title: "Multiple Earning Models", desc: "Earn per click (CPC), per sign-up (CPA), or as a percentage of revenue (RevShare). Rates are set by each business." },
                { emoji: "🏆", title: "Creator Tiers & Leaderboard", desc: "Five performance tiers — Seed, Sprout, Grower, Bloom, and Canopy — with increasing commission bonuses as you grow." },
                { emoji: "📈", title: "Business Campaign Manager", desc: "Businesses create campaigns, set budgets, define commission rates, and track ROI from a dedicated dashboard." },
                { emoji: "🎯", title: "Featured Campaigns", desc: "Businesses can feature campaigns that require creator applications and approval, ensuring brand-aligned promotion." },
                { emoji: "👛", title: "Stripe Connect Payouts", desc: "Creator earnings are paid out via Stripe Connect (Express). Withdrawals are processed within 24 hours." },
                { emoji: "🛡️", title: "Fraud Protection", desc: "Gift cards use unique single-use codes. Click tracking includes deduplication. All payouts are validated before release." },
              ].map((f, i) => (
                <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card hover:border-lime/30 transition-colors">
                  <span className="text-2xl block mb-3">{f.emoji}</span>
                  <h3 className="font-extrabold font-heading text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            9 · USE CASES
        ═══════════════════════════════════════════════ */}
        <section id="use-cases" className="py-16 sm:py-24 bg-card" aria-label="Use cases">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="text-center mb-12">
              <SectionLabel>Use Cases</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                How people use{" "}
                <span className="font-display italic text-lime">TribeMint.</span>
              </h2>
            </motion.div>
            <div className="space-y-4">
              {[
                { persona: "Food Blogger", scenario: "You post a review of a new restaurant on Instagram. You include your TribeMint link in your bio. When followers book through your link, you earn 12% of the bill.", outcome: "Passive income from content you were already creating." },
                { persona: "Hotel Business", scenario: "You create a campaign offering 18% commission on bookings. TribeMint matches you with travel creators. You track every booking and only pay when guests actually book.", outcome: "Measurable, performance-based marketing at scale." },
                { persona: "Micro-Influencer", scenario: "You have 800 followers on TikTok. You post a short video about a lounge, share your affiliate link, and earn $0.05 per click plus 8% on purchases.", outcome: "No follower minimum. You earn based on the sales you drive." },
                { persona: "Bar or Club Owner", scenario: "You opt into the Ibloov Gift Card program. Creators sell your gift cards through their links. Customers redeem them at your venue. You pay only a 5% platform fee on redemptions.", outcome: "New revenue channel with zero upfront marketing cost." },
              ].map((u, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.08 }}
                  className="p-5 sm:p-6 rounded-2xl bg-background border border-border shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-military/10 text-xs font-bold">{u.persona}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">{u.scenario}</p>
                  <p className="text-xs text-lime font-bold">→ {u.outcome}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            10 · INTEGRATIONS & PLATFORM
        ═══════════════════════════════════════════════ */}
        <section id="integrations" className="py-16 sm:py-24 bg-background" aria-label="Integrations and supported platforms">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="space-y-8">
              <div className="text-center">
                <SectionLabel>Integrations & Platform</SectionLabel>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                  What TribeMint{" "}
                  <span className="font-display italic">connects to.</span>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Payouts", items: ["Stripe Connect (Express)", "24-hour processing", "Global coverage"] },
                  { label: "Gift Cards", items: ["Ibloov Gift Card system", "AuraLink integration", "Single-use unique codes"] },
                  { label: "Sharing", items: ["Instagram, TikTok", "Twitter / X, YouTube", "WhatsApp, any URL"] },
                  { label: "Tracking", items: ["Click attribution", "Conversion tracking", "Real-time dashboards"] },
                ].map((group) => (
                  <div key={group.label} className="p-5 rounded-2xl bg-gradient-card border border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{group.label}</p>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="text-sm text-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-lime flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                TribeMint is a web-based platform accessible from any browser. No app download required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            11 · TRUST & PROOF
        ═══════════════════════════════════════════════ */}
        <section id="trust" className="py-16 sm:py-24 bg-card" aria-label="Trust and social proof">
          <div className="container max-w-4xl">
            <motion.div {...fadeUp} className="space-y-8">
              <div className="text-center">
                <SectionLabel>Trust & Results</SectionLabel>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                  Numbers that{" "}
                  <span className="font-display italic text-lime">speak.</span>
                </h2>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: "8–22%", label: "Commission rates" },
                  { value: "24h", label: "Payout processing" },
                  { value: "$0", label: "Upfront cost" },
                  { value: "6.7x", label: "Average campaign ROI" },
                ].map((m) => (
                  <div key={m.label} className="p-5 rounded-2xl bg-background border border-border text-center">
                    <p className="text-2xl sm:text-3xl font-extrabold font-heading text-primary">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { name: "Ada O.", role: "Food Creator, Lagos", quote: "I was recommending restaurants for free. Now I earn $2K+ a month from the same content. TribeMint changed everything." },
                  { name: "James T.", role: "Hotel GM, London", quote: "We replaced a $5K/month influencer budget with TribeMint. Same results, 70% lower cost — and we only pay for actual bookings." },
                  { name: "Kenji M.", role: "Lounge Owner, Dubai", quote: "The gift card program alone brought in 140 new customers last quarter. Creators sell the cards — we just welcome the guests." },
                ].map((t) => (
                  <motion.div key={t.name} {...fadeUp}
                    className="p-5 rounded-2xl bg-background border border-border shadow-card space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                Payouts processed via Stripe Connect · Commission-based only — no subscriptions, paywalls, or monthly fees
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            12 · FAQ
        ═══════════════════════════════════════════════ */}
        <section id="faq" className="py-16 sm:py-24 bg-background" aria-label="Frequently asked questions" itemScope itemType="https://schema.org/FAQPage">
          <div className="container max-w-3xl">
            <motion.div {...fadeUp} className="text-center mb-10">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                Common questions,{" "}
                <span className="font-display italic">direct answers.</span>
              </h2>
            </motion.div>
            <div className="space-y-2">
              {[
                { q: "What is TribeMint?", a: "TribeMint is a hospitality affiliate marketing platform by Ibloov. It connects content creators with restaurants, hotels, bars, lounges, and clubs. Creators earn commission on every sale they drive through their unique tracking link." },
                { q: "How much does it cost?", a: "TribeMint is free for creators — there are no subscriptions, monthly fees, or paywalls. Businesses pay commission only when a creator generates a verified sale. There is no upfront cost for either side." },
                { q: "What commission rates can I earn?", a: "Commission rates range from 8% to 22% depending on the business and campaign type. Some campaigns also pay per click (CPC) or per sign-up (CPA) in addition to revenue share." },
                { q: "How do payouts work?", a: "Creator earnings are paid via Stripe Connect (Express). You can withdraw your balance at any time. Withdrawals are processed within 24 hours. The minimum withdrawal is $5." },
                { q: "Do I need a minimum number of followers?", a: "No. TribeMint has no follower minimum. You can join with 500 followers or 500,000. You earn based on the conversions you drive, not your follower count." },
                { q: "What is the Ibloov Gift Card program?", a: "Businesses can opt in to sell Ibloov-branded gift cards through TribeMint creators. Customers buy gift cards at a discount and redeem them at the venue. Creators earn 10–15% commission on each card sold. The business pays a 5% platform fee on redemptions." },
                { q: "How does tracking work?", a: "Each creator gets a unique affiliate link per business. TribeMint tracks clicks, sign-ups, purchases, and gift card sales attributed to that link. All data is visible in real time on the creator and business dashboards." },
                { q: "What kind of businesses can join?", a: "Any hospitality business — restaurants, cafés, hotels, resorts, bars, lounges, nightclubs, event venues, and similar establishments. If you serve customers in a physical venue or through bookings, TribeMint is built for you." },
              ].map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors">
                    <span className="font-bold text-sm pr-4" itemProp="name">{faq.q}</span>
                    <span className="text-muted-foreground flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                      <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            13 · PRICING / GET STARTED
        ═══════════════════════════════════════════════ */}
        <section id="pricing" className="py-16 sm:py-24 bg-card" aria-label="Pricing">
          <div className="container max-w-3xl">
            <motion.div {...fadeUp} className="text-center space-y-6">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                No subscriptions. No tiers.{" "}
                <span className="font-display italic text-lime">Just commission.</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                TribeMint operates on a pure commission model. Creators earn a percentage of every sale. Businesses pay that commission only when a sale happens. There are no monthly fees, no premium plans, and no hidden costs.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
                <div className="p-6 rounded-2xl bg-background border-2 border-military shadow-card text-center space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">For Creators</p>
                  <p className="text-3xl font-extrabold font-heading text-foreground">Free</p>
                  <p className="text-xs text-muted-foreground">No fees, ever. Earn 8–22% per sale.</p>
                  <button onClick={() => navigate("/onboarding")}
                    className="w-full py-3 bg-military text-lime rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                    Start Earning →
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-background border border-border shadow-card text-center space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">For Businesses</p>
                  <p className="text-3xl font-extrabold font-heading text-foreground">$0 <span className="text-sm font-body text-muted-foreground">upfront</span></p>
                  <p className="text-xs text-muted-foreground">Pay commission only on real sales.</p>
                  <button onClick={() => navigate("/business-dashboard")}
                    className="w-full py-3 bg-background text-foreground rounded-xl font-bold text-sm border-2 border-border hover:border-foreground/40 transition-colors">
                    Launch Campaign →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            14 · FINAL CTA
        ═══════════════════════════════════════════════ */}
        <section className="py-0 relative overflow-hidden" aria-label="Call to action">
          <div className="flex flex-col md:grid md:grid-cols-2 min-h-[320px]">
            <motion.div {...fadeUp}
              className="bg-military p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-lime text-[11px] font-bold uppercase tracking-wider mb-3">For Creators</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white mb-4">
                Turn your recommendations into{" "}
                <span className="font-display italic text-lime">income.</span>
              </h2>
              <ul className="space-y-2 mb-6">
                {["Earn 8–22% on every sale you drive", "Payouts via Stripe Connect within 24h", "No minimum followers, no fees"].map((t) => (
                  <li key={t} className="text-white/60 text-sm flex items-center gap-2">
                    <span className="text-lime">✓</span> {t}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/onboarding")}
                className="w-full sm:w-auto sm:self-start px-8 py-4 font-extrabold bg-lime text-military rounded-full text-sm hover:opacity-90 transition-opacity">
                Start Earning — Free →
              </button>
            </motion.div>
            <motion.div {...fadeUp}
              className="bg-military-dark p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-lime/60 text-[11px] font-bold uppercase tracking-wider mb-3">For Businesses</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white mb-4">
                Let creators bring you{" "}
                <span className="font-display italic text-white/80">paying customers.</span>
              </h2>
              <ul className="space-y-2 mb-6">
                {["Pay only for verified results", "Full-funnel attribution from click to sale", "$0 upfront — commission only"].map((t) => (
                  <li key={t} className="text-white/50 text-sm flex items-center gap-2">
                    <span className="text-lime/60">✓</span> {t}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/business-dashboard")}
                className="w-full sm:w-auto sm:self-start px-8 py-4 font-extrabold bg-military text-lime rounded-full text-sm border border-lime/30 hover:opacity-90 transition-opacity">
                Launch Your Campaign →
              </button>
            </motion.div>
          </div>
        </section>

        {/* 15 · FOOTER */}
        <Footer />

        {/* Mobile sticky CTA */}
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-background/95 backdrop-blur-lg border-t border-border">
          <div className="flex gap-2">
            <button onClick={() => navigate("/onboarding")}
              className="flex-[2] px-4 py-3.5 font-extrabold bg-military text-lime rounded-full text-sm shadow-mint active:scale-[0.98] transition-transform">
              Start Earning Free →
            </button>
            <button onClick={() => navigate("/business-dashboard")}
              className="flex-1 px-3 py-3.5 font-extrabold bg-background text-foreground rounded-full text-sm border-2 border-border active:scale-[0.98] transition-transform">
              Business
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Index;
