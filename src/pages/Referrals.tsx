import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAffiliate } from "@/contexts/AffiliateContext";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import LinkQRDialog from "@/components/LinkQRDialog";

const Referrals = () => {
  const navigate = useNavigate();
  const { referralCode, referrals, referralEarnings, simulateReferralSignup } = useAffiliate();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const referralUrl = `tribemint.app/join/${referralCode}`;

  const copy = () => {
    navigator.clipboard.writeText(`https://${referralUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "📎 Referral link copied!", description: "Share it with your tribe to earn 10% of their first 30 days." });
  };

  const share = async () => {
    const text = `Join me on TribeMint and start earning from spots you love 💰 ${referralUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: "TribeMint", text, url: `https://${referralUrl}` }); } catch {}
    } else {
      copy();
    }
  };

  const activeRefs = referrals.filter((r) => r.status !== "pending").length;
  const pendingRefs = referrals.filter((r) => r.status === "pending").length;

  const stats = [
    { label: "Total Referred", value: referrals.length, emoji: "👥", color: "text-primary" },
    { label: "Active", value: activeRefs, emoji: "👤+", color: "text-accent" },
    { label: "Pending", value: pendingRefs, emoji: "✨", color: "text-secondary" },
    { label: "Referral Earnings", value: `$${referralEarnings.toFixed(2)}`, emoji: "💲", color: "text-primary" },
  ];

  const statusBadge = (s: string) => {
    if (s === "active") return "bg-primary/10 text-primary";
    if (s === "joined") return "bg-accent/10 text-accent";
    return "bg-secondary/10 text-secondary";
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <span>←</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-heading">Referrals 🤝</h1>
              <p className="text-sm text-muted-foreground">Invite friends & earn 10% of their first 30 days</p>
            </div>
          </div>

          {/* Hero referral card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-mint text-primary-foreground shadow-mint mb-8 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 text-[200px] opacity-10 select-none">🤝</div>
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Your referral link</p>
              <h2 className="text-2xl font-bold font-heading mb-4">Share. Invite. Earn forever.</h2>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-background/20 backdrop-blur-sm mb-4">
                <span className="flex-1 font-mono text-sm font-bold truncate">{referralUrl}</span>
                <button onClick={copy} className="p-2 rounded-lg bg-background/20 hover:bg-background/30 transition-colors">
                  {copied ? <span>✓</span> : <span>📋</span>}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={share}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background text-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                  <span>📤</span> Share
                </button>
                <button onClick={() => setQrOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/20 backdrop-blur-sm font-bold text-sm hover:bg-background/30 transition-colors">
                  <span>📱</span> QR Code
                </button>
                <button onClick={() => { simulateReferralSignup(); toast({ title: "🎉 Demo signup!", description: "A new referral just joined." }); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/20 backdrop-blur-sm font-bold text-sm hover:bg-background/30 transition-colors">
                  <span>✨</span> Simulate signup
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{s.emoji}</span>
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Referrals list */}
          <h2 className="text-lg font-bold font-heading mb-4">Your Tribe</h2>
          <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
            {referrals.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">👥</p>
                <p className="text-muted-foreground text-sm">No referrals yet — share your link above!</p>
              </div>
            ) : (
              referrals.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 px-5 py-4 ${i !== referrals.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-mint text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">Joined {r.joinedAt}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusBadge(r.status)}`}>
                    {r.status}
                  </span>
                  <div className="text-right min-w-[70px]">
                    <p className="font-bold text-sm text-primary">${r.earned.toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">earned</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <LinkQRDialog open={qrOpen} onClose={() => setQrOpen(false)}
        url={`https://${referralUrl}`} label="Referral invite link" />
    </div></PageTransition>
  );
};

export default Referrals;
