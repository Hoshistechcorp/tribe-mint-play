import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (typeFilter) params.set("type", typeFilter);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background pt-20 pb-10 sm:pt-24 sm:pb-16">
      <div className="container relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy + CTAs */}
          <div className="space-y-5 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Powered by AuraLink
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.08] font-heading text-foreground"
            >
              Share a link.
              <br />
              Earn{" "}
              <span className="relative inline-block">
                <span className="font-display italic text-foreground">real money.</span>
                <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-lime/30 rounded-full -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Promote restaurants, hotels, events, and gift cards to your audience. Earn commissions on every booking, every sale, every click.{" "}
              <span className="font-semibold text-foreground">
                500 followers or 500K — your earnings are based on impact, not reach.
              </span>
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search businesses to promote..."
                    className="w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-xl bg-muted border-none text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="City"
                    className="w-full sm:w-28 pl-9 pr-3 py-2.5 sm:py-3 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2.5 sm:p-3 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3 bg-military text-lime rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Expandable filters */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground font-medium self-center mr-1">Type:</span>
                    {[
                      { label: "🍽️ Restaurants", value: "restaurant" },
                      { label: "🏨 Hotels", value: "hotel" },
                      { label: "🍸 Lounges", value: "lounge" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTypeFilter(typeFilter === t.value ? "" : t.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          typeFilter === t.value
                            ? "bg-primary/20 text-primary-foreground border border-primary/30"
                            : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => navigate("/onboarding")}
                className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 font-extrabold bg-military text-lime rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity shadow-mint"
              >
                Start Earning Free →
              </button>
              <button
                onClick={() => navigate("/business-dashboard")}
                className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 font-extrabold bg-background text-foreground rounded-full text-sm sm:text-base border-2 border-border hover:border-foreground transition-colors"
              >
                I'm a Business →
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-start justify-center lg:justify-start gap-6 sm:gap-10 pt-2 sm:pt-4"
            >
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">​</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">​</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground font-display italic">​</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">​</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">​</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">​</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Creator Dashboard Mockup — Bold White Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative w-full max-w-sm mx-auto lg:max-w-md"
          >
            {/* Main card — bold white background */}
            <div className="bg-background border-2 border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_8px_40px_-8px_hsl(0_0%_0%/0.12)]">
              {/* Profile */}
              <div className="flex flex-col items-center mb-5 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-lime/20 border-4 border-lime flex items-center justify-center text-3xl sm:text-4xl mb-2 sm:mb-3">
                  🧕
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-foreground">Ada Osei</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">@adaeats · Lagos & Atlanta</p>
                <span className="mt-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-military/10 border border-military/20 text-[11px] sm:text-xs font-bold text-foreground">
                  🌿 Grower · Base + 5%
                </span>
              </div>

              {/* Earnings card */}
              <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 text-center">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 sm:mb-2">This Month's Earnings</p>
                <p className="text-3xl sm:text-4xl font-display italic font-bold text-foreground">$2,847</p>
                <p className="text-xs sm:text-sm font-semibold text-lime mt-1">↑ 34% vs last month</p>
              </div>

              {/* Active campaigns */}
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">Active Campaigns</p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { name: "Bacchanalia ATL", rate: "12% on gift cards", earned: "$640", emoji: "🍽️" },
                    { name: "W Hotel Midtown", rate: "10% on bookings", earned: "$1,203", emoji: "🏨" },
                    { name: "Afrobeats Fest", rate: "15% on tickets", earned: "$1,004", emoji: "🎵" },
                  ].map((campaign) => (
                    <div key={campaign.name} className="flex items-center justify-between py-1.5 sm:py-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center text-base sm:text-lg">
                          {campaign.emoji}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-foreground">{campaign.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{campaign.rate}</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-foreground">{campaign.earned}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notifications */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="hidden sm:flex absolute -top-4 -left-8 bg-background border-2 border-border px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-card items-center gap-2"
            >
              <span className="text-base sm:text-lg">💰</span>
              +$47 commission just now
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
              className="hidden sm:flex absolute bottom-1/3 -right-8 lg:-right-12 bg-background border-2 border-border px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-card items-center gap-2"
            >
              <span className="text-base sm:text-lg">🎁</span>
              Gift card sold via your link!
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
              className="hidden sm:flex absolute bottom-4 -left-4 lg:-left-6 bg-background border-2 border-border px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-card items-center gap-2"
            >
              <span className="text-base sm:text-lg">📈</span>
              142 clicks today
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
