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

const socialFeed = [
  { handle: "@jasmine.eats", tier: "🌿 Grower", earned: "+$47.50", text: "woke up to 23 bookings 😭🔥", time: "2h ago", avatar: "🧕" },
  { handle: "@mike_travels", tier: "🌱 Sprout", earned: "+$12.00", text: "this is not a drill — passive income fr", time: "4h ago", avatar: "🧑" },
  { handle: "@foodie.luna", tier: "💎 Mint Master", earned: "+$215.00", text: "i'm literally getting paid to eat lol", time: "6h ago", avatar: "👩‍🦰" },
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-20 pb-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime/5 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy + Search */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-xs font-bold text-foreground uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Powered by AuraLink
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] font-heading"
            >
              Get paid to share{" "}
              <span className="font-display italic text-lime">
                what you already love.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base text-muted-foreground max-w-lg"
            >
              Promote restaurants, hotels, clubs, events, and gift cards. Earn 10-15% on every sale.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="bg-card/80 backdrop-blur-md border border-border/60 rounded-3xl p-4 sm:p-5 shadow-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search businesses to promote..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted border-none text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime/40 transition-shadow"
                  />
                </div>
                <div className="relative hidden sm:block">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City"
                    className="w-28 pl-9 pr-3 py-4 rounded-2xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime/40 transition-shadow"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-4 bg-military text-lime rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint whitespace-nowrap"
                >
                  Search 🔍
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-muted-foreground font-medium mr-1">Type:</span>
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === cat.label
                        ? "bg-military/20 text-foreground border border-military/30 shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium mr-1">Sort by:</span>
                {earningFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setActiveEarning(activeEarning === f.value ? null : f.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeEarning === f.value
                        ? "bg-lime/20 text-foreground border border-lime/30 shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent"
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => navigate("/onboarding")}
                className="px-8 py-4 font-extrabold bg-military text-lime rounded-full text-base hover:opacity-90 transition-opacity shadow-mint"
              >
                Start Earning Free →
              </button>
              <button
                onClick={() => navigate("/business-dashboard")}
                className="px-8 py-4 font-extrabold bg-lime text-military rounded-full text-base hover:opacity-90 transition-opacity"
              >
                I'm a Business 🏨
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" /> Live now
              </span>
              <span>💰 24hr payouts</span>
              <span>🔗 One link = tracked forever</span>
            </motion.div>
          </div>

          {/* Right: Social Feed Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden lg:block relative"
          >
            <div className="space-y-4">
              {socialFeed.map((post, i) => (
                <motion.div
                  key={post.handle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className="bg-card border border-border rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{post.avatar}</span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.handle}</p>
                        <p className="text-xs text-muted-foreground">{post.tier} · {post.time}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-lime/20 text-lime-foreground text-xs font-extrabold">
                      {post.earned}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{post.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Floating stickers */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 bg-lime text-military px-3 py-1.5 rounded-full text-xs font-extrabold shadow-lime sticker"
            >
              +$47 just now 🔥
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
              className="absolute top-1/2 -left-6 bg-card border border-border px-3 py-1.5 rounded-full text-xs font-bold shadow-card sticker-alt"
            >
              Gift card sold! 🎁
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
              className="absolute bottom-8 -right-2 bg-military text-lime px-3 py-1.5 rounded-full text-xs font-extrabold shadow-mint sticker"
            >
              142 clicks today 📈
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
