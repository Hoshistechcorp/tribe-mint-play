import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Link2, DollarSign } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Search,
    emoji: "🔍",
    title: "Find",
    description: "Search and filter businesses by earning potential.",
    color: "primary" as const,
  },
  {
    icon: Link2,
    emoji: "🔗",
    title: "Link",
    description: "Generate your trackable affiliate link instantly.",
    color: "secondary" as const,
  },
  {
    icon: DollarSign,
    emoji: "💰",
    title: "Earn",
    description: "Share anywhere. Earn per click, sign-up, and sale.",
    color: "accent" as const,
  },
];

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
};

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-gradient-hero opacity-50"
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            How It <span className="text-gradient-mint">Works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 80 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative p-8 rounded-2xl bg-gradient-card border ${colors.border} shadow-card group hover:border-primary/40 transition-colors cursor-default`}
              >
                <div className="absolute -top-4 -left-2 text-5xl font-heading font-bold text-muted-foreground/10">
                  0{i + 1}
                </div>
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5`}>
                  <step.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">
                  {step.title} {step.emoji}
                </h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
