import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-0 relative overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[400px]">
        {/* Creator side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-military p-10 lg:p-16 flex flex-col justify-center"
        >
          <span className="text-lime text-xs font-bold uppercase tracking-wider mb-4">For Creators</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-4">
            Stop recommending{" "}
            <span className="font-display italic text-lime">for free.</span>
          </h2>
          <ul className="space-y-2 mb-6">
            {["Earn on every share", "24hr payouts", "Zero risk, zero fees"].map((t) => (
              <li key={t} className="text-white/60 text-sm flex items-center gap-2">
                <span className="text-lime">✓</span> {t}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/onboarding")}
            className="self-start px-8 py-4 font-extrabold bg-lime text-military rounded-full text-base hover:opacity-90 transition-opacity"
          >
            Start Earning Free →
          </button>
        </motion.div>

        {/* Business side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-military-dark p-10 lg:p-16 flex flex-col justify-center"
        >
          <span className="text-lime/60 text-xs font-bold uppercase tracking-wider mb-4">For Businesses</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mb-4">
            Your next customer is in{" "}
            <span className="font-display italic text-white/80">someone's DMs.</span>
          </h2>
          <ul className="space-y-2 mb-6">
            {["Pay only for results", "AI-matched creators", "$0 upfront cost"].map((t) => (
              <li key={t} className="text-white/50 text-sm flex items-center gap-2">
                <span className="text-lime/60">✓</span> {t}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/business-dashboard")}
            className="self-start px-8 py-4 font-extrabold bg-military text-lime rounded-full text-base border border-lime/30 hover:opacity-90 transition-opacity"
          >
            Launch Your Campaign →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
