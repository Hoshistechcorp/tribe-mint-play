import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useAffiliate } from "@/contexts/AffiliateContext";

const statusTabs = [
  { label: "All", value: "all", emoji: "🌐" },
  { label: "Active", value: "active", emoji: "🟢" },
  { label: "Queued", value: "queued", emoji: "⏳" },
  { label: "Applied", value: "applied", emoji: "📩" },
  { label: "Completed", value: "completed", emoji: "✅" },
];

const MyCampaigns = () => {
  const navigate = useNavigate();
  const { allCampaigns, joinedCampaigns, isCampaignJoined, campaignApplications } = useAffiliate();
  const [activeTab, setActiveTab] = useState("all");

  // Build a unified list of the creator's campaigns
  const myCampaigns = useMemo(() => {
    const items: {
      campaign: typeof allCampaigns[0];
      status: "active" | "queued" | "applied" | "completed";
    }[] = [];

    // Joined campaigns
    joinedCampaigns.forEach((cId) => {
      const campaign = allCampaigns.find((c) => c.id === cId);
      if (!campaign) return;
      const deadlineDate = new Date(campaign.deadline);
      const isPast = !isNaN(deadlineDate.getTime()) && deadlineDate < new Date();
      const isFull = campaign.slotsUsed >= campaign.slots;
      const status = isPast || isFull ? "completed" : "active";
      items.push({ campaign, status });
    });

    // Applied (featured) campaigns that the creator applied to but hasn't joined yet
    const pendingApps = campaignApplications.filter(
      (a) => a.status === "pending" && a.applicantUsername === "alexcreates"
    );
    const approvedApps = campaignApplications.filter(
      (a) => a.status === "approved" && a.applicantUsername === "alexcreates"
    );
    // For demo, also show featured campaigns user hasn't joined as "applied" if they exist
    allCampaigns
      .filter((c) => c.type === "featured" && !isCampaignJoined(c.id))
      .forEach((campaign) => {
        // Check if the demo user has a pending app
        const hasPending = pendingApps.some((a) => a.campaignId === campaign.id);
        const hasApproved = approvedApps.some((a) => a.campaignId === campaign.id);
        if (hasPending) {
          items.push({ campaign, status: "applied" });
        } else if (hasApproved) {
          items.push({ campaign, status: "queued" });
        }
      });

    return items;
  }, [allCampaigns, joinedCampaigns, campaignApplications, isCampaignJoined]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return myCampaigns;
    return myCampaigns.filter((m) => m.status === activeTab);
  }, [activeTab, myCampaigns]);

  const counts = useMemo(() => ({
    all: myCampaigns.length,
    active: myCampaigns.filter((m) => m.status === "active").length,
    queued: myCampaigns.filter((m) => m.status === "queued").length,
    applied: myCampaigns.filter((m) => m.status === "applied").length,
    completed: myCampaigns.filter((m) => m.status === "completed").length,
  }), [myCampaigns]);

  const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-primary/15", text: "text-primary", label: "🟢 Active" },
    queued: { bg: "bg-yellow-500/15", text: "text-yellow-600 dark:text-yellow-400", label: "⏳ Queued" },
    applied: { bg: "bg-secondary/15", text: "text-secondary", label: "📩 Applied" },
    completed: { bg: "bg-muted", text: "text-muted-foreground", label: "✅ Completed" },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container flex items-center gap-4 h-16">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <span className="text-lg">←</span>
            </button>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg">My Campaigns 🎯</h1>
              <p className="text-xs text-muted-foreground">Track all campaigns you've joined or applied to</p>
            </div>
            <button
              onClick={() => navigate("/campaign-applicants")}
              className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
            >
              📩 Review Applicants
            </button>
          </div>
        </div>

        <div className="container py-8 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Active", value: counts.active, emoji: "🟢", color: "text-primary" },
              { label: "Queued", value: counts.queued, emoji: "⏳", color: "text-yellow-600 dark:text-yellow-400" },
              { label: "Applied", value: counts.applied, emoji: "📩", color: "text-secondary" },
              { label: "Completed", value: counts.completed, emoji: "✅", color: "text-muted-foreground" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card text-center"
              >
                <span className="text-xl">{s.emoji}</span>
                <p className={`text-2xl font-bold font-heading mt-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
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
                <span className="text-xs opacity-60">({counts[tab.value as keyof typeof counts]})</span>
              </button>
            ))}
          </div>

          {/* Campaign list */}
          {filtered.length === 0 ? (
            <div className="p-12 rounded-2xl border border-border bg-gradient-card text-center">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-muted-foreground text-sm mb-4">
                {activeTab === "all" ? "You haven't joined any campaigns yet." : `No ${activeTab} campaigns.`}
              </p>
              <button
                onClick={() => navigate("/campaigns")}
                className="px-6 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm"
              >
                Browse Campaigns
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(({ campaign, status }, i) => {
                const badge = statusBadge[status];
                const slotsLeft = campaign.slots - campaign.slotsUsed;
                const progress = (campaign.slotsUsed / campaign.slots) * 100;

                return (
                  <motion.div
                    key={campaign.id + status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-border bg-gradient-card shadow-card overflow-hidden"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={campaign.businessImage} alt={campaign.businessName} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-xs font-bold text-primary">
                        {campaign.commission}%
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold font-heading text-sm">{campaign.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">📍 {campaign.businessName} · {campaign.city}</p>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{campaign.description}</p>

                      {campaign.bonusReward && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                          <span className="text-xs font-medium text-secondary">🎁 {campaign.bonusReward}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                          <span>{slotsLeft} spots left</span>
                          <span>⏳ {campaign.deadline}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-mint rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {campaign.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default MyCampaigns;