import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useAffiliate } from "@/contexts/AffiliateContext";
import {
  ArrowLeft,
  DollarSign,
  MousePointerClick,
  Users,
  TrendingUp,
  Link2,
  Copy,
  ExternalLink,
  Check,
  Trophy,
  Target,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { affiliateLinks, balance, transactions, badges, creatorProfile } = useAffiliate();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const totalClicks = affiliateLinks.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = affiliateLinks.reduce((s, l) => s + l.conversions, 0);
  const liveEarned = affiliateLinks.reduce((s, l) => s + l.earned, 0);
  const totalEarned = balance.totalEarned + liveEarned;
  const avgEPC = totalClicks > 0 ? (totalEarned / totalClicks) : 0;

  const stats = [
    { label: "Total Earned", value: `$${totalEarned.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
    { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-secondary" },
    { label: "Conversions", value: totalConversions.toLocaleString(), icon: Users, color: "text-accent" },
    { label: "Avg EPC", value: `$${avgEPC.toFixed(2)}`, icon: TrendingUp, color: "text-primary" },
  ];

  const recentEarnings = transactions.filter((t) => t.type === "earning").slice(0, 5);

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`tribemint.link/${code}`);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-lg">Welcome, {creatorProfile.displayName.split(" ")[0]} 👋</h1>
            <p className="text-xs text-muted-foreground">@{creatorProfile.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/campaigns")} className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              <Target className="w-4 h-4" /> Campaigns
            </button>
            <button onClick={() => navigate("/leaderboard")} className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              <Trophy className="w-4 h-4" /> Leaderboard
            </button>
            <button onClick={() => navigate("/profile")} className="px-4 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              ⚙️
            </button>
            <button onClick={() => navigate("/payouts")} className="px-4 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              Payouts 💸
            </button>
            <button onClick={() => navigate("/search")} className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint">
              Find Businesses 🔍
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
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
              <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Links */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading">Your Links 🔗</h2>
              <button onClick={() => navigate("/search")} className="text-sm text-primary font-medium hover:underline">
                + New Link
              </button>
            </div>
            {affiliateLinks.length === 0 ? (
              <div className="p-8 rounded-2xl border border-border bg-gradient-card text-center">
                <p className="text-4xl mb-3">🔗</p>
                <p className="text-muted-foreground text-sm mb-4">No affiliate links yet. Find a business and generate your first link!</p>
                <button onClick={() => navigate("/search")} className="px-6 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm">
                  Explore Businesses
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {affiliateLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.active ? "bg-primary/10" : "bg-muted"}`}>
                      <Link2 className={`w-5 h-5 ${link.active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm font-heading truncate">{link.businessName}</p>
                      <p className="text-xs text-muted-foreground">tribemint.link/{link.code}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground">
                      <div className="text-center">
                        <p className="font-bold text-foreground text-sm">{link.clicks.toLocaleString()}</p>
                        <p>clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-foreground text-sm">{link.conversions}</p>
                        <p>conv.</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-primary text-sm">${link.earned.toFixed(2)}</p>
                        <p>earned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyLink(link.code)}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedLink === link.code ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        {copiedLink === link.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => navigate(`/business/${link.businessId}`)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Earnings */}
            <div>
              <h2 className="text-lg font-bold font-heading mb-4">Recent Earnings 💸</h2>
              <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
                {recentEarnings.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No earnings yet</div>
                ) : (
                  recentEarnings.map((e, i) => (
                    <div
                      key={e.id}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i !== recentEarnings.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{e.source}</p>
                        <p className="text-xs text-muted-foreground">{e.date}</p>
                      </div>
                      <span className="text-sm font-bold text-primary">+${e.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Badges */}
            <div>
              <h2 className="text-lg font-bold font-heading mb-4">Badges 🎖️</h2>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((b, i) => (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    whileHover={{ scale: 1.1 }}
                    className={`p-3 rounded-xl border text-center cursor-default ${
                      b.earned ? "bg-gradient-card border-primary/30" : "bg-muted/30 border-border opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{b.emoji}</span>
                    <p className="text-[10px] font-bold font-heading mt-1 truncate">{b.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></PageTransition>
  );
};

export default Dashboard;
