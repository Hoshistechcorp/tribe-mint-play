import { motion } from "framer-motion";
import { Zap, BarChart3, QrCode, Trophy, Globe, CreditCard } from "lucide-react";

const features = [
  { icon: Zap, title: "One-Tap Sharing", desc: "Share links to WhatsApp, IG, TikTok, Twitter instantly.", emoji: "⚡" },
  { icon: BarChart3, title: "Real-Time Stats", desc: "Track clicks, sign-ups, and earnings as they happen.", emoji: "📊" },
  { icon: QrCode, title: "QR Codes", desc: "Generate QR codes for in-person sharing at events.", emoji: "📲" },
  { icon: Trophy, title: "Gamified Rewards", desc: "Earn badges, climb leaderboards, unlock prizes.", emoji: "🏆" },
  { icon: Globe, title: "Global Reach", desc: "Promote businesses worldwide with multi-currency payouts.", emoji: "🌍" },
  { icon: CreditCard, title: "Instant Payouts", desc: "Cash out in 24 hours. Withdraw as little as $5!", emoji: "💳" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary font-medium text-sm uppercase tracking-widest mb-3">Packed with goodies</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            Features That <span className="text-gradient-coral">Slap</span> 🔥
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all group shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-1">
                {f.title} {f.emoji}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
