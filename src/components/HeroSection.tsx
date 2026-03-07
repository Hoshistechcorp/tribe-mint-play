import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Utensils, Hotel, Wine } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const categories = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Hotel, label: "Hotels" },
  { icon: Wine, label: "Lounges" },
];

const HeroSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-heading">
              Share. Promote.{" "}
              <span className="text-gradient-mint">Get Paid.</span>
              <span className="block mt-2 text-gradient-coral">💰</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Find amazing local spots, share your link, and earn real cash — all gamified! 🎮
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-3 shadow-card max-w-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search restaurants, hotels, lounges..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Location</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === cat.label
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="px-8 py-3.5 font-bold bg-gradient-mint text-primary-foreground rounded-xl shadow-mint text-base hover:opacity-90 transition-opacity">
                Start Earning Free 🚀
              </button>
              <button className="px-8 py-3.5 font-bold border border-border text-foreground rounded-xl hover:bg-muted transition-colors text-base">
                I'm a Business 🏨
              </button>
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
