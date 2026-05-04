import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";

const GiftCardProgram = () => {
  const navigate = useNavigate();
  const {
    giftCardProgram: gc,
    enrollGiftCardProgram,
    unenrollGiftCardProgram,
    updateGiftCardProgram,
    toggleGiftCardSales,
    simulateGiftCardRedemption,
  } = useAffiliate();

  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState(gc);
  const [confirmEnroll, setConfirmEnroll] = useState(false);

  const liabilityPct = Math.min(100, (gc.outstandingLiability / Math.max(1, gc.liabilityCap)) * 100);

  // ===== NOT ENROLLED — Opt-in landing =====
  if (!gc.enrolled) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card shadow-card p-6 sm:p-10">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-[11px] font-bold uppercase tracking-wider">
              ✨ AuraLink × Ibloov
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
              Sell Ibloov Gift Cards <span className="font-display italic text-primary">at your venue.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Perfect for bars, lounges, clubs and restaurants. Opt in once, and TribeMint creators
              start selling branded gift cards customers can redeem in your venue. Inventory, fraud
              checks, and payouts handled by Ibloov.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {[
                { emoji: "📈", title: "New revenue", desc: "Cash upfront — guests redeem later." },
                { emoji: "🛡️", title: "Fraud-protected", desc: "Unique codes, single-use, tracked." },
                { emoji: "👛", title: "No subscriptions", desc: `Just ${gc.platformFeePercent}% per redeemed card.` },
              ].map((b) => (
                <div key={b.title} className="p-4 rounded-xl bg-background/60 border border-border">
                  <span className="text-xl mb-2 block">{b.emoji}</span>
                  <p className="font-bold text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <button
                onClick={() => setConfirmEnroll(true)}
                className="px-6 py-3 bg-gradient-mint text-primary-foreground rounded-full font-extrabold text-sm shadow-mint hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                🎁 Opt in to Ibloov Gift Cards
              </button>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast({ title: "Demo: program details" }); }}
                className="px-6 py-3 rounded-full font-bold text-sm border border-border hover:bg-muted transition-colors"
              >
                See how it works
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground pt-2">
              By opting in you agree to Ibloov gift card terms — commission only, no monthly fees,
              payouts via Stripe Connect.
            </p>
          </div>
        </div>

        {/* Confirm modal */}
        <AnimatePresence>
          {confirmEnroll && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setConfirmEnroll(false)}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg">Confirm enrollment</h3>
                  <button onClick={() => setConfirmEnroll(false)} className="p-1.5 rounded-lg hover:bg-muted text-sm">✕</button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your venue will appear in the Ibloov Gift Card directory. You can pause sales or
                  unenroll anytime from the settings panel.
                </p>
                <ul className="text-xs space-y-1.5 text-muted-foreground">
                  <li>• Default denominations: ${gc.denominations.join(", $")}</li>
                  <li>• Buyer discount: {gc.redemptionDiscountPercent}%</li>
                  <li>• Liability cap: ${gc.liabilityCap.toLocaleString()}</li>
                  <li>• Platform fee: {gc.platformFeePercent}% per redeemed card</li>
                </ul>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setConfirmEnroll(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-muted text-sm font-bold">
                    Cancel
                  </button>
                  <button
                    onClick={() => { enrollGiftCardProgram(); setConfirmEnroll(false); toast({ title: "You're in! 🎁", description: "Ibloov Gift Cards are now live for your venue." }); }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-mint text-primary-foreground font-bold text-sm shadow-mint"
                  >
                    Enroll my venue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ===== ENROLLED — dashboard =====
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <h2 className="font-heading font-bold text-lg">Ibloov Gift Cards</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              gc.salesActive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
            }`}>{gc.salesActive ? "Selling" : "Paused"}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enrolled {gc.enrolledAt} · {gc.platformFeePercent}% platform fee per redemption
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/business/gift-cards")}
            className="px-3 py-2 rounded-lg bg-gradient-mint text-primary-foreground text-sm font-bold shadow-mint flex items-center gap-1.5"
          >
            ↗ Open manager
          </button>
          <button
            onClick={() => { toggleGiftCardSales(); toast({ title: gc.salesActive ? "Sales paused ⏸️" : "Sales resumed ▶️" }); }}
            className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-bold flex items-center gap-1.5"
          >
            {gc.salesActive ? <>⏸ Pause</> : <>▶ Resume</>}
          </button>
          <button
            onClick={() => { setDraft(gc); setShowSettings(true); }}
            className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-bold flex items-center gap-1.5"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cards issued", value: gc.cardsIssued, emoji: "🧾", color: "text-primary" },
          { label: "Cards redeemed", value: gc.cardsRedeemed, emoji: "🎁", color: "text-secondary" },
          { label: "Gross sales", value: `$${gc.grossSales.toFixed(2)}`, emoji: "📈", color: "text-accent" },
          { label: "Outstanding", value: `$${gc.outstandingLiability.toFixed(2)}`, emoji: "👛", color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{s.emoji}</span>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Liability bar */}
      <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🛡️</span>
            <span className="text-sm font-bold">Liability vs cap</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ${gc.outstandingLiability.toFixed(0)} / ${gc.liabilityCap.toLocaleString()}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${liabilityPct >= 100 ? "bg-destructive" : liabilityPct > 80 ? "bg-accent" : "bg-primary"}`}
            style={{ width: `${liabilityPct}%` }}
          />
        </div>
        {liabilityPct >= 80 && (
          <p className="flex items-center gap-1.5 text-[11px] text-accent font-bold">
            ⚠️ Approaching cap — sales auto-pause at 100%.
          </p>
        )}
      </div>

      {/* Denominations & redemption simulator */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">🏢</span>
            <span className="text-sm font-bold">Live denominations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gc.denominations.map((d) => {
              const buyerPays = +(d * (1 - gc.redemptionDiscountPercent / 100)).toFixed(2);
              return (
                <div key={d} className="px-3 py-2 rounded-xl bg-background/60 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase">${d} card</p>
                  <p className="text-sm font-bold">Buyer pays ${buyerPays}</p>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Buyer discount: <span className="text-foreground font-bold">{gc.redemptionDiscountPercent}%</span> · You absorb the discount, Ibloov takes {gc.platformFeePercent}% on redemption.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🧾</span>
              <span className="text-sm font-bold">Recent redemptions</span>
            </div>
            <button
              onClick={() => { simulateGiftCardRedemption(); toast({ title: "Redemption recorded 🎟️" }); }}
              className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary/20 transition-colors"
            >
              ＋ Demo redeem
            </button>
          </div>
          {gc.recentRedemptions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No redemptions yet — guests' first visits will show up here.</p>
          ) : (
            <ul className="space-y-1.5 max-h-40 overflow-y-auto">
              {gc.recentRedemptions.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-background/50">
                  <span className="font-mono text-muted-foreground">{r.code}</span>
                  <span className="font-bold text-primary">${r.amount}</span>
                  <span className="text-muted-foreground text-[10px]">{r.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg">Gift Card settings</h3>
                <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-muted text-sm">✕</button>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Denominations (comma-separated)</label>
                <input
                  value={draft.denominations.join(", ")}
                  onChange={(e) => setDraft({ ...draft, denominations: e.target.value.split(",").map((x) => Number(x.trim())).filter((n) => !isNaN(n) && n > 0) })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-muted-foreground">Buyer discount</label>
                  <span className="text-xs font-bold text-primary">{draft.redemptionDiscountPercent}% OFF</span>
                </div>
                <input type="range" min={0} max={30} value={draft.redemptionDiscountPercent}
                  onChange={(e) => setDraft({ ...draft, redemptionDiscountPercent: Number(e.target.value) })}
                  className="w-full accent-primary" />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">Liability cap ($)</label>
                <input type="number" min={0} value={draft.liabilityCap}
                  onChange={(e) => setDraft({ ...draft, liabilityCap: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <p className="text-[10px] text-muted-foreground mt-1">Sales auto-pause when outstanding gift card value reaches this number.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (confirm("Unenroll from Ibloov Gift Cards? Existing cards will still be honored.")) {
                      unenrollGiftCardProgram();
                      setShowSettings(false);
                      toast({ title: "Unenrolled", variant: "destructive" });
                    }
                  }}
                  className="px-3 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold"
                >
                  Unenroll
                </button>
                <button
                  onClick={() => { updateGiftCardProgram(draft); setShowSettings(false); toast({ title: "Settings saved ✅" }); }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-mint text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
                >
                  💾 Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GiftCardProgram;