import { motion } from "framer-motion";

const badges = [
  { emoji: "💼", name: "City Explorer", desc: "Visit 5 restaurants", earned: true },
  { emoji: "🎉", name: "Event Pro", desc: "Attend 3 events", earned: true },
  { emoji: "⭐", name: "Top Influencer", desc: "10 successful links", earned: false },
  { emoji: "🔥", name: "Streak Master", desc: "7-day share streak", earned: false },
];

const leaderboard = [
  { rank: 1, name: "ChefLover_NG", earnings: "$2,340", avatar: "🧑‍🍳" },
  { rank: 2, name: "VibeQueen", earnings: "$1,890", avatar: "👑" },
  { rank: 3, name: "FoodieKing", earnings: "$1,650", avatar: "🍔" },
  { rank: 4, name: "NightOwl_LDN", earnings: "$1,200", avatar: "🦉" },
  { rank: 5, name: "TravelBoss", earnings: "$980", avatar: "✈️" },
];

const GamificationSection = () => {
  return (
    <section id="earn" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-3">Level up your hustle</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            Earn, Compete, <span className="text-gradient-mint">Win</span> 🏆
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold font-heading mb-6">Your Badges 🎖️</h3>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`p-4 rounded-xl border shadow-card ${
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
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            id="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold font-heading mb-6">Leaderboard 🏅</h3>
            <div className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden">
              {leaderboard.map((user, i) => (
                <div
                  key={user.name}
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
