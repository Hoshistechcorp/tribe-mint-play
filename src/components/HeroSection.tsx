import { motion } from "framer-motion";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-16">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Now in Beta — Join the tribe!
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-heading">
              Share. Promote.{" "}
              <span className="text-gradient-mint">Get Paid.</span>
              <span className="block mt-2 text-gradient-coral">💰</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              The easiest, most fun affiliate platform for Gen-Z creators and hospitality businesses.
              Find local hot spots, share your link, and earn real cash — all gamified! 🎮
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3.5 font-bold bg-gradient-mint text-primary-foreground rounded-xl shadow-mint text-base hover:opacity-90 transition-opacity">
                Start Earning Free 🚀
              </button>
              <button className="px-8 py-3.5 font-bold border border-border text-foreground rounded-xl hover:bg-muted transition-colors text-base">
                I'm a Business 🏨
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg">2K+</span> Creators
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-secondary font-bold text-lg">500+</span> Businesses
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg">$50K+</span> Paid Out
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <img
                src={heroIllustration}
                alt="TribeMint - Share, promote and earn with affiliate links"
                className="w-full max-w-md lg:max-w-lg animate-float"
              />
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 -right-4 bg-card border border-border rounded-xl px-4 py-2.5 shadow-card"
              >
                <p className="text-xs text-muted-foreground">Just earned</p>
                <p className="text-lg font-bold text-primary font-heading">+$12.50 💸</p>
              </motion.div>
              {/* Floating badge 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 -left-4 bg-card border border-border rounded-xl px-4 py-2.5 shadow-card"
              >
                <p className="text-xs text-muted-foreground">Badge unlocked</p>
                <p className="text-sm font-bold font-heading">🏆 City Explorer</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
