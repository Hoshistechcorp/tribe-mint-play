import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus, Users, DollarSign, BarChart3, Edit3, Trash2, Eye,
  TrendingUp, Star, X, Save, Pause, Play, Tags, MousePointerClick, AlertTriangle,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import CreateCampaignModal from "@/components/business/CreateCampaignModal";
import AnalyticsCharts from "@/components/business/AnalyticsCharts";
import ActivityFeed from "@/components/business/ActivityFeed";
import { toast } from "@/hooks/use-toast";
import { useAffiliate, type BizCampaign } from "@/contexts/AffiliateContext";

const topAffiliates = [
  { name: "Sarah M.", clicks: 1200, conversions: 45, earned: "$675", avatar: "🧑‍💻" },
  { name: "James K.", clicks: 980, conversions: 38, earned: "$570", avatar: "🎨" },
  { name: "Aisha D.", clicks: 850, conversions: 32, earned: "$480", avatar: "📸" },
  { name: "David O.", clicks: 720, conversions: 28, earned: "$420", avatar: "🎯" },
  { name: "Fatima B.", clicks: 650, conversions: 22, earned: "$330", avatar: "✨" },
];

const BusinessOwnerDashboard = () => {
  const navigate = useNavigate();
  const {
    businessProfile, setBusinessProfile,
    bizCampaigns, addBizCampaign, updateBizCampaign, deleteBizCampaign,
    topUpCampaignBudget, toggleCampaignPause,
    affiliateLinks,
  } = useAffiliate();

  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "affiliates" | "profile">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(businessProfile);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState<BizCampaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<BizCampaign | null>(null);

  // Compute live stats from real data
  const totalRevenue = bizCampaigns.reduce((s, c) => s + c.revenue, 0);
  const activeAffiliates = bizCampaigns.reduce((s, c) => s + c.affiliates, 0);
  const totalDiscountSpent = bizCampaigns.reduce((s, c) => s + c.discountSpent, 0);
  const totalClickSpent = bizCampaigns.reduce((s, c) => s + c.clickSpent, 0);

  const tabs = [
    { key: "overview", label: "Overview 📊", icon: BarChart3 },
    { key: "campaigns", label: "Campaigns 📢", icon: BarChart3 },
    { key: "affiliates", label: "Affiliates 👥", icon: Users },
    { key: "profile", label: "Profile ✏️", icon: Edit3 },
  ] as const;

  const handleDelete = (id: string) => {
    deleteBizCampaign(id);
    toast({ title: "Campaign deleted", variant: "destructive" });
  };

  const handleSaveEdit = () => {
    if (!editingCampaign) return;
    updateBizCampaign(editingCampaign.id, editingCampaign);
    toast({ title: "Campaign updated! ✅" });
    setEditingCampaign(null);
  };

  const handleSaveProfile = () => {
    setBusinessProfile(profileDraft);
    setIsEditing(false);
    toast({ title: "Profile updated! ✅" });
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="border-b border-border bg-card/50 backdrop-blur-xl">
          <div className="container flex items-center gap-4 h-16">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg">Business Dashboard</h1>
              <p className="text-xs text-muted-foreground">{businessProfile.name} · {businessProfile.city}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>
        </div>

        <div className="container py-8 space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: "text-primary" },
              { label: "Active Affiliates", value: activeAffiliates, icon: Users, color: "text-secondary" },
              { label: "Discount Spend", value: `$${totalDiscountSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Tags, color: "text-accent" },
              { label: "Click Payout", value: `$${totalClickSpent.toFixed(2)}`, icon: MousePointerClick, color: "text-primary" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 border-b border-border pb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><AnalyticsCharts /></div>
                <div><ActivityFeed /></div>
              </div>
            </motion.div>
          )}

          {activeTab === "campaigns" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {bizCampaigns.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold">{c.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.payoutsPaused ? "bg-destructive/15 text-destructive" :
                          c.status === "active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>{c.payoutsPaused ? "Paused — budget out" : c.status}</span>
                        {c.discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent">
                            {c.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.commission}% commission · ${c.cpcRate.toFixed(2)}/click · {c.affiliates} affiliates
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { toggleCampaignPause(c.id); toast({ title: c.payoutsPaused ? "Campaign resumed ▶️" : "Campaign paused ⏸️" }); }}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                        title={c.payoutsPaused ? "Resume" : "Pause"}
                      >
                        {c.payoutsPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setViewingCampaign(c)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingCampaign({ ...c })} className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-xl bg-background/50">
                      <p className="text-lg font-bold font-heading text-foreground">{c.clicks.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-background/50">
                      <p className="text-lg font-bold font-heading text-primary">{c.conversions}</p>
                      <p className="text-[10px] text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-background/50">
                      <p className="text-lg font-bold font-heading text-secondary">${c.revenue.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Revenue</p>
                    </div>
                  </div>

                  {/* Manager budget controls */}
                  <div className="mt-4 p-4 rounded-xl bg-background/40 border border-border space-y-3">
                    <div className="flex items-center gap-2">
                      <Tags className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Manager controls</span>
                      {c.payoutsPaused && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] text-destructive font-bold">
                          <AlertTriangle className="w-3 h-3" /> Top-up to resume
                        </span>
                      )}
                    </div>

                    {/* Discount budget bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Discount spend</span>
                        <span className="font-bold text-foreground">${c.discountSpent.toFixed(2)} / ${c.discountBudget.toFixed(0)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.discountSpent >= c.discountBudget ? "bg-destructive" : "bg-accent"}`}
                          style={{ width: `${Math.min(100, (c.discountSpent / Math.max(1, c.discountBudget)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Click budget bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">Click payout</span>
                        <span className="font-bold text-foreground">${c.clickSpent.toFixed(2)} / ${c.clickBudget.toFixed(0)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.clickSpent >= c.clickBudget ? "bg-destructive" : "bg-primary"}`}
                          style={{ width: `${Math.min(100, (c.clickSpent / Math.max(1, c.clickBudget)) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick top-ups */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Discount:</span>
                        {[100, 500].map((amt) => (
                          <button key={amt}
                            onClick={() => { topUpCampaignBudget(c.id, "discount", amt); toast({ title: `+$${amt} discount budget` }); }}
                            className="px-2 py-1 text-[10px] font-bold rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                            +${amt}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Clicks:</span>
                        {[50, 200].map((amt) => (
                          <button key={amt}
                            onClick={() => { topUpCampaignBudget(c.id, "click", amt); toast({ title: `+$${amt} click budget` }); }}
                            className="px-2 py-1 text-[10px] font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            +${amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {bizCampaigns.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg mb-2">No campaigns yet</p>
                  <button onClick={() => setShowCreateModal(true)} className="text-primary font-bold hover:underline">
                    Create your first campaign →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "affiliates" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h3 className="font-heading font-bold text-lg">Top Performing Affiliates 🏆</h3>
              {topAffiliates.map((a, i) => (
                <motion.div key={a.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">{a.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm font-heading">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.clicks.toLocaleString()} clicks · {a.conversions} conversions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{a.earned}</span>
                  </div>
                  {i < 3 && <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
              <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
                <div className="h-32 bg-cover bg-center bg-muted flex items-center justify-center text-6xl">{businessProfile.logo}</div>
                <div className="p-6 space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-3">
                        {[
                          { label: "Business Name", key: "name" as const },
                          { label: "Category", key: "category" as const },
                          { label: "City", key: "city" as const },
                          { label: "Website", key: "website" as const },
                        ].map((field) => (
                          <div key={field.key}>
                            <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
                            <input value={profileDraft[field.key] as string}
                              onChange={(e) => setProfileDraft({ ...profileDraft, [field.key]: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs text-muted-foreground font-medium">Description</label>
                          <textarea value={profileDraft.description}
                            onChange={(e) => setProfileDraft({ ...profileDraft, description: e.target.value })}
                            rows={3}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleSaveProfile} className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm">
                          Save Changes
                        </button>
                        <button onClick={() => { setIsEditing(false); setProfileDraft(businessProfile); }} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold font-heading">{businessProfile.name}</h2>
                          <p className="text-sm text-muted-foreground">{businessProfile.category} · {businessProfile.city}</p>
                        </div>
                        <button onClick={() => { setProfileDraft(businessProfile); setIsEditing(true); }}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{businessProfile.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">⭐ {businessProfile.rating} Rating</span>
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">💰 {businessProfile.commissionRate}% Commission</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <CreateCampaignModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={(campaign) => {
            addBizCampaign({
              id: campaign.id,
              title: campaign.title,
              description: (campaign as any).description,
              status: "active",
              affiliates: campaign.affiliates,
              clicks: campaign.clicks,
              conversions: campaign.conversions,
              revenue: 0,
              commission: campaign.commission,
              budget: campaign.budget,
              type: campaign.type,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
            });
          }}
        />

        {/* View Modal */}
        <AnimatePresence>
          {viewingCampaign && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setViewingCampaign(null)}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading">{viewingCampaign.title}</h3>
                  <button onClick={() => setViewingCampaign(null)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                </div>
                {viewingCampaign.description && <p className="text-sm text-muted-foreground">{viewingCampaign.description}</p>}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Status</p><p className="font-bold capitalize">{viewingCampaign.status}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Commission</p><p className="font-bold">{viewingCampaign.commission}%</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Clicks</p><p className="font-bold">{viewingCampaign.clicks.toLocaleString()}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Conversions</p><p className="font-bold text-primary">{viewingCampaign.conversions}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Affiliates</p><p className="font-bold">{viewingCampaign.affiliates}</p></div>
                  <div className="p-3 rounded-xl bg-muted/50"><p className="text-muted-foreground">Revenue</p><p className="font-bold text-secondary">${viewingCampaign.revenue.toLocaleString()}</p></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingCampaign && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setEditingCampaign(null)}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading">Edit Campaign</h3>
                  <button onClick={() => setEditingCampaign(null)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Title</label>
                  <input value={editingCampaign.title} onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Description</label>
                  <textarea value={editingCampaign.description || ""} onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                    rows={3}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Status</label>
                    <select value={editingCampaign.status}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as BizCampaign["status"] })}
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Commission %</label>
                    <input type="number" value={editingCampaign.commission}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, commission: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <button onClick={handleSaveEdit}
                  className="w-full px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default BusinessOwnerDashboard;
