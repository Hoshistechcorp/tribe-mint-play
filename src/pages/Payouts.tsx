import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAffiliate } from "@/contexts/AffiliateContext";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const withdrawalAmounts = [10, 25, 50, 100, 250, 500];

const statusConfig = {
  completed: { emoji: "✅", color: "text-primary", bg: "bg-primary/10", label: "Completed" },
  pending: { emoji: "⏳", color: "text-secondary", bg: "bg-secondary/10", label: "Pending" },
  failed: { emoji: "❌", color: "text-destructive", bg: "bg-destructive/10", label: "Failed" },
};

const methodIcons: Record<string, typeof Building2> = { bank: Building2, paystack: Wallet, flexit: CreditCard };

const Payouts = () => {
  const navigate = useNavigate();
  const { balance, transactions, paymentMethods, requestWithdrawal, addPaymentMethod, setDefaultPaymentMethod } = useAffiliate();
  const [activeFilter, setActiveFilter] = useState<"all" | "earning" | "withdrawal">("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods.find((m) => m.isDefault)?.id || paymentMethods[0]?.id || "");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodType, setNewMethodType] = useState<"bank" | "paystack" | "flexit">("bank");

  const filteredTx = activeFilter === "all" ? transactions : transactions.filter((t) => t.type === activeFilter);

  const handleWithdrawClick = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 5) {
      toast({ title: "❌ Minimum $5", description: "Enter at least $5 to withdraw." });
      return;
    }
    if (amount > balance.available) {
      toast({ title: "❌ Insufficient balance", description: "You don't have enough available balance." });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmWithdraw = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const amount = parseFloat(withdrawAmount);
      const success = requestWithdrawal(amount, selectedMethod);
      setIsProcessing(false);
      setShowConfirmModal(false);
      if (success) {
        toast({ title: "✅ Withdrawal Requested!", description: `$${amount.toFixed(2)} will be sent to your account within 24 hours.` });
        setWithdrawAmount("");
      }
    }, 1500);
  };

  const handleAddMethod = () => {
    if (!newMethodName.trim()) {
      toast({ title: "❌ Enter a name", description: "Payment method name is required." });
      return;
    }
    addPaymentMethod(newMethodName.trim(), newMethodType);
    toast({ title: "✅ Payment method added!" });
    setNewMethodName("");
    setShowAddMethod(false);
  };

  const selectedMethodObj = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
              <span>←</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading">Payouts 💸</h1>
              <p className="text-sm text-muted-foreground">Track earnings & withdraw funds</p>
            </div>
            <button onClick={() => navigate("/withdrawals")}
              className="px-4 py-2 border border-border rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              Withdrawals 🏦
            </button>
          </div>

          {/* Balance cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Available", value: balance.available, color: "text-primary", emoji: "👛" },
              { label: "Pending", value: balance.pending, color: "text-secondary", emoji: "⏳" },
              { label: "Total Earned", value: balance.totalEarned, color: "text-accent", icon: ArrowDownToLine },
              { label: "Total Withdrawn", value: balance.totalWithdrawn, color: "text-muted-foreground", icon: ArrowUpFromLine },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold font-heading ${s.color}`}>${s.value.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Transaction history */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-heading">Transaction History</h2>
                <div className="flex gap-2">
                  {([
                    { label: "All", value: "all" as const },
                    { label: "Earnings", value: "earning" as const },
                    { label: "Withdrawals", value: "withdrawal" as const },
                  ]).map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeFilter === f.value
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
                {filteredTx.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No transactions yet</div>
                ) : (
                  filteredTx.map((tx, i) => {
                    const status = statusConfig[tx.status];
                    const StatusIcon = status.icon;
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex items-center gap-4 px-5 py-4 ${
                          i !== filteredTx.length - 1 ? "border-b border-border" : ""
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          tx.type === "earning" ? "bg-primary/10" : "bg-secondary/10"
                        }`}>
                          {tx.type === "earning" ? (
                            <ArrowDownToLine className="w-4 h-4 text-primary" />
                          ) : (
                            <ArrowUpFromLine className="w-4 h-4 text-secondary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{tx.source}</p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className={`font-bold text-sm font-heading ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                            {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Withdraw sidebar */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <h3 className="text-lg font-bold font-heading mb-1">Withdraw Funds</h3>
                <p className="text-xs text-muted-foreground mb-4">Min. $5 · Arrives within 24hrs</p>

                <div className="text-center mb-4 p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold font-heading text-primary">${balance.available.toFixed(2)}</p>
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {withdrawalAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                        withdrawAmount === amt.toString()
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative mb-4">
                  <span>💲</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted border-none text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Payment methods */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-medium">Withdraw to:</p>
                    <button
                      onClick={() => setShowAddMethod(!showAddMethod)}
                      className="text-[10px] text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <span>＋</span> Add
                    </button>
                  </div>

                  {/* Stripe Connect — primary payout rail */}
                  <button
                    onClick={() => toast({ title: "Stripe Connect", description: "Connected-account onboarding will launch here. Demo only." })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left border border-primary/40 bg-primary/10 hover:bg-primary/15 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#635bff] text-white flex items-center justify-center text-[10px] font-black tracking-tight">S</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground leading-tight">Stripe Connect</p>
                      <p className="text-[10px] text-muted-foreground">Recommended · Fast global payouts</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary">Connect →</span>
                  </button>
                  
                  {paymentMethods.map((pm) => {
                    const Icon = methodIcons[pm.type] || Building2;
                    return (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedMethod(pm.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                          selectedMethod === pm.id
                            ? "bg-primary/10 border border-primary/30 text-foreground"
                            : "bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium flex-1">{pm.name}</span>
                        {pm.isDefault ? (
                          <span className="text-[10px] text-primary font-bold">Default</span>
                        ) : selectedMethod === pm.id ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setDefaultPaymentMethod(pm.id); toast({ title: "✅ Default updated!" }); }}
                            className="text-[10px] text-muted-foreground hover:text-primary font-medium"
                          >
                            Set default
                          </button>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Add payment method form */}
                <AnimatePresence>
                  {showAddMethod && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="p-3 rounded-xl bg-muted/50 border border-border space-y-2">
                        <div className="flex gap-2">
                          {(["bank", "paystack", "flexit"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setNewMethodType(t)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                newMethodType === t ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {t === "bank" ? "🏦 Bank" : t === "paystack" ? "💳 Paystack" : "⚡ Flex-it"}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={newMethodName}
                          onChange={(e) => setNewMethodName(e.target.value)}
                          placeholder="Account name (e.g. GTBank ****1234)"
                          className="w-full px-3 py-2 rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <div className="flex gap-2">
                          <button onClick={handleAddMethod} className="flex-1 py-2 bg-primary/20 text-primary rounded-lg text-xs font-bold">
                            Add Method
                          </button>
                          <button onClick={() => setShowAddMethod(false)} className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-xs">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleWithdrawClick}
                  className="w-full px-4 py-3.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
                >
                  Withdraw 💸
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !isProcessing && setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-heading">Confirm Withdrawal</h3>
                {!isProcessing && (
                  <button onClick={() => setShowConfirmModal(false)} className="p-1 rounded-lg hover:bg-muted">
                    <span>✕</span>
                  </button>
                )}
              </div>

              <div className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-3xl font-bold font-heading text-primary">${parseFloat(withdrawAmount).toFixed(2)}</p>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 flex items-center gap-3">
                {selectedMethodObj && (
                  <>
                    {(() => { const Icon = methodIcons[selectedMethodObj.type] || Building2; return <Icon className="w-4 h-4 text-muted-foreground" />; })()}
                    <div>
                      <p className="text-sm font-medium">{selectedMethodObj.name}</p>
                      <p className="text-[10px] text-muted-foreground">Arrives within 24 hours</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                {!isProcessing && (
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleConfirmWithdraw}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <><span>⏳</span> Processing...</>
                  ) : (
                    "Confirm 💸"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div></PageTransition>
  );
};

export default Payouts;
