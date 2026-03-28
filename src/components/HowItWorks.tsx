import { motion } from "framer-motion";

const steps = [
  { num: "01", emoji: "📝", title: "Sign Up Free", desc: "Create your profile in 30 seconds. No fees, no commitments." },
  { num: "02", emoji: "🔍", title: "Browse Campaigns", desc: "Find restaurants, hotels, and experiences that match your vibe." },
  { num: "03", emoji: "🔗", title: "Get Your Link", desc: "One unique link, tracked from click to cash. Instant generation." },
  { num: "04", emoji: "📱", title: "Share Everywhere", desc: "Stories, reels, DMs, tweets — anywhere your audience hangs." },
  { num: "05", emoji: "💰", title: "Earn & Cash Out", desc: "Commission hits your wallet. Withdraw anytime, 24hr processing." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">
            🌿 How It Works
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading">
            Five steps to your first{" "}
            <span className="font-display italic text-lime">bag.</span>
          </h2>
        </motion.div>

        {/* Mobile: single column. Tablet: 2 cols. Desktop: 3+2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {steps.slice(0, 3).map((step, i) => (
            <StepCard key={step.num} step={step} i={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {steps.slice(3).map((step, i) => (
            <StepCard key={step.num} step={step} i={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ step, i }: { step: typeof steps[0]; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
    className="relative p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-card border border-border shadow-card group hover:border-lime/40 transition-colors cursor-default overflow-hidden"
  >
    <span className="absolute -top-2 -right-2 text-5xl sm:text-7xl font-heading font-extrabold text-muted-foreground/[0.06] select-none">
      {step.num}
    </span>
    <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{step.emoji}</span>
    <h3 className="text-base sm:text-xl font-extrabold font-heading mb-1.5 sm:mb-2">{step.title}</h3>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
  </motion.div>
);

export default HowItWorks;
