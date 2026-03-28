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
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-xs font-bold uppercase tracking-wider text-foreground mb-4">
            🌿 How It Works
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Five steps to your first{" "}
            <span className="font-display italic text-lime">bag.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {steps.slice(0, 3).map((step, i) => (
            <StepCard key={step.num} step={step} i={i} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="relative p-8 rounded-2xl bg-gradient-card border border-border shadow-card group hover:border-lime/40 transition-colors cursor-default overflow-hidden"
  >
    <span className="absolute -top-2 -right-2 text-7xl font-heading font-extrabold text-muted-foreground/[0.06] select-none">
      {step.num}
    </span>
    <span className="text-4xl mb-4 block">{step.emoji}</span>
    <h3 className="text-xl font-extrabold font-heading mb-2">{step.title}</h3>
    <p className="text-sm text-muted-foreground">{step.desc}</p>
  </motion.div>
);

export default HowItWorks;
