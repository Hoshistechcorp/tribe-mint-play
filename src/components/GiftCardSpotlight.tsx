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
    <section className="py-16 sm:py-24 bg-military-dark relative overflow-hidden">
      <div className="container relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-lime/10 border border-lime/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-lime">
              🎁 AuraLink × TribeMint
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white">
              Sell gift cards.{" "}
              <span className="font-display italic text-lime">Keep your cut.</span>
            </h2>
            <p className="text-white/60 max-w-md mx-auto lg:mx-0 text-sm sm:text-base">
              Every gift card sold through your link earns you 10-15% commission. The math is simple — share more, earn more.
            </p>
            <button
              onClick={() => navigate("/campaigns")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 font-extrabold bg-lime text-military rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              Start Selling Gift Cards →
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
            {cards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${card.color} shadow-lg cursor-default overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{card.name}</p>
                <p className="text-white text-2xl sm:text-3xl font-extrabold font-heading mb-3 sm:mb-4">{card.value}</p>
                <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-lime text-military text-[10px] sm:text-xs font-extrabold">
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
