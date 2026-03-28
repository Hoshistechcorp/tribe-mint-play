import { motion } from "framer-motion";

const products = [
  {
    emoji: "🎁",
    title: "Gift Cards",
    rate: "10-15%",
    desc: "$50 dinner gift → you pocket $5-$7.50. Share 20 a month = $100-$150 passive.",
    featured: true,
  },
  { emoji: "🎪", title: "Event Tickets", rate: "10-15%", desc: "Concerts, brunches, festivals — every ticket you sell earns." },
  { emoji: "🏨", title: "Venue Bookings", rate: "8-12%", desc: "Hotels, villas, private venues. High ticket = big payouts." },
  { emoji: "✈️", title: "Travel Packages", rate: "8-15%", desc: "Curated trips and getaways. Premium products, premium commissions." },
  { emoji: "📚", title: "Learning Courses", rate: "15-20%", desc: "Cooking classes, workshops, masterclasses. Highest margins." },
  { emoji: "⚽", title: "Sportmate", rate: "5-10%", desc: "Court bookings, gym passes, sports experiences." },
];

const EarnBentoGrid = () => {
  return (
    <section id="earn" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20 text-xs font-bold uppercase tracking-wider text-foreground mb-4">
            💰 What You Earn From
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Promote the entire{" "}
            <span className="font-display italic text-lime">ecosystem.</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Every product in iBloov is promotable. One link, tracked from click to cash.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 border shadow-card group cursor-default transition-colors ${
                p.featured
                  ? "md:col-span-2 bg-military text-lime border-lime/20 hover:border-lime/40"
                  : "bg-gradient-card border-border hover:border-lime/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{p.emoji}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  p.featured
                    ? "bg-lime text-military"
                    : "bg-lime/15 text-foreground"
                }`}>
                  {p.rate} per sale
                </span>
              </div>
              <h3 className={`text-lg font-extrabold font-heading mb-1 ${p.featured ? "text-lime" : ""}`}>
                {p.title}
              </h3>
              <p className={`text-sm ${p.featured ? "text-lime/70" : "text-muted-foreground"}`}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EarnBentoGrid;
