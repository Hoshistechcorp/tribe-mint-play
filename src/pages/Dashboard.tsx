import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  MousePointerClick,
  Users,
  TrendingUp,
  Link2,
  Copy,
  ExternalLink,
} from "lucide-react";

const stats = [
  { label: "Total Earned", value: "$1,245.00", icon: DollarSign, color: "text-primary" },
  { label: "Total Clicks", value: "8,432", icon: MousePointerClick, color: "text-secondary" },
  { label: "Sign-Ups", value: "312", icon: Users, color: "text-accent" },
  { label: "Avg EPC", value: "$0.85", icon: TrendingUp, color: "text-primary" },
];

const links = [
  { id: "1", name: "The Mint Garden", code: "mint-garden", clicks: 2340, earned: "$420.00", active: true },
  { id: "2", name: "Azure Hotel & Spa", code: "azure-hotel", clicks: 1890, earned: "$340.20", active: true },
  { id: "3", name: "Neon Lounge", code: "neon-lounge", clicks: 980, earned: "$78.40", active: true },
  { id: "4", name: "Bamboo Kitchen", code: "bamboo-kitchen", clicks: 650, earned: "$65.00", active: false },
];

const badges = [
  { emoji: "💼", name: "City Explorer", desc: "Visit 5 spots", earned: true },
  { emoji: "🎉", name: "Event Pro", desc: "3 events shared", earned: true },
  { emoji: "⭐", name: "Top Promoter", desc: "10 links", earned: true },
  { emoji: "🔥", name: "Streak Master", desc: "7-day streak", earned: false },
  { emoji: "💎", name: "Diamond Earner", desc: "$1K earned", earned: true },
  { emoji: "🌍", name: "Global Reach", desc: "3 cities", earned: false },
];

const earningsHistory = [
  { date: "Today", amount: "+$12.50", source: "The Mint Garden" },
  { date: "Today", amount: "+$8.00", source: "Azure Hotel" },
  { date: "Yesterday", amount: "+$22.30", source: "Neon Lounge" },
  { date: "Yesterday", amount: "+$5.60", source: "Bamboo Kitchen" },
  { date: "Mar 4", amount: "+$45.00", source: "Azure Hotel" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`tribemint.link/${code}`);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-lg">Creator Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/payouts")}
              className="px-4 py-2 border border-border text-foreground rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              Payouts 💸
            </button>
            <button
              onClick={() => navigate("/search")}
              className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
            >
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
              <button
                onClick={() => navigate("/search")}
                className="text-sm text-primary font-medium hover:underline"
              >
                + New Link
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm font-heading truncate">{link.name}</p>
                    <p className="text-xs text-muted-foreground">tribemint.link/{link.code}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold text-foreground text-sm">{link.clicks.toLocaleString()}</p>
                      <p>clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-primary text-sm">{link.earned}</p>
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
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Earnings */}
            <div>
              <h2 className="text-lg font-bold font-heading mb-4">Recent Earnings 💸</h2>
              <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
                {earningsHistory.map((e, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 ${
                      i !== earningsHistory.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{e.source}</p>
                      <p className="text-xs text-muted-foreground">{e.date}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{e.amount}</span>
                  </div>
                ))}
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
                      b.earned
                        ? "bg-gradient-card border-primary/30"
                        : "bg-muted/30 border-border opacity-50"
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
    </div>
  );
};

export default Dashboard;
