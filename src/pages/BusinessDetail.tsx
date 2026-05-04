import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sampleBusinesses } from "@/data/sampleBusinesses";
import { sampleCampaigns } from "@/data/sampleCampaigns";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import { useAffiliate } from "@/contexts/AffiliateContext";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

const typeEmojis: Record<string, string> = { restaurant: "🍽️", hotel: "🏨", lounge: "🍷" };

const allReviews = [
  { name: "SarahK", avatar: "👩‍🦱", rating: 5, text: "Amazing commissions and easy tracking. Love promoting this place!", date: "2 days ago", helpful: 12 },
  { name: "FoodieMax", avatar: "🧑‍🍳", rating: 4, text: "Great conversion rates. Customers love the deals here.", date: "1 week ago", helpful: 8 },
  { name: "TravelJay", avatar: "✈️", rating: 5, text: "Top-tier business to promote. Payouts are always on time.", date: "2 weeks ago", helpful: 15 },
  { name: "NightOwl", avatar: "🦉", rating: 4, text: "Good commissions, wish they had more campaigns.", date: "3 weeks ago", helpful: 5 },
  { name: "Lagos_Lux", avatar: "💎", rating: 5, text: "Best experience promoting hospitality. Stellar support team!", date: "1 month ago", helpful: 20 },
  { name: "ChefMike", avatar: "👨‍🍳", rating: 3, text: "Decent, but the approval process could be faster.", date: "1 month ago", helpful: 3 },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
];

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { generateLink, affiliateLinks, joinCampaign, isCampaignJoined, allCampaigns, getDiscountForBusiness } = useAffiliate();
  const business = sampleBusinesses.find((b) => b.id === id);
  const campaigns = allCampaigns.filter((c) => c.businessId === id);
  const offer = id ? getDiscountForBusiness(id) : null;

  // The "demo business" is id "1" — owner mode enabled there
  const isOwner = id === "1";
  const [isEditing, setIsEditing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "5" | "4" | "3">("all");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [editData, setEditData] = useState({
    description: business?.description || "",
  });

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-muted-foreground mb-4">Business not found</p>
          <button onClick={() => navigate("/search")} className="text-primary hover:underline text-sm font-medium">Back to Search</button>
        </div>
      </div>
    );
  }

  const typeEmoji = typeEmojis[business.type] || "🍽️";
  const filteredReviews = allReviews.filter((r) => reviewFilter === "all" || r.rating === Number(reviewFilter));
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 4);
  const avgRating = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);

  const hasLink = affiliateLinks.some((l) => l.businessId === id);

  const handleGenerateLink = () => {
    if (!business) return;
    const link = generateLink(business);
    navigator.clipboard.writeText(`tribemint.link/${link.code}`);
    fireConfetti();
    toast({ title: hasLink ? "📋 Link Copied!" : "🔗 Link Generated!", description: `tribemint.link/${link.code} copied to clipboard` });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          {/* Hero */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img src={business.image.replace("w=400&h=300", "w=1200&h=600")} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card transition-colors">
                <span>←</span>
              </button>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => { setLiked(!liked); toast({ title: liked ? "Removed from favorites" : "Added to favorites ❤️" }); }}
                className={`p-2 rounded-xl backdrop-blur-sm transition-colors ${liked ? "bg-destructive/20 text-destructive" : "bg-card/80 hover:bg-card"}`}
              >
                <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied! 🔗" }); }}
                className="p-2 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
              >
                <span>📤</span>
              </button>
              {isOwner && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm hover:bg-primary/30 text-primary transition-colors"
                >
                  <span>✏️</span>
                </button>
              )}
            </div>
          </div>

          <div className="container -mt-12 relative z-10 pb-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main */}
              <div className="lg:col-span-2 space-y-6">
                {/* Info Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold font-heading">{business.name}</h1>
                        {business.featured && <span className="text-xs px-2 py-0.5 rounded-md bg-primary/15 text-primary font-bold">⭐ Featured</span>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">{typeEmoji} {business.type}</span>
                        <span className="flex items-center gap-1"><span>📍</span> {business.city}</span>
                        <span className="flex items-center gap-1"><span>⭐</span> {avgRating} ({allReviews.length})</span>
                      </div>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                      <button
                        onClick={() => { setIsEditing(false); toast({ title: "Description updated! ✅" }); }}
                        className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm flex items-center gap-2"
                      >
                        <span>💾</span> Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{editData.description || business.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {business.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-muted text-xs font-medium text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                </motion.div>

                {/* Gallery */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <h2 className="text-lg font-bold font-heading mb-4">Gallery 📸</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {galleryImages.map((img, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }} className="aspect-square rounded-xl overflow-hidden">
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Commission Breakdown */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <h2 className="text-lg font-bold font-heading mb-4">Commission Breakdown 💰</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Commission", value: `${business.commission}%`, emoji: "💲", color: "text-primary" },
                      { label: "Avg EPC", value: `$${business.avgEPC}`, emoji: "📈", color: "text-secondary" },
                      { label: "Conv. Rate", value: `${business.conversionRate}%`, emoji: "📊", color: "text-accent" },
                      { label: "Affiliates", value: business.totalAffiliates.toString(), emoji: "👥", color: "text-muted-foreground" },
                    ].map((stat, i) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }} className="p-4 rounded-xl bg-muted/50 text-center">
                        <span className="text-lg block mx-auto mb-2">{stat.emoji}</span>
                        <p className={`text-xl font-bold font-heading ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15">
                    <h3 className="text-sm font-bold font-heading mb-2">How you earn</h3>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Per Click (CPC)</span><span className="text-foreground font-medium">${(offer?.cpcRate ?? 0.05).toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Per Sign-up (CPA)</span><span className="text-foreground font-medium">$2.00</span></div>
                      <div className="flex justify-between"><span>Revenue Share</span><span className="text-primary font-bold">{business.commission}%</span></div>
                      {offer && offer.discountPercent > 0 && (
                        <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                          <span>Audience Discount</span>
                          <span className={`font-bold ${offer.paused ? "text-destructive" : "text-accent"}`}>
                            {offer.paused ? "Paused" : `${offer.discountPercent}% OFF`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Campaigns */}
                {campaigns.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                    <h2 className="text-lg font-bold font-heading mb-2">Gift Cards 🎁</h2>
                     <p className="text-xs text-muted-foreground mb-4">
                      Buy an Ibloov Gift Card for {business.name}. Perfect for birthdays, date nights, or treating yourself.
                      {offer && offer.discountPercent > 0 && ` Save ${offer.discountPercent}% on every card!`}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[25, 50, 100, 200].map((amt) => {
                        const disc = offer?.discountPercent ?? 0;
                        const price = +(amt * (1 - disc / 100)).toFixed(2);
                        return (
                          <button key={amt} onClick={() => navigate(`/gift-card-checkout?business=${id}&amount=${amt}`)}
                            className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 border border-border hover:border-primary/40 transition-all text-center group">
                            <p className="text-lg font-bold font-heading group-hover:text-primary transition-colors">${amt}</p>
                            {disc > 0 && <p className="text-[10px] text-primary font-bold">Pay ${price}</p>}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => navigate(`/gift-card-checkout?business=${id}`)}
                      className="w-full py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm shadow-mint hover:opacity-90 transition-opacity">
                      🎁 Buy a Gift Card
                    </button>
                  </motion.div>

                {/* Campaigns */}
                {campaigns.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                    <h2 className="text-lg font-bold font-heading mb-4">Active Campaigns 🎯</h2>
                    <div className="space-y-3">
                      {campaigns.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-sm font-heading">{c.title}</p>
                            <p className="text-xs text-muted-foreground">{c.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><span>💲</span> {c.commission}%</span>
                              <span className="flex items-center gap-1"><span>⏳</span> {c.deadline}</span>
                              <span className="flex items-center gap-1"><span>👥</span> {c.slots - c.slotsUsed} spots</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (isCampaignJoined(c.id)) {
                                toast({ title: "Already joined ✓", description: "Check your dashboard." });
                                return;
                              }
                              joinCampaign(c);
                              fireConfetti();
                              toast({ title: "🎉 Joined!", description: `You're now promoting "${c.title}"` });
                            }}
                            className={`px-4 py-2 rounded-lg font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap ${
                              isCampaignJoined(c.id) ? "bg-muted text-foreground border border-border" : "bg-gradient-mint text-primary-foreground"
                            }`}
                          >
                            {isCampaignJoined(c.id) ? "Joined ✓" : "Join"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Reviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold font-heading">Affiliate Reviews ⭐</h2>
                    <div className="flex items-center gap-1">
                      <span>🔽</span>
                      {(["all", "5", "4", "3"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setReviewFilter(f)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            reviewFilter === f ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {f === "all" ? "All" : `${f}★`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating summary */}
                  <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-muted/30">
                    <div className="text-center">
                      <p className="text-3xl font-bold font-heading text-primary">{avgRating}</p>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-xs ${i < Math.round(Number(avgRating)) ? "text-secondary" : "text-muted"}`}>★</span>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{allReviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = allReviews.filter((r) => r.rating === star).length;
                        const pct = (count / allReviews.length) * 100;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground w-3">{star}</span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-muted-foreground w-5 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {displayedReviews.map((r, i) => (
                        <motion.div
                          key={r.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-3 pb-4 border-b border-border/50 last:border-0"
                        >
                          <span className="text-2xl">{r.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm">{r.name}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: r.rating }).map((_, j) => (
                                   <span key={j} className="text-xs text-secondary">★</span>
                                ))}
                              </div>
                              <span className="text-[10px] text-muted-foreground ml-auto">{r.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{r.text}</p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => toast({ title: "Thanks for your feedback! 👍" })}
                                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                              >
                                 👍 Helpful ({r.helpful})
                              </button>
                              <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                                 💬 Reply
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredReviews.length > 4 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      {showAllReviews ? "Show less" : `Show all ${filteredReviews.length} reviews`}
                    </button>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card sticky top-20">
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold font-heading text-primary">{business.commission}%</p>
                    <p className="text-sm text-muted-foreground">commission per sale</p>
                  </div>

                  <button onClick={handleGenerateLink} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint mb-3">
                    {hasLink ? <><span>✓</span> Copy Affiliate Link</> : <><span>🔗</span> Generate Affiliate Link</>}
                  </button>

                  <button onClick={() => navigate("/campaigns")} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-colors">
                    <span>🌐</span> View Campaigns
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
      </div>
    </PageTransition>
  );
};

export default BusinessDetail;
