import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, BarChart3, QrCode, Trophy } from "lucide-react";
import { useRef } from "react";

const features = [
  { icon: Zap, title: "One-Tap Share", desc: "Instant sharing everywhere.", emoji: "⚡" },
  { icon: BarChart3, title: "Live Stats", desc: "Real-time click & earning data.", emoji: "📊" },
  { icon: QrCode, title: "QR Codes", desc: "Share in person at events.", emoji: "📲" },
  { icon: Trophy, title: "Gamified", desc: "Badges, leaderboards, prizes.", emoji: "🏆" },
];

const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section id="features" className="py-24 bg-background overflow-hidden" ref={ref}>
      <motion.div style={{ opacity }} className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            Features That <span className="text-gradient-coral">Slap</span> 🔥
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30, rotate: -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all group shadow-card cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-1">
                {f.title} {f.emoji}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
