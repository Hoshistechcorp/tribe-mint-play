import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Utensils, Hotel, Wine, DollarSign, TrendingUp, BarChart3, ArrowLeft, Link2, Users, Check } from "lucide-react";
import { sampleBusinesses, type Business } from "@/data/sampleBusinesses";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import { useAffiliate } from "@/contexts/AffiliateContext";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const typeIcons = { restaurant: Utensils, hotel: Hotel, lounge: Wine };

const SearchResults = () => {
  const { generateLink, affiliateLinks } = useAffiliate();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  const filtered = useMemo(() => {
    let results = [...sampleBusinesses];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }
    if (typeFilter) {
      results = results.filter((b) => b.type === typeFilter);
    }
    if (cityFilter) {
      const c = cityFilter.toLowerCase();
      results = results.filter((b) => b.city.toLowerCase().includes(c));
    }
    if (sortBy === "commission") results.sort((a, b) => b.commission - a.commission);
    if (sortBy === "epc") results.sort((a, b) => b.avgEPC - a.avgEPC);
    if (sortBy === "conversion") results.sort((a, b) => b.conversionRate - a.conversionRate);

    return results;
  }, [query, typeFilter, cityFilter, sortBy]);

  const handleGenerateLink = (business: Business) => {
    const link = generateLink(business);
    navigator.clipboard.writeText(`tribemint.link/${link.code}`);
    const isNew = !affiliateLinks.some((l) => l.businessId === business.id && l.id !== link.id);
    fireConfetti();
    toast({ title: isNew ? "🔗 Link Generated!" : "📋 Link Copied!", description: `tribemint.link/${link.code} copied to clipboard` });
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Search header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold font-heading">
              Explore Businesses
            </h1>
          </div>

          {/* Search & Filter bar */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-card">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border-none text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="City"
                  className="w-full sm:w-32 pl-9 pr-3 py-3 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-muted-foreground font-medium self-center mr-1">Type:</span>
              {(["restaurants", "hotels", "lounges"] as const).map((t) => {
                const val = t.slice(0, -1) as Business["type"];
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(typeFilter === val ? "" : val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      typeFilter === val
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    {t === "restaurants" ? "🍽️" : t === "hotels" ? "🏨" : "🍸"} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground font-medium self-center mr-1">Sort:</span>
              {[
                { label: "High Commission", value: "commission", icon: DollarSign },
                { label: "Best EPC", value: "epc", icon: TrendingUp },
                { label: "Top Converting", value: "conversion", icon: BarChart3 },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSortBy(sortBy === f.value ? "" : f.value)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sortBy === f.value
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} {filtered.length === 1 ? "business" : "businesses"} found
          </p>

          {/* Results grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((biz, i) => {
              const TypeIcon = typeIcons[biz.type];
              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/business/${biz.id}`)}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {biz.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-primary/90 text-primary-foreground text-xs font-bold">
                        ⭐ Featured
                      </span>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {biz.type}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold font-heading text-base">{biz.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {biz.city}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">{biz.commission}%</span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">{biz.description}</p>

                    {/* Earning metrics */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-secondary" />
                        <span>${biz.avgEPC} EPC</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3 text-accent" />
                        <span>{biz.conversionRate}% CR</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{biz.totalAffiliates}</span>
                      </div>
                    </div>

                    {(() => {
                      const hasLink = affiliateLinks.some((l) => l.businessId === biz.id);
                      return (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleGenerateLink(biz); }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity ${
                            hasLink ? "bg-muted text-foreground border border-border" : "bg-gradient-mint text-primary-foreground shadow-mint"
                          }`}
                        >
                          {hasLink ? <><Check className="w-4 h-4" /> Copy Link</> : <><Link2 className="w-4 h-4" /> Generate Link</>}
                        </button>
                      );
                    })()}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-muted-foreground">No businesses found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div></PageTransition>
  );
};

export default SearchResults;
