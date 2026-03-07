import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, DollarSign, ArrowDownToLine, ArrowUpFromLine, Clock,
  CheckCircle2, XCircle, Wallet, Building2, CreditCard,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const balanceData = {
  available: 845.0,
  pending: 312.5,
  totalEarned: 4250.0,
  totalWithdrawn: 3092.5,
};

const transactions = [
  { id: "t1", type: "earning" as const, amount: 12.5, source: "The Mint Garden", date: "Mar 7, 2026", status: "completed" as const },
  { id: "t2", type: "earning" as const, amount: 8.0, source: "Azure Hotel & Spa", date: "Mar 7, 2026", status: "completed" as const },
  { id: "t3", type: "withdrawal" as const, amount: -200.0, source: "Bank Transfer", date: "Mar 6, 2026", status: "completed" as const },
  { id: "t4", type: "earning" as const, amount: 22.3, source: "Neon Lounge", date: "Mar 6, 2026", status: "completed" as const },
  { id: "t5", type: "earning" as const, amount: 45.0, source: "Azure Hotel & Spa", date: "Mar 5, 2026", status: "completed" as const },
  { id: "t6", type: "withdrawal" as const, amount: -500.0, source: "Paystack", date: "Mar 3, 2026", status: "completed" as const },
  { id: "t7", type: "earning" as const, amount: 5.6, source: "Bamboo Kitchen", date: "Mar 3, 2026", status: "pending" as const },
  { id: "t8", type: "earning" as const, amount: 18.0, source: "Skyline Suites", date: "Mar 2, 2026", status: "completed" as const },
  { id: "t9", type: "withdrawal" as const, amount: -100.0, source: "Bank Transfer", date: "Mar 1, 2026", status: "failed" as const },
  { id: "t10", type: "earning" as const, amount: 33.0, source: "Coral Bay Resort", date: "Feb 28, 2026", status: "completed" as const },
];

const paymentMethods = [
  { id: "pm1", name: "GTBank ****4521", icon: Building2, default: true },
  { id: "pm2", name: "Paystack Wallet", icon: Wallet, default: false },
  { id: "pm3", name: "Flex-it", icon: CreditCard, default: false },
];

const withdrawalAmounts = [10, 25, 50, 100, 250, 500];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Completed" },
  pending: { icon: Clock, color: "text-secondary", bg: "bg-secondary/10", label: "Pending" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Failed" },
};

const Payouts = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "earning" | "withdrawal">("all");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("pm1");

  const filteredTx = activeFilter === "all" ? transactions : transactions.filter((t) => t.type === activeFilter);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 5) {
      toast({ title: "❌ Minimum $5", description: "Enter at least $5 to withdraw." });
      return;
    }
    if (amount > balanceData.available) {
      toast({ title: "❌ Insufficient balance", description: "You don't have enough available balance." });
      return;
    }
    toast({ title: "✅ Withdrawal Requested!", description: `$${amount.toFixed(2)} will be sent to your account within 24 hours.` });
    setShowWithdraw(false);
    setWithdrawAmount("");
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-heading">Payouts 💸</h1>
              <p className="text-sm text-muted-foreground">Track earnings & withdraw funds</p>
            </div>
          </div>

          {/* Balance cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Available", value: balanceData.available, color: "text-primary", icon: Wallet },
              { label: "Pending", value: balanceData.pending, color: "text-secondary", icon: Clock },
              { label: "Total Earned", value: balanceData.totalEarned, color: "text-accent", icon: ArrowDownToLine },
              { label: "Total Withdrawn", value: balanceData.totalWithdrawn, color: "text-muted-foreground", icon: ArrowUpFromLine },
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
                {filteredTx.map((tx, i) => {
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
                        <span className={`font-bold text-sm font-heading ${
                          tx.amount > 0 ? "text-primary" : "text-foreground"
                        }`}>
                          {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
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
                  <p className="text-3xl font-bold font-heading text-primary">${balanceData.available.toFixed(2)}</p>
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
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Custom amount"
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted border-none text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Payment method */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground font-medium">Withdraw to:</p>
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedMethod(pm.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                        selectedMethod === pm.id
                          ? "bg-primary/10 border border-primary/30 text-foreground"
                          : "bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <pm.icon className="w-4 h-4" />
                      <span className="font-medium">{pm.name}</span>
                      {pm.default && <span className="ml-auto text-[10px] text-primary font-bold">Default</span>}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleWithdraw}
                  className="w-full px-4 py-3.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
                >
                  Withdraw 💸
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div></PageTransition>
  );
};

export default Payouts;
