import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, TrendingUp, MousePointerClick, ShoppingCart, Crown, Medal } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

type MetricKey = "earnings" | "clicks" | "conversions";
type TimeFilter = "weekly" | "monthly";

const creators = [
  { name: "Chioma Styles", handle: "@chiomastyles", avatar: "👩‍🎨", earnings: 48200, clicks: 32100, conversions: 1840, streak: 12 },
  { name: "David Okonkwo", handle: "@davidcreates", avatar: "🧑‍💻", earnings: 41500, clicks: 28900, conversions: 1620, streak: 8 },
  { name: "Amara Eze", handle: "@amaraeze", avatar: "💃", earnings: 38700, clicks: 41200, conversions: 1510, streak: 15 },
  { name: "Kelechi Bright", handle: "@kelechib", avatar: "🎤", earnings: 35200, clicks: 25600, conversions: 1380, streak: 6 },
  { name: "Fatima Hassan", handle: "@fatimah", avatar: "🧕", earnings: 31800, clicks: 22300, conversions: 1290, streak: 10 },
  { name: "Tunde Adeyemi", handle: "@tundeade", avatar: "📸", earnings: 28400, clicks: 35800, conversions: 1150, streak: 4 },
  { name: "Blessing Nwosu", handle: "@blessingnw", avatar: "✨", earnings: 25100, clicks: 19200, conversions: 1020, streak: 7 },
  { name: "Emeka Johnson", handle: "@emekaj", avatar: "🎬", earnings: 22600, clicks: 17800, conversions: 940, streak: 9 },
  { name: "Aisha Bello", handle: "@aishabello", avatar: "🎨", earnings: 19800, clicks: 15400, conversions: 860, streak: 3 },
  { name: "Samuel Okoro", handle: "@samokoro", avatar: "🏋️", earnings: 17200, clicks: 13900, conversions: 780, streak: 5 },
];

const metricTabs: { key: MetricKey; label: string; icon: typeof TrendingUp }[] = [
  { key: "earnings", label: "Earnings 💰", icon: TrendingUp },
  { key: "clicks", label: "Clicks 🖱️", icon: MousePointerClick },
  { key: "conversions", label: "Conversions 🛒", icon: ShoppingCart },
];

const formatValue = (key: MetricKey, value: number, weekly: boolean) => {
  const v = weekly ? Math.round(value * 0.28) : value;
  if (key === "earnings") return `₦${v.toLocaleString()}`;
  return v.toLocaleString();
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-primary" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-secondary" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [metric, setMetric] = useState<MetricKey>("earnings");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");

  const sorted = [...creators].sort((a, b) => b[metric] - a[metric]);
  const topValue = sorted[0]?.[metric] || 1;

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="container py-8 max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" /> Leaderboard
              </h1>
              <p className="text-sm text-muted-foreground">Top creators ranked by performance</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex gap-2">
            {(["weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  timeFilter === t
                    ? "bg-gradient-mint text-primary-foreground shadow-mint"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "weekly" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>

          {/* Metric Tabs */}
          <div className="flex gap-2 border-b border-border pb-0">
            {metricTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMetric(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  metric === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-3">
            {[sorted[1], sorted[0], sorted[2]].map((creator, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
              if (!creator) return null;
              return (
                <motion.div
                  key={creator.handle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border border-border p-4 text-center space-y-2 ${
                    rank === 1 ? "bg-gradient-card shadow-mint ring-1 ring-primary/20 -mt-4" : "bg-gradient-card shadow-card"
                  }`}
                >
                  <div className="flex justify-center">{getRankIcon(rank)}</div>
                  <div className="text-3xl">{creator.avatar}</div>
                  <p className="font-bold text-sm font-heading truncate">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">{creator.handle}</p>
                  <p className="text-lg font-bold text-gradient-mint">{formatValue(metric, creator[metric], timeFilter === "weekly")}</p>
                  <p className="text-[10px] text-muted-foreground">🔥 {creator.streak} day streak</p>
                </motion.div>
              );
            })}
          </div>

          {/* Full Rankings */}
          <div className="space-y-2">
            {sorted.map((creator, i) => {
              const rank = i + 1;
              const barWidth = (creator[metric] / topValue) * 100;
              return (
                <motion.div
                  key={creator.handle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                >
                  <div className="w-8 flex justify-center">{getRankIcon(rank)}</div>
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                    {creator.avatar}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm font-heading truncate">{creator.name}</p>
                      <p className="font-bold text-sm text-gradient-mint">{formatValue(metric, creator[metric], timeFilter === "weekly")}</p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                        className="h-full rounded-full bg-gradient-mint"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Leaderboard;
