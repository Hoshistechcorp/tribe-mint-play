import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { useAffiliate, type GiftCard } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";

type Tab = "overview" | "inventory" | "redemptions" | "settlements";
type StatusFilter = "all" | GiftCard["status"];

const GiftCardsDashboard = () => {
  const navigate = useNavigate();
  const {
    giftCardProgram: gc,
    enrollGiftCardProgram,
    toggleGiftCardSales,
    updateGiftCardProgram,
    simulateGiftCardRedemption,
    redeemGiftCard,
    voidGiftCard,
    resendGiftCard,
    exportGiftCardsCSV,
    businessProfile,
  } = useAffiliate();

  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<GiftCard | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState(gc);
  const [redeemAmount, setRedeemAmount] = useState<string>("");
  const [scanCode, setScanCode] = useState("");

  const liabilityPct = Math.min(100, (gc.outstandingLiability / Math.max(1, gc.liabilityCap)) * 100);
  const netPayout = +(gc.redeemedValue * (1 - gc.platformFeePercent / 100)).toFixed(2);
  const platformFeeOwed = +(gc.redeemedValue * (gc.platformFeePercent / 100)).toFixed(2);
  const avgFace = gc.cards.length > 0 ? +(gc.cards.reduce((s, c) => s + c.faceValue, 0) / gc.cards.length).toFixed(2) : 0;
  const redemptionRate = gc.cardsIssued > 0 ? Math.round((gc.cardsRedeemed / gc.cardsIssued) * 100) : 0;

  const filteredCards = useMemo(() => {
    return gc.cards.filter((c) => {
      const matchSearch = !search ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        (c.buyerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.buyerEmail ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.creatorHandle ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [gc.cards, search, statusFilter]);

  const handleExport = () => {
    const csv = exportGiftCardsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ibloov-gift-cards-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported ✅", description: `${gc.cards.length} cards saved as CSV` });
  };

  const handleScanRedeem = () => {
    const target = gc.cards.find((c) => c.code.toLowerCase() === scanCode.trim().toLowerCase());
    if (!target) { toast({ title: "Code not found", variant: "destructive" }); return; }
    if (target.status !== "active") { toast({ title: `Card is ${target.status}`, variant: "destructive" }); return; }
    setSelected(target);
    setRedeemAmount(String(target.remainingBalance));
    setScanCode("");
  };

  const handleRedeem = (card: GiftCard) => {
    const amt = Number(redeemAmount);
    if (!amt || amt <= 0 || amt > card.remainingBalance) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    const ok = redeemGiftCard(card.id, amt);
    if (ok) {
      toast({ title: "Redeemed 🎟️", description: `$${amt.toFixed(2)} from ${card.code}` });
      setSelected(null);
      setRedeemAmount("");
    }
  };

  // ===== Not enrolled gate =====
  if (!gc.enrolled) {
    return (
      <PageTransition>
        <Navbar />
        <div className="min-h-screen bg-background pt-16">
          <div className="container py-16 max-w-2xl space-y-6 text-center">
            <span>🎁</span>
            <h1 className="text-3xl font-extrabold font-heading">Gift Card Manager</h1>
            <p className="text-muted-foreground">
              Your venue isn't enrolled in the Ibloov Gift Card program yet. Opt in to start
              tracking sales, redemptions, and settlement payouts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { enrollGiftCardProgram(); toast({ title: "You're in! 🎁" }); }}
                className="px-6 py-3 rounded-full bg-gradient-mint text-primary-foreground font-extrabold text-sm shadow-mint flex items-center gap-2"
              >
                <span>✨</span> Opt in now
              </button>
              <button
                onClick={() => navigate("/business-dashboard")}
                className="px-6 py-3 rounded-full border border-border text-sm font-bold hover:bg-muted"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview 📊" },
    { key: "inventory", label: `Inventory (${gc.cards.length})` },
    { key: "redemptions", label: "Redemptions 🎟️" },
    { key: "settlements", label: "Settlements 💸" },
  ];

  const statusColor: Record<GiftCard["status"], string> = {
    active: "bg-primary/15 text-primary",
    redeemed: "bg-secondary/15 text-secondary",
    expired: "bg-muted text-muted-foreground",
    voided: "bg-destructive/15 text-destructive",
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-xl">
          <div className="container flex flex-wrap items-center gap-3 h-auto py-3 sm:h-16 sm:py-0">
            <button onClick={() => navigate("/business-dashboard")} className="p-2 rounded-lg hover:bg-muted">
              <span>←</span>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-bold text-base sm:text-lg flex items-center gap-2">
                <span>🎁</span> Gift Card Manager
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                {businessProfile.name} · {gc.salesActive ? "Selling" : "Sales paused"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { toggleGiftCardSales(); toast({ title: gc.salesActive ? "Sales paused ⏸️" : "Sales resumed ▶️" }); }}
                className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold flex items-center gap-1.5"
              >
                {gc.salesActive ? <><span>⏸</span> Pause</> : <><span>▶</span> Resume</>}
              </button>
              <button
                onClick={() => { setDraft(gc); setShowSettings(true); }}
                className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold flex items-center gap-1.5"
              >
                <span>⚙️</span> Settings
              </button>
            </div>
          </div>
        </div>

        <div className="container py-6 space-y-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Cards issued", value: gc.cardsIssued, emoji: "🧾", color: "text-primary" },
              { label: "Cards redeemed", value: `${gc.cardsRedeemed} (${redemptionRate}%)`, emoji: "🎁", color: "text-secondary" },
              { label: "Gross sales", value: `$${gc.grossSales.toFixed(2)}`, emoji: "📈", color: "text-accent" },
              { label: "Outstanding", value: `$${gc.outstandingLiability.toFixed(2)}`, emoji: "👛", color: "text-primary" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{s.emoji}</span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
                </div>
                <p className={`text-lg sm:text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Liability bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span className="font-bold">Liability vs cap</span>
              </div>
              <span className="text-muted-foreground">${gc.outstandingLiability.toFixed(0)} / ${gc.liabilityCap.toLocaleString()}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${liabilityPct >= 100 ? "bg-destructive" : liabilityPct > 80 ? "bg-accent" : "bg-primary"}`}
                style={{ width: `${liabilityPct}%` }}
              />
            </div>
            {liabilityPct >= 80 && (
              <p className="flex items-center gap-1.5 text-[11px] text-accent font-bold">
                <span>⚠️</span> Approaching cap — sales auto-pause at 100%.
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-4">
              {/* Quick redeem (POS) */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <h3 className="font-heading font-bold">Point-of-sale redemption</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan or enter the code from a guest's gift card to redeem at checkout.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleScanRedeem()}
                    placeholder="IBL-XXXXX"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={handleScanRedeem}
                    disabled={!scanCode.trim()}
                    className="px-5 py-3 rounded-lg bg-gradient-mint text-primary-foreground font-bold text-sm shadow-mint disabled:opacity-50"
                  >
                    Look up
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-background/60 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Avg face</p>
                    <p className="text-sm font-bold">${avgFace}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Net payout</p>
                    <p className="text-sm font-bold text-primary">${netPayout}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase">Fee owed</p>
                    <p className="text-sm font-bold text-accent">${platformFeeOwed}</p>
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm">Recent redemptions</h3>
                  <button
                    onClick={() => { simulateGiftCardRedemption(); toast({ title: "Demo redemption recorded" }); }}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    + Demo
                  </button>
                </div>
                {gc.recentRedemptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No redemptions yet.</p>
                ) : (
                  <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                    {gc.recentRedemptions.map((r) => (
                      <li key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-background/50">
                        <span className="font-mono text-muted-foreground truncate">{r.code}</span>
                        <span className="font-bold text-primary">${r.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}

          {/* INVENTORY TAB */}
          {tab === "inventory" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <span>🔍</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search code, buyer, creator…"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-bold"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="redeemed">Redeemed</option>
                  <option value="voided">Voided</option>
                  <option value="expired">Expired</option>
                </select>
                <button onClick={handleExport} className="px-3 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-bold flex items-center gap-1.5">
                  <span>⬇</span> CSV
                </button>
              </div>

              {filteredCards.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground rounded-2xl border border-dashed border-border">
                  <span>🎁</span>
                  <p className="text-sm">No gift cards match your filters yet.</p>
                  <p className="text-xs mt-1">Cards will appear here as they're sold.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border overflow-hidden bg-gradient-card shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-background/60 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="text-left px-4 py-3">Code</th>
                          <th className="text-left px-4 py-3">Buyer</th>
                          <th className="text-left px-4 py-3">Channel</th>
                          <th className="text-right px-4 py-3">Face</th>
                          <th className="text-right px-4 py-3">Remaining</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCards.map((c) => (
                          <tr key={c.id} className="border-t border-border hover:bg-background/40 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-bold truncate">{c.buyerName ?? "—"}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{c.buyerEmail ?? ""}</p>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {c.soldVia === "creator" && c.creatorHandle ? (
                                <span className="text-primary">{c.creatorHandle}</span>
                              ) : (
                                <span className="capitalize text-muted-foreground">{c.soldVia}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-xs">${c.faceValue}</td>
                            <td className="px-4 py-3 text-right font-bold text-xs text-primary">${c.remainingBalance.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor[c.status]}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => { setSelected(c); setRedeemAmount(String(c.remainingBalance)); }}
                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 ml-auto"
                              >
                                Manage <span>›</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* REDEMPTIONS TAB */}
          {tab === "redemptions" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {gc.recentRedemptions.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground rounded-2xl border border-dashed border-border">
                  <span>🎁</span>
                  <p className="text-sm">No redemptions yet.</p>
                </div>
              ) : (
                gc.recentRedemptions.map((r) => {
                  const card = gc.cards.find((c) => c.code === r.code);
                  return (
                    <div key={r.id} className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                        <span>✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs">{r.code}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {card?.buyerName ?? "Walk-in guest"}{card?.creatorHandle ? ` · via ${card.creatorHandle}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${r.amount.toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* SETTLEMENTS TAB */}
          {tab === "settlements" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Pending payout</p>
                  <p className="text-2xl font-bold font-heading text-primary">${netPayout.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">From ${gc.redeemedValue.toFixed(2)} redeemed</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Platform fee</p>
                  <p className="text-2xl font-bold font-heading text-accent">${platformFeeOwed.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{gc.platformFeePercent}% per redeemed card</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <p className="text-[11px] text-muted-foreground uppercase font-bold">Next settlement</p>
                  <p className="text-2xl font-bold font-heading">Weekly</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Via Stripe Connect</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
                  <span>💲</span> Settlement history
                </h3>
                {gc.settlements.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No settlements yet. Your first weekly payout will appear here once the cycle closes.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {gc.settlements.map((s) => (
                      <li key={s.id} className="py-3 flex items-center justify-between text-sm">
                        <div>
                          <p className="font-bold">{s.date}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {s.cardsCount} cards · ${s.grossRedeemed.toFixed(2)} gross
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${s.netPayout.toFixed(2)}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{s.status}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Card detail / redeem drawer */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelected(null)}>
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-card border border-border shadow-card p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg">Gift card details</h3>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted"><span>✕</span></button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-mint text-primary-foreground">
                  <p className="text-[10px] uppercase font-bold opacity-80">Ibloov Gift Card</p>
                  <p className="font-mono text-base mt-1">{selected.code}</p>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-80">Remaining</p>
                      <p className="text-2xl font-bold font-heading">${selected.remainingBalance.toFixed(2)}</p>
                    </div>
                    <p className="text-xs opacity-80">of ${selected.faceValue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-background/60">
                    <p className="text-[10px] text-muted-foreground uppercase">Buyer</p>
                    <p className="font-bold truncate">{selected.buyerName ?? "—"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{selected.buyerEmail ?? ""}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60">
                    <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                    <p className={`font-bold capitalize ${selected.status === "active" ? "text-primary" : selected.status === "voided" ? "text-destructive" : ""}`}>
                      {selected.status}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60">
                    <p className="text-[10px] text-muted-foreground uppercase">Sold via</p>
                    <p className="font-bold capitalize">{selected.soldVia}{selected.creatorHandle ? ` · ${selected.creatorHandle}` : ""}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/60">
                    <p className="text-[10px] text-muted-foreground uppercase">Issued</p>
                    <p className="font-bold">{selected.issuedAt}</p>
                    <p className="text-[10px] text-muted-foreground">Exp {selected.expiresAt}</p>
                  </div>
                </div>

                {selected.status === "active" && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-bold">Redeem at venue</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <input
                          type="number"
                          value={redeemAmount}
                          onChange={(e) => setRedeemAmount(e.target.value)}
                          step="0.01"
                          min="0.01"
                          max={selected.remainingBalance}
                          className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <button
                        onClick={() => handleRedeem(selected)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-mint text-primary-foreground font-bold text-sm shadow-mint flex items-center gap-1.5"
                      >
                        <span>✓</span> Redeem
                      </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { resendGiftCard(selected.id); toast({ title: "Email resent 📧" }); }}
                        className="flex-1 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <span>✉️</span> Resend email
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Void ${selected.code}? This cannot be undone.`)) {
                            voidGiftCard(selected.id);
                            toast({ title: "Card voided", variant: "destructive" });
                            setSelected(null);
                          }
                        }}
                        className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-bold flex items-center gap-1.5"
                      >
                         🚫 Void
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg">Program settings</h3>
                  <button onClick={() => setShowSettings(false)} className="p-1.5 rounded-lg hover:bg-muted"><span>✕</span></button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Denominations</label>
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
                </div>
                <button
                  onClick={() => { updateGiftCardProgram(draft); setShowSettings(false); toast({ title: "Settings saved ✅" }); }}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-mint text-primary-foreground font-bold text-sm flex items-center justify-center gap-2"
                >
                  <span>💾</span> Save changes
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default GiftCardsDashboard;