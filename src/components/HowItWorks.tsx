import { motion } from "framer-motion";
import { Search, Link2, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Search,
    emoji: "🔍",
    title: "Find Hot Spots",
    description: "Search restaurants, hotels, and lounges near you. Filter by vibe, cuisine, or deals.",
    color: "primary" as const,
  },
  {
    icon: Link2,
    emoji: "🔗",
    title: "Get Your Link",
    description: "Generate your unique affiliate link in one tap. Customize it with a vanity code!",
    color: "secondary" as const,
  },
  {
    icon: DollarSign,
    emoji: "💰",
    title: "Share & Earn",
    description: "Share on WhatsApp, IG, TikTok — anywhere. Earn for every click, sign-up, and sale!",
    color: "accent" as const,
  },
];

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20" },
  accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-3">Simple as 1-2-3</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading">
            How <span className="text-gradient-mint">TribeMint</span> Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative p-8 rounded-2xl bg-gradient-card border ${colors.border} shadow-card group hover:border-primary/40 transition-colors`}
              >
                <div className="absolute -top-4 -left-2 text-4xl font-heading font-bold text-muted-foreground/20">
                  0{i + 1}
                </div>
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5`}>
                  <step.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">
                  {step.title} {step.emoji}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
