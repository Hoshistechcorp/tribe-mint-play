import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Utensils, Hotel, Wine, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Utensils, label: "Restaurants", emoji: "🍽️" },
  { icon: Hotel, label: "Hotels", emoji: "🏨" },
  { icon: Wine, label: "Lounges", emoji: "🍸" },
];

const earningFilters = [
  { icon: DollarSign, label: "High Commission", value: "commission" },
  { icon: TrendingUp, label: "Best EPC", value: "epc" },
  { icon: BarChart3, label: "Top Converting", value: "conversion" },
];

const HeroSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeEarning, setActiveEarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory) params.set("type", activeCategory.toLowerCase());
    if (location) params.set("city", location);
    if (activeEarning) params.set("sort", activeEarning);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-16">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.1] font-heading"
          >
            <motion.span 
              className="text-gradient-fun inline-block"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Discover.
            </motion.span>{" "}
            <motion.span 
              className="text-gradient-coral inline-block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              Share.
            </motion.span>{" "}
            <motion.span 
              className="text-gradient-mint inline-block"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              Earn! 
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
            >
              🎉
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-md mx-auto font-medium"
          >
            Find amazing spots. Share your link. Get paid 💰
          </motion.p>

          {/* Big Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            className="bg-card/80 backdrop-blur-md border-2 border-primary/30 rounded-3xl p-5 sm:p-7 shadow-mint max-w-3xl mx-auto"
          >
            {/* Main search row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="What are you looking for? 🔍"
                  className="w-full pl-14 pr-5 py-5 rounded-2xl bg-muted border-2 border-transparent text-lg font-bold font-heading text-foreground placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City"
                  className="w-28 sm:w-36 pl-10 pr-3 py-5 rounded-2xl bg-muted border-2 border-transparent text-base font-heading text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-gradient-mint text-primary-foreground rounded-2xl font-bold font-heading text-base hover:opacity-90 transition-opacity shadow-mint whitespace-nowrap"
              >
                Go! 🚀
              </motion.button>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground font-bold font-heading mr-1">Type:</span>
              {categories.map((cat) => (
                <motion.button
                  key={cat.label}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold font-heading transition-all ${
                    activeCategory === cat.label
                      ? "bg-primary/20 text-primary border-2 border-primary/40 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-transparent"
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Earning metric filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-bold font-heading mr-1">Sort:</span>
              {earningFilters.map((f) => (
                <motion.button
                  key={f.value}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveEarning(activeEarning === f.value ? null : f.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold font-heading transition-all ${
                    activeEarning === f.value
                      ? "bg-secondary/20 text-secondary border-2 border-secondary/40 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-2 border-transparent"
                  }`}
                >
                  <f.icon className="w-4 h-4" />
                  {f.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 font-bold font-heading bg-gradient-mint text-primary-foreground rounded-2xl shadow-mint text-lg hover:opacity-90 transition-opacity"
            >
              Start Earning 🚀
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 font-bold font-heading border-2 border-secondary/50 text-secondary rounded-2xl hover:bg-secondary/10 transition-colors text-lg"
            >
              I'm a Business 🏨
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="hidden lg:block absolute top-1/3 right-8 bg-card border-2 border-secondary/30 rounded-2xl px-5 py-3 shadow-coral"
      >
        <p className="text-xs text-muted-foreground font-heading font-bold">Just earned</p>
        <p className="text-xl font-bold text-secondary font-heading">+$12.50 💸</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden lg:block absolute bottom-1/3 left-8 bg-card border-2 border-accent/30 rounded-2xl px-5 py-3 shadow-fun"
      >
        <p className="text-xs text-muted-foreground font-heading font-bold">Badge unlocked</p>
        <p className="text-base font-bold font-heading text-accent">🏆 City Explorer</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden lg:block absolute top-1/2 right-24 bg-card border-2 border-primary/30 rounded-2xl px-5 py-3 shadow-mint"
      >
        <p className="text-xs text-muted-foreground font-heading font-bold">Conversion rate</p>
        <p className="text-base font-bold text-primary font-heading">6.1% 📈</p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
