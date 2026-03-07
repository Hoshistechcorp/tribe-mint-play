import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, DollarSign, TrendingUp, BarChart3,
  Users, Link2, Clock, Globe, Heart, Share2, Utensils, Hotel, Wine,
} from "lucide-react";
import { sampleBusinesses } from "@/data/sampleBusinesses";
import { sampleCampaigns } from "@/data/sampleCampaigns";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

const typeIcons = { restaurant: Utensils, hotel: Hotel, lounge: Wine };

const reviews = [
  { name: "SarahK", avatar: "👩‍🦱", rating: 5, text: "Amazing commissions and easy tracking. Love promoting this place!", date: "2 days ago" },
  { name: "FoodieMax", avatar: "🧑‍🍳", rating: 4, text: "Great conversion rates. Customers love the deals here.", date: "1 week ago" },
  { name: "TravelJay", avatar: "✈️", rating: 5, text: "Top-tier business to promote. Payouts are always on time.", date: "2 weeks ago" },
  { name: "NightOwl", avatar: "🦉", rating: 4, text: "Good commissions, wish they had more campaigns.", date: "3 weeks ago" },
];

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = sampleBusinesses.find((b) => b.id === id);
  const campaigns = sampleCampaigns.filter((c) => c.businessId === id);

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-muted-foreground mb-4">Business not found</p>
          <button onClick={() => navigate("/search")} className="text-primary hover:underline text-sm font-medium">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const TypeIcon = typeIcons[business.type];

  const handleGenerateLink = () => {
    const code = business.name.toLowerCase().replace(/\s+/g, "-");
    navigator.clipboard.writeText(`tribemint.link/${code}`);
    fireConfetti();
    toast({ title: "🔗 Link Generated!", description: `tribemint.link/${code} copied to clipboard` });
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={business.image.replace("w=400&h=300", "w=1200&h=600")}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="container -mt-12 relative z-10 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business info card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold font-heading">{business.name}</h1>
                      {business.featured && <span className="text-xs px-2 py-0.5 rounded-md bg-primary/15 text-primary font-bold">⭐ Featured</span>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><TypeIcon className="w-4 h-4" /> {business.type}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {business.city}</span>
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-secondary" /> {business.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{business.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {business.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Commission Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <h2 className="text-lg font-bold font-heading mb-4">Commission Breakdown 💰</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Commission", value: `${business.commission}%`, icon: DollarSign, color: "text-primary" },
                    { label: "Avg EPC", value: `$${business.avgEPC}`, icon: TrendingUp, color: "text-secondary" },
                    { label: "Conv. Rate", value: `${business.conversionRate}%`, icon: BarChart3, color: "text-accent" },
                    { label: "Affiliates", value: business.totalAffiliates.toString(), icon: Users, color: "text-muted-foreground" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="p-4 rounded-xl bg-muted/50 text-center"
                    >
                      <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                      <p className={`text-xl font-bold font-heading ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <h3 className="text-sm font-bold font-heading mb-2">How you earn</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Per Click (CPC)</span><span className="text-foreground font-medium">$0.05</span></div>
                    <div className="flex justify-between"><span>Per Sign-up (CPA)</span><span className="text-foreground font-medium">$2.00</span></div>
                    <div className="flex justify-between"><span>Revenue Share</span><span className="text-primary font-bold">{business.commission}%</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Active Campaigns */}
              {campaigns.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
                >
                  <h2 className="text-lg font-bold font-heading mb-4">Active Campaigns 🎯</h2>
                  <div className="space-y-3">
                    {campaigns.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-sm font-heading">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {c.commission}%</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.deadline}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.slots - c.slotsUsed} spots</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("/campaigns")}
                          className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <h2 className="text-lg font-bold font-heading mb-4">Affiliate Reviews ⭐</h2>
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <motion.div
                      key={r.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      className="flex gap-3"
                    >
                      <span className="text-2xl">{r.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{r.name}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 text-secondary fill-secondary" />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground ml-auto">{r.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{r.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card sticky top-20"
              >
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold font-heading text-primary">{business.commission}%</p>
                  <p className="text-sm text-muted-foreground">commission per sale</p>
                </div>

                <button
                  onClick={handleGenerateLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint mb-3"
                >
                  <Link2 className="w-4 h-4" />
                  Generate Affiliate Link
                </button>

                <button
                  onClick={() => navigate("/campaigns")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  View Campaigns
                </button>

                <div className="mt-6 pt-4 border-t border-border space-y-3 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Cookie Duration</span><span className="text-foreground">30 days</span></div>
                  <div className="flex justify-between"><span>Payout Frequency</span><span className="text-foreground">Weekly</span></div>
                  <div className="flex justify-between"><span>Min. Withdrawal</span><span className="text-foreground">$5.00</span></div>
                  <div className="flex justify-between"><span>Payment Methods</span><span className="text-foreground">Bank, Paystack</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div></PageTransition>
  );
};

export default BusinessDetail;
