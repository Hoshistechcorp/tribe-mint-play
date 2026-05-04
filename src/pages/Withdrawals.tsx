import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAffiliate, type Transaction } from "@/contexts/AffiliateContext";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const methodEmojis: Record<string, string> = {
  bank: "🏦", paystack: "💳", flexit: "⚡",
};

const Withdrawals = () => {
  const navigate = useNavigate();
  const { transactions, paymentMethods, balance, confirmWithdrawal, cancelWithdrawal } = useAffiliate();
  const [filter, setFilter] = useState<"pending" | "completed" | "all">("pending");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [confirming, setConfirming] = useState(false);

  const withdrawals = transactions.filter((t) => t.type === "withdrawal");
  const filtered = filter === "all"
    ? withdrawals
    : withdrawals.filter((t) => t.status === filter);

  const pendingCount = withdrawals.filter((t) => t.status === "pending").length;
  const pendingTotal = withdrawals
    .filter((t) => t.status === "pending")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const handleConfirm = (tx: Transaction) => {
    setConfirming(true);
    setTimeout(() => {
      confirmWithdrawal(tx.id);
      setConfirming(false);
      setSelected(null);
      toast({ title: "✅ Payout Confirmed!", description: `$${Math.abs(tx.amount).toFixed(2)} marked as completed.` });
    }, 900);
  };

  const handleCancel = (tx: Transaction) => {
    cancelWithdrawal(tx.id);
    setSelected(null);
    toast({ title: "🚫 Withdrawal canceled", description: `$${Math.abs(tx.amount).toFixed(2)} returned to balance.` });
  };

  const getMethod = (id?: string) => paymentMethods.find((m) => m.id === id);

  const handleExportCSV = () => {
    if (withdrawals.length === 0) {
      toast({ title: "Nothing to export", description: "You have no withdrawals yet." });
      return;
    }
    const escape = (v: string | number) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const headers = ["Reference", "Amount (USD)", "Destination", "Method Type", "Status", "Date", "ETA"];
    const rows = withdrawals.map((tx) => [
      tx.id,
      Math.abs(tx.amount).toFixed(2),
      tx.source,
      getMethod(tx.methodId)?.type || "—",
      tx.status,
      tx.date,
      tx.estimatedArrival || "Within 24 hours",
    ]);
    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `tribemint-withdrawals-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "📥 CSV downloaded", description: `${withdrawals.length} withdrawal${withdrawals.length === 1 ? "" : "s"} exported.` });
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/payouts")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
              <span>←</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading">Withdrawals 🏦</h1>
              <p className="text-sm text-muted-foreground">Review pending payouts and confirm completion</p>
            </div>
            <button onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-mint text-primary-foreground text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity shadow-mint">
              <span>⬇</span>
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span>⏳</span>
                <span className="text-xs text-muted-foreground font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold font-heading text-secondary">{pendingCount}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-sm">⬆️</span>
                <span className="text-xs text-muted-foreground font-medium">Pending Amount</span>
              </div>
              <p className="text-2xl font-bold font-heading text-primary">${pendingTotal.toFixed(2)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <span>✅</span>
                <span className="text-xs text-muted-foreground font-medium">Total Withdrawn</span>
              </div>
              <p className="text-2xl font-bold font-heading text-accent">${balance.totalWithdrawn.toFixed(2)}</p>
            </motion.div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {([
              { label: `Pending (${pendingCount})`, value: "pending" as const },
              { label: "Completed", value: "completed" as const },
              { label: "All", value: "all" as const },
            ]).map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f.value
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Withdrawals list */}
          <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">🏦</p>
                <p className="text-muted-foreground text-sm mb-4">No {filter === "all" ? "" : filter} withdrawals</p>
                <button onClick={() => navigate("/payouts")}
                  className="px-5 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm">
                  Request a Withdrawal
                </button>
              </div>
            ) : (
              filtered.map((tx, i) => {
                const emoji = methodEmojis[getMethod(tx.methodId)?.type || ""] || "⬆️";
                const isPending = tx.status === "pending";
                return (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-4 px-5 py-4 ${i !== filtered.length - 1 ? "border-b border-border" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isPending ? "bg-secondary/10 text-secondary" :
                      tx.status === "completed" ? "bg-primary/10 text-primary" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                       <span className="text-lg">{emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">${Math.abs(tx.amount).toFixed(2)} → {tx.source}</p>
                      <p className="text-xs text-muted-foreground">{tx.date} · {tx.estimatedArrival || "Within 24h"}</p>
                    </div>
                    <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                      isPending ? "bg-secondary/10 text-secondary" :
                      tx.status === "completed" ? "bg-primary/10 text-primary" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {tx.status === "completed" ? <><span>✅</span>Done</> :
                       isPending ? <><span>⏳</span>Pending</> :
                       <><span>❌</span>Failed</>}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(tx)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                        title="Review">
                        <span>👁</span>
                      </button>
                      {isPending && (
                        <button onClick={() => setSelected(tx)}
                          className="hidden sm:inline-flex px-3 py-2 bg-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors">
                          Confirm
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !confirming && setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-heading">Withdrawal Details</h3>
                {!confirming && (
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted">
                    <span>✕</span>
                  </button>
                )}
              </div>

              <div className="text-center p-5 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-4xl font-bold font-heading text-primary">${Math.abs(selected.amount).toFixed(2)}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span>#️⃣</span>
                  <div className="flex-1"><p className="text-xs text-muted-foreground">Reference</p>
                    <p className="font-mono text-xs">{selected.id}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span>🏢</span>
                  <div className="flex-1"><p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium">{selected.source}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                   <span>📅</span>
                  <div className="flex-1"><p className="text-xs text-muted-foreground">Requested</p>
                    <p className="font-medium">{selected.date}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span>⏳</span>
                  <div className="flex-1"><p className="text-xs text-muted-foreground">ETA</p>
                    <p className="font-medium">{selected.estimatedArrival || "Within 24 hours"}</p></div>
                </div>
              </div>

              {selected.status === "pending" ? (
                <div className="flex gap-3">
                  <button onClick={() => handleCancel(selected)} disabled={confirming}
                    className="flex-1 px-4 py-3 border border-destructive/30 text-destructive rounded-xl font-medium text-sm hover:bg-destructive/10 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={() => handleConfirm(selected)} disabled={confirming}
                    className="flex-1 px-4 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center justify-center gap-2 disabled:opacity-70">
                    {confirming ? (<><span>⏳</span> Confirming...</>) : "Confirm Payout ✅"}
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded-xl text-center text-sm font-medium ${
                  selected.status === "completed" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}>
                  {selected.status === "completed" ? "✅ Payout completed" : "🚫 Withdrawal canceled"}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div></PageTransition>
  );
};

export default Withdrawals;
