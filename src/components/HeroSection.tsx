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
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/8 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] font-heading"
          >
            Share. Promote.{" "}
            <span className="text-gradient-mint">Earn.</span>{" "}
            <span className="text-gradient-coral">💰</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-md mx-auto"
          >
            Find spots you love. Share your link. Get paid.
          </motion.p>

          {/* Big Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            className="bg-card/80 backdrop-blur-md border border-border/60 rounded-3xl p-4 sm:p-5 shadow-card max-w-2xl mx-auto"
          >
            {/* Main search row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search businesses to promote..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted border-none text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City"
                  className="w-24 sm:w-32 pl-9 pr-3 py-4 rounded-2xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-4 bg-gradient-mint text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint whitespace-nowrap"
              >
                Search 🔍
              </button>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground font-medium mr-1">Type:</span>
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat.label
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Earning metric filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium mr-1">Sort by:</span>
              {earningFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveEarning(activeEarning === f.value ? null : f.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeEarning === f.value
                      ? "bg-secondary/20 text-secondary border border-secondary/30 shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
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
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3.5 font-bold bg-gradient-mint text-primary-foreground rounded-xl shadow-mint text-base hover:opacity-90 transition-opacity"
            >
              Start Earning 🚀
            </button>
            <button className="px-8 py-3.5 font-bold border border-border text-foreground rounded-xl hover:bg-muted transition-colors text-base">
              I'm a Business 🏨
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="hidden lg:block absolute top-1/3 right-8 bg-card border border-border rounded-xl px-4 py-2.5 shadow-card"
      >
        <p className="text-xs text-muted-foreground">Just earned</p>
        <p className="text-lg font-bold text-primary font-heading">+$12.50 💸</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden lg:block absolute bottom-1/3 left-8 bg-card border border-border rounded-xl px-4 py-2.5 shadow-card"
      >
        <p className="text-xs text-muted-foreground">Badge unlocked</p>
        <p className="text-sm font-bold font-heading">🏆 City Explorer</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden lg:block absolute top-1/2 right-24 bg-card border border-border rounded-xl px-4 py-2.5 shadow-card"
      >
        <p className="text-xs text-muted-foreground">Conversion rate</p>
        <p className="text-sm font-bold text-secondary font-heading">6.1% 📈</p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
