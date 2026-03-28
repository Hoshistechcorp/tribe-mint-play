import { motion } from "framer-motion";
import { Check } from "lucide-react";

const sides = [
  {
    emoji: "🎯",
    label: "Creators",
    labelColor: "bg-lime/20 text-lime-foreground",
    heading: "Your side hustle just got real.",
    desc: "No inventory, no customer service, no cap.",
    checkColor: "text-lime",
    benefits: [
      "Earn 5-20% on every sale",
      "24hr payouts to your wallet",
      "Level up tiers for higher rates",
      "Free to join, zero risk",
      "Track every click in real-time",
    ],
  },
  {
    emoji: "🏨",
    label: "Businesses",
    labelColor: "bg-secondary/20 text-secondary",
    heading: "Growth without the ad spend.",
    desc: "Pay only when you earn. Period.",
    checkColor: "text-secondary",
    benefits: [
      "$0 upfront cost",
      "100% performance-based",
      "AI-matched to top creators",
      "Full attribution dashboard",
      "AuraLink gift card integration",
    ],
  },
  {
    emoji: "🌍",
    label: "Tourists",
    labelColor: "bg-blue-500/20 text-blue-400",
    heading: "Discover what locals actually love.",
    desc: "Curated by real people, not algorithms.",
    checkColor: "text-blue-400",
    benefits: [
      "Trusted creator recommendations",
      "Exclusive deals via affiliate links",
      "Gift cards for any occasion",
      "Multi-city coverage",
      "Authentic local experiences",
    ],
  },
];

const ThreeSidesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-military-dark relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-lime mb-3 sm:mb-4">
            🤝 Everybody Eats
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white">
            Three sides.{" "}
            <span className="font-display italic text-lime">All winning.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sides.map((side, i) => (
            <motion.div
              key={side.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-military border border-lime/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-lime/30 transition-colors"
            >
              <span className="text-3xl sm:text-4xl block mb-2 sm:mb-3">{side.emoji}</span>
              <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold mb-2 sm:mb-3 ${side.labelColor}`}>
                {side.label}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold font-heading text-white mb-1">{side.heading}</h3>
              <p className="text-xs sm:text-sm text-white/50 mb-3 sm:mb-4">{side.desc}</p>
              <ul className="space-y-1.5 sm:space-y-2">
                {side.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                    <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${side.checkColor}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeSidesSection;
