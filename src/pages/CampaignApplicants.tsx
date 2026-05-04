import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";

const statusTabs = [
  { label: "Pending", value: "pending", emoji: "⏳" },
  { label: "Approved", value: "approved", emoji: "✅" },
  { label: "Rejected", value: "rejected", emoji: "❌" },
];

const CampaignApplicants = () => {
  const navigate = useNavigate();
  const { campaignApplications, approveApplication, rejectApplication, allCampaigns } = useAffiliate();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  // Get unique featured campaigns that have applications
  const campaignsWithApps = useMemo(() => {
    const ids = [...new Set(campaignApplications.map((a) => a.campaignId))];
    return ids.map((id) => {
      const camp = allCampaigns.find((c) => c.id === id);
      return { id, title: camp?.title || campaignApplications.find((a) => a.campaignId === id)?.campaignTitle || id };
    });
  }, [campaignApplications, allCampaigns]);

  const filtered = useMemo(() => {
    let apps = campaignApplications.filter((a) => a.status === activeTab);
    if (selectedCampaign !== "all") {
      apps = apps.filter((a) => a.campaignId === selectedCampaign);
    }
    return apps;
  }, [campaignApplications, activeTab, selectedCampaign]);

  const counts = useMemo(() => ({
    pending: campaignApplications.filter((a) => a.status === "pending").length,
    approved: campaignApplications.filter((a) => a.status === "approved").length,
    rejected: campaignApplications.filter((a) => a.status === "rejected").length,
  }), [campaignApplications]);

  const handleApprove = (id: string, name: string) => {
    approveApplication(id);
    toast({ title: "✅ Approved!", description: `${name} has been approved to join the campaign.` });
  };

  const handleReject = (id: string, name: string) => {
    rejectApplication(id);
    toast({ title: "❌ Rejected", description: `${name}'s application has been declined.` });
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
              <h1 className="font-heading font-bold text-lg">Campaign Applicants 📩</h1>
              <p className="text-xs text-muted-foreground">Review and manage applications for your featured campaigns</p>
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending", value: counts.pending, emoji: "⏳", color: "text-yellow-600 dark:text-yellow-400" },
              { label: "Approved", value: counts.approved, emoji: "✅", color: "text-primary" },
              { label: "Rejected", value: counts.rejected, emoji: "❌", color: "text-destructive" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card text-center"
              >
                <span className="text-2xl">{s.emoji}</span>
                <p className={`text-2xl font-bold font-heading mt-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Campaign filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCampaign("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCampaign === "all" ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
              }`}
            >
              All Campaigns
            </button>
            {campaignsWithApps.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampaign(c.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCampaign === c.id ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Status tabs */}
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
                <span className="text-xs opacity-60">
                  ({counts[tab.value as keyof typeof counts]})
                </span>
              </button>
            ))}
          </div>

          {/* Applicant list */}
          {filtered.length === 0 ? (
            <div className="p-12 rounded-2xl border border-border bg-gradient-card text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-muted-foreground text-sm">No {activeTab} applications{selectedCampaign !== "all" ? " for this campaign" : ""}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-card border border-border shadow-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar & info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                        {app.applicantAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold font-heading text-sm truncate">{app.applicantName}</p>
                        <p className="text-xs text-muted-foreground">@{app.applicantUsername}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            👥 {app.applicantFollowers.toLocaleString()} followers
                          </span>
                          {app.applicantNiche.map((n) => (
                            <span key={n} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Campaign label */}
                    <div className="text-xs text-muted-foreground sm:text-right shrink-0">
                      <p className="font-medium text-foreground">⭐ {app.campaignTitle}</p>
                      <p>Applied {app.appliedAt}</p>
                    </div>

                    {/* Actions */}
                    {app.status === "pending" ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleApprove(app.id, app.applicantName)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id, app.applicantName)}
                          className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : (
                      <div className="shrink-0">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          app.status === "approved" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
                        }`}>
                          {app.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default CampaignApplicants;