import { motion } from "framer-motion";

const tiers = [
  { emoji: "🌱", name: "Seedling", rate: "5-10%", req: "0 sales", perks: ["Basic dashboard", "Standard links", "Email support"], active: false },
  { emoji: "🌿", name: "Sprout", rate: "Base +2%", req: "10 sales", perks: ["Priority links", "Weekly analytics", "Badge on profile"], active: false },
  { emoji: "🌳", name: "Grower", rate: "Base +5%", req: "50 sales", perks: ["Custom landing page", "Early campaign access", "Direct chat support"], active: true },
  { emoji: "👑", name: "Tribe Leader", rate: "Base +8%", req: "200 sales", perks: ["Featured creator", "Exclusive campaigns", "Revenue share bonus"], active: false },
  { emoji: "💎", name: "Mint Master", rate: "Base +12%", req: "500 sales", perks: ["VIP everything", "Brand partnerships", "Invite-only events"], active: false },
];

const TierSection = () => {
  return (
    <section id="tiers" className="py-16 sm:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground mb-3 sm:mb-4">
            🌱 → 💎 Level Up
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading">
            Grow your rank.{" "}
            <span className="font-display italic text-lime">Grow your rate.</span>
          </h2>
        </motion.div>

        {/* Mobile: horizontal scroll. sm+: grid */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-card cursor-default transition-all min-w-[160px] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink ${
                tier.active
                  ? "bg-military text-lime border-lime/40 shadow-lime ring-2 ring-lime/20"
                  : "bg-gradient-card border-border hover:border-lime/20"
              }`}
            >
              {tier.active && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-lime text-military text-[10px] font-extrabold uppercase">
                  Active
                </span>
              )}
              <span className="text-2xl sm:text-3xl block mb-1.5 sm:mb-2">{tier.emoji}</span>
              <h3 className={`text-sm sm:text-base font-extrabold font-heading mb-1 ${tier.active ? "text-lime" : ""}`}>
                {tier.name}
              </h3>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold mb-2 sm:mb-3 ${
                tier.active ? "bg-lime text-military" : "bg-lime/10 text-foreground"
              }`}>
                {tier.rate}
              </span>
              <p className={`text-[10px] sm:text-[11px] mb-2 sm:mb-3 ${tier.active ? "text-lime/60" : "text-muted-foreground"}`}>
                {tier.req}
              </p>
              <ul className="space-y-1">
                {tier.perks.map((p) => (
                  <li key={p} className={`text-[10px] sm:text-[11px] ${tier.active ? "text-lime/80" : "text-muted-foreground"}`}>
                    • {p}
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

export default TierSection;
