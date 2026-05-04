import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { type Campaign } from "@/data/sampleCampaigns";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import { useAffiliate } from "@/contexts/AffiliateContext";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const tabs = [
  { label: "All", value: "all", emoji: "🌐" },
  { label: "Open", value: "open", emoji: "🟢" },
  { label: "Featured", value: "featured", emoji: "⭐" },
  { label: "Exclusive", value: "exclusive", emoji: "🔒" },
];

const typeBadge: Record<Campaign["type"], { bg: string; text: string; label: string }> = {
  open: { bg: "bg-primary/15", text: "text-primary", label: "🟢 Open" },
  featured: { bg: "bg-secondary/15", text: "text-secondary", label: "⭐ Apply to join" },
  exclusive: { bg: "bg-accent/15", text: "text-accent", label: "🔒 Exclusive" },
};

const Campaigns = () => {
  const navigate = useNavigate();
  const { joinCampaign, isCampaignJoined, allCampaigns, getDiscountForBusiness } = useAffiliate();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return allCampaigns;
    return allCampaigns.filter((c) => c.type === activeTab);
  }, [activeTab, allCampaigns]);

  const handleJoin = (campaign: Campaign) => {
    if (isCampaignJoined(campaign.id)) {
      const code = campaign.businessName.toLowerCase().replace(/\s+/g, "-");
      navigator.clipboard.writeText(`tribemint.link/${code}/${campaign.id}`);
      toast({ title: "📋 Link Copied!", description: `Your link for "${campaign.title}" has been copied.` });
      return;
    }

    if (campaign.type === "featured") {
      toast({
        title: "📩 Application Submitted!",
        description: `Your request to join "${campaign.title}" has been sent. The campaign creator will review and approve your application.`,
      });
      return;
    }
    
    joinCampaign(campaign);
    const code = campaign.businessName.toLowerCase().replace(/\s+/g, "-");
    navigator.clipboard.writeText(`tribemint.link/${code}/${campaign.id}`);
    fireConfetti();
    toast({
      title: campaign.type === "exclusive" ? "📩 Invite Requested!" : "🎉 Campaign Joined!",
      description: `Link copied: tribemint.link/${code}/${campaign.id}`,
    });
  };

  return (
    <PageTransition><div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors">
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold font-heading">Campaigns 🎯</h1>
              <p className="text-sm text-muted-foreground">Join campaigns and earn higher commissions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.value
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
                {tab.value !== "all" && (
                  <span className="text-xs opacity-60">
                    ({allCampaigns.filter((c) => c.type === tab.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Campaign grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((campaign, i) => {
              const badge = typeBadge[campaign.type];
              const slotsLeft = campaign.slots - campaign.slotsUsed;
              const progress = (campaign.slotsUsed / campaign.slots) * 100;
              const joined = isCampaignJoined(campaign.id);

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={campaign.businessImage} alt={campaign.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-xs font-bold text-primary">
                      {campaign.commission}%
                    </span>
                    {(() => {
                      const offer = getDiscountForBusiness(campaign.businessId);
                      if (!offer || offer.discountPercent === 0) return null;
                      return (
                        <span className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-md ${
                          offer.paused ? "bg-destructive text-destructive-foreground" : "bg-accent text-accent-foreground"
                        }`}>
                          {offer.paused ? "OFFER PAUSED" : `${offer.discountPercent}% OFF for your audience`}
                        </span>
                      );
                    })()}
                    {joined && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-primary/90 text-primary-foreground text-[10px] font-bold flex items-center gap-1">
                        ✓ Joined
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold font-heading text-base">{campaign.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 {campaign.businessName} · {campaign.city}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{campaign.description}</p>

                    {campaign.bonusReward && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                        <span className="text-secondary">🎁</span>
                        <span className="text-xs font-medium text-secondary">{campaign.bonusReward}</span>
                      </div>
                    )}

                    {campaign.type === "featured" && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/5 border border-secondary/15">
                        <span className="text-[10px] text-secondary font-medium">⭐ Open to all · Creator approval required before you can participate</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>{slotsLeft} spots left</span>
                        <span>⏳ {campaign.deadline}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                          className="h-full bg-gradient-mint rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {campaign.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleJoin(campaign)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity ${
                        joined
                          ? "bg-muted text-foreground border border-border"
                          : campaign.type === "exclusive"
                            ? "bg-gradient-coral text-secondary-foreground shadow-coral"
                            : campaign.type === "featured"
                              ? "bg-secondary/20 text-secondary border border-secondary/30"
                              : "bg-gradient-mint text-primary-foreground shadow-mint"
                      }`}
                    >
                      {joined ? (
                        <>📋 Copy Link</>
                      ) : campaign.type === "featured" ? (
                        <>📩 Apply to Join</>
                      ) : campaign.type === "exclusive" ? (
                        <>🔒 Request Invite</>
                      ) : (
                        <>🔗 Join & Get Link</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div></PageTransition>
  );
};

export default Campaigns;