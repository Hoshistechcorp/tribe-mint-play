import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]" />
      </div>
      <div className="container relative z-10">
        <motion.div
          style={{ scale, opacity }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-heading leading-tight">
            Ready to <span className="text-gradient-mint">Earn</span>? 🌿
          </h2>
          <p className="text-lg text-muted-foreground">
            Start promoting businesses you love and earn real rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 font-bold bg-gradient-mint text-primary-foreground rounded-xl shadow-mint text-base hover:opacity-90 transition-opacity"
            >
              Start Earning 🚀
            </button>
            <button className="px-8 py-4 font-bold bg-gradient-coral text-secondary-foreground rounded-xl shadow-coral text-base hover:opacity-90 transition-opacity">
              Register Business 🏨
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
