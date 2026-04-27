import { motion } from "framer-motion";
import { Zap, UserPlus, ShoppingCart, DollarSign, Bell } from "lucide-react";
import { useAffiliate } from "@/contexts/AffiliateContext";

const fallbackActivities = [
  { icon: UserPlus, color: "text-primary", text: "Sarah M. joined Weekend Brunch Push", time: "2m ago" },
  { icon: ShoppingCart, color: "text-secondary", text: "New conversion on Date Night Special", time: "8m ago" },
  { icon: DollarSign, color: "text-primary", text: "$45 commission paid to James K.", time: "15m ago" },
  { icon: Zap, color: "text-accent", text: "Weekend Brunch Push hit 100 conversions!", time: "32m ago" },
  { icon: UserPlus, color: "text-primary", text: "Aisha D. joined Date Night Special", time: "1h ago" },
  { icon: ShoppingCart, color: "text-secondary", text: "New conversion on Weekend Brunch Push", time: "1h ago" },
  { icon: DollarSign, color: "text-primary", text: "$32 commission paid to David O.", time: "2h ago" },
  { icon: Bell, color: "text-muted-foreground", text: "Holiday Menu Launch ended", time: "3h ago" },
];

const ActivityFeed = () => {
  const { activity } = useAffiliate();
  const live = activity.map((a) => ({
    icon: a.emoji === "💰" ? DollarSign : a.emoji === "🔗" ? Zap : a.emoji === "🎯" ? UserPlus : Bell,
    color: "text-primary",
    text: a.text,
    time: a.date,
  }));
  const merged = [...live, ...fallbackActivities].slice(0, 12);
  return (
  <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
    <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
      <Zap className="w-4 h-4 text-primary" /> Activity Feed
    </h3>
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
      {merged.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
        >
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <a.icon className={`w-4 h-4 ${a.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{a.text}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
  );
};

export default ActivityFeed;
