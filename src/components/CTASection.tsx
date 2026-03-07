import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]" />
      </div>
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-heading leading-tight">
            Ready to Join the{" "}
            <span className="text-gradient-mint">Tribe</span>? 🌿
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're a creator looking to earn or a business ready to grow —
            TribeMint makes it fun, fast, and rewarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-4 font-bold bg-gradient-mint text-primary-foreground rounded-xl shadow-mint text-base hover:opacity-90 transition-opacity">
              Sign Up as Creator 🎨
            </button>
            <button className="px-8 py-4 font-bold bg-gradient-coral text-secondary-foreground rounded-xl shadow-coral text-base hover:opacity-90 transition-opacity">
              Register Your Business 🏨
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
