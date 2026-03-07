import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const badges = [
  { emoji: "💼", name: "City Explorer", desc: "Visit 5 spots", earned: true },
  { emoji: "🎉", name: "Event Pro", desc: "3 events shared", earned: true },
  { emoji: "⭐", name: "Top Promoter", desc: "10 links", earned: false },
  { emoji: "🔥", name: "Streak Master", desc: "7-day streak", earned: false },
];

const leaderboard = [
  { rank: 1, name: "ChefLover_NG", earnings: "$2,340", avatar: "🧑‍🍳" },
  { rank: 2, name: "VibeQueen", earnings: "$1,890", avatar: "👑" },
  { rank: 3, name: "FoodieKing", earnings: "$1,650", avatar: "🍔" },
  { rank: 4, name: "NightOwl_LDN", earnings: "$1,200", avatar: "🦉" },
  { rank: 5, name: "TravelBoss", earnings: "$980", avatar: "✈️" },
];

const GamificationSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="earn" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <motion.div style={{ y }} className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            Earn, Compete, <span className="text-gradient-mint">Win</span> 🏆
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold font-heading mb-6">Badges 🎖️</h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border shadow-card cursor-default ${
                    b.earned
                      ? "bg-gradient-card border-primary/30"
                      : "bg-muted/30 border-border opacity-60"
                  }`}
                >
                  <span className="text-3xl">{b.emoji}</span>
                  <p className="font-bold font-heading text-sm mt-2">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                  {b.earned && (
                    <span className="inline-block mt-2 text-xs text-primary font-medium">✅ Earned</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="leaderboard"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <h3 className="text-xl font-bold font-heading mb-6">Leaderboard 🏅</h3>
            <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
              {leaderboard.map((user, i) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    i !== leaderboard.length - 1 ? "border-b border-border" : ""
                  } ${i === 0 ? "bg-primary/5" : ""}`}
                >
                  <span className={`text-lg font-bold font-heading w-8 ${
                    i === 0 ? "text-primary" : i === 1 ? "text-secondary" : "text-muted-foreground"
                  }`}>
                    #{user.rank}
                  </span>
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                  </div>
                  <span className="font-bold font-heading text-primary">{user.earnings}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
