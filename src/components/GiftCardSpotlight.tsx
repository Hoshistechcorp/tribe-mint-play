import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const cards = [
  { name: "Classic Dinner", value: "$50", earn: "$7.50", color: "from-emerald-600 to-emerald-800" },
  { name: "Fine Dining", value: "$100", earn: "$15.00", color: "from-amber-600 to-amber-800" },
  { name: "Chef's Table", value: "$200", earn: "$30.00", color: "from-purple-600 to-purple-800" },
  { name: "Celebration", value: "$500", earn: "$75.00", color: "from-rose-600 to-rose-800" },
];

const GiftCardSpotlight = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-military-dark relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20 text-xs font-bold uppercase tracking-wider text-lime">
              🎁 AuraLink × TribeMint
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
              Sell gift cards.{" "}
              <span className="font-display italic text-lime">Keep your cut.</span>
            </h2>
            <p className="text-white/60 max-w-md">
              Every gift card sold through your link earns you 10-15% commission. The math is simple — share more, earn more.
            </p>
            <button
              onClick={() => navigate("/campaigns")}
              className="px-8 py-4 font-extrabold bg-lime text-military rounded-full text-base hover:opacity-90 transition-opacity"
            >
              Start Selling Gift Cards →
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-5 bg-gradient-to-br ${card.color} shadow-lg cursor-default overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{card.name}</p>
                <p className="text-white text-3xl font-extrabold font-heading mb-4">{card.value}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-lime text-military text-xs font-extrabold">
                  You earn {card.earn}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftCardSpotlight;
