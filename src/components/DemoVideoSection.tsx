import { motion } from "framer-motion";
import { Play } from "lucide-react";

const DemoVideoSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-xs font-bold uppercase tracking-wider text-foreground mb-4">
            🎬 See It Work
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading">
            From link to{" "}
            <span className="font-display italic text-lime">cash out.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden bg-military aspect-video flex items-center justify-center cursor-pointer group shadow-lg border border-lime/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-military-dark to-military opacity-80" />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-lime flex items-center justify-center group-hover:scale-110 transition-transform shadow-lime">
              <Play className="w-8 h-8 text-military fill-military ml-1" />
            </div>
            <p className="text-white/60 text-sm font-medium">Watch TribeMint in action</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoVideoSection;
