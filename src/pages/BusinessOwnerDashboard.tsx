import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import CreateCampaignModal from "@/components/business/CreateCampaignModal";
import AnalyticsCharts from "@/components/business/AnalyticsCharts";
import ActivityFeed from "@/components/business/ActivityFeed";
import GiftCardProgram from "@/components/business/GiftCardProgram";
import BusinessSidebar from "@/components/business/BusinessSidebar";
import { toast } from "@/hooks/use-toast";
import { useAffiliate, type BizCampaign, type GiftCard } from "@/contexts/AffiliateContext";

const topAffiliates = [
  { name: "Sarah M.", clicks: 1200, conversions: 45, earned: "$675", avatar: "🧑‍💻", niche: "Food & Lifestyle", joined: "2 weeks ago" },
  { name: "James K.", clicks: 980, conversions: 38, earned: "$570", avatar: "🎨", niche: "Nightlife", joined: "1 month ago" },
  { name: "Aisha D.", clicks: 850, conversions: 32, earned: "$480", avatar: "📸", niche: "Travel", joined: "3 weeks ago" },
  { name: "David O.", clicks: 720, conversions: 28, earned: "$420", avatar: "🎯", niche: "Events", joined: "1 month ago" },
  { name: "Fatima B.", clicks: 650, conversions: 22, earned: "$330", avatar: "✨", niche: "Wellness", joined: "2 months ago" },
];

const sampleApplicants = [
  { id: "a1", name: "Tayo F.", niche: "Nightlife", followers: "12.4K", status: "pending" as const, campaign: "Date Night Special", appliedAt: "2h ago" },
  { id: "a2", name: "Lina K.", niche: "Food Reviews", followers: "8.2K", status: "pending" as const, campaign: "Weekend Brunch Push", appliedAt: "5h ago" },
  { id: "a3", name: "Marcus W.", niche: "Travel", followers: "22K", status: "approved" as const, campaign: "Date Night Special", appliedAt: "1d ago" },
  { id: "a4", name: "Nina C.", niche: "Lifestyle", followers: "5.1K", status: "rejected" as const, campaign: "Weekend Brunch Push", appliedAt: "2d ago" },
];

const samplePayoutHistory = [
  { id: "p1", affiliate: "Sarah M.", amount: 125.00, campaign: "Date Night Special", date: "May 2, 2026", status: "completed" as const },
  { id: "p2", affiliate: "James K.", amount: 95.50, campaign: "Weekend Brunch Push", date: "May 1, 2026", status: "completed" as const },
  { id: "p3", affiliate: "Aisha D.", amount: 78.00, campaign: "Date Night Special", date: "Apr 30, 2026", status: "pending" as const },
  { id: "p4", affiliate: "David O.", amount: 62.25, campaign: "Happy Hour Blitz", date: "Apr 29, 2026", status: "processing" as const },
  { id: "p5", affiliate: "Fatima B.", amount: 45.00, campaign: "Weekend Brunch Push", date: "Apr 28, 2026", status: "completed" as const },
];

const sampleReferrals = [
  { id: "r1", code: "DATENITE-SM", affiliate: "Sarah M.", uses: 45, revenue: 2250, active: true },
  { id: "r2", code: "BRUNCH-JK", affiliate: "James K.", uses: 38, revenue: 1900, active: true },
  { id: "r3", code: "DATENIGHT-AD", affiliate: "Aisha D.", uses: 32, revenue: 1600, active: true },
  { id: "r4", code: "HAPPYHOUR-DO", affiliate: "David O.", uses: 28, revenue: 1400, active: false },
];

const BusinessOwnerDashboard = () => {
  const navigate = useNavigate();
  const {
    businessProfile, setBusinessProfile,
    bizCampaigns, addBizCampaign, updateBizCampaign, deleteBizCampaign,
    topUpCampaignBudget, toggleCampaignPause,
    giftCardProgram,
  } = useAffiliate();

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileDraft, setProfileDraft] = useState(businessProfile);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState<BizCampaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<BizCampaign | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  
  // Payout management state
  const [payoutRuns, setPayoutRuns] = useState(samplePayoutHistory);
  const [payoutsPausedGlobal, setPayoutsPausedGlobal] = useState(false);
  const [showPayoutConfirm, setShowPayoutConfirm] = useState<string | null>(null);
  const [showCreatePayout, setShowCreatePayout] = useState(false);
  const [newPayoutDraft, setNewPayoutDraft] = useState({ affiliate: "", amount: "", campaign: "" });

  // Gift card CRUD state
  const [showGenGiftCard, setShowGenGiftCard] = useState(false);
  const [gcDraft, setGcDraft] = useState({ faceValue: 50, quantity: 1, buyerName: "", buyerEmail: "" });
  const [gcFilter, setGcFilter] = useState<"all" | "active" | "redeemed" | "voided">("all");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState<string | null>(null);

  const totalRevenue = bizCampaigns.reduce((s, c) => s + c.revenue, 0);
  const activeAffiliates = bizCampaigns.reduce((s, c) => s + c.affiliates, 0);
  const totalDiscountSpent = bizCampaigns.reduce((s, c) => s + c.discountSpent, 0);
  const totalClickSpent = bizCampaigns.reduce((s, c) => s + c.clickSpent, 0);
  const totalBudget = bizCampaigns.reduce((s, c) => s + (Number(c.budget) || 0), 0);
  const activeCampaigns = bizCampaigns.filter(c => c.status === "active" && !c.payoutsPaused).length;

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

  const handleTabChange = (tab: string) => {
    if (tab === "more") {
      setMobileMoreOpen(!mobileMoreOpen);
      return;
    }
    setMobileMoreOpen(false);
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, emoji: "💲", color: "text-primary", sub: `${activeCampaigns} active campaigns` },
                { label: "Active Affiliates", value: activeAffiliates.toString(), emoji: "👥", color: "text-secondary", sub: "across all campaigns" },
                { label: "Discount Spend", value: `$${totalDiscountSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, emoji: "🏷️", color: "text-accent", sub: `of $${totalBudget.toLocaleString()} budget` },
                { label: "Click Payout", value: `$${totalClickSpent.toFixed(2)}`, emoji: "🖱️", color: "text-primary", sub: "CPC payouts total" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{s.emoji}</span>
                    <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                  </div>
                  <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts + Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2"><AnalyticsCharts /></div>
              <div><ActivityFeed /></div>
            </div>

            {/* Quick campaign summary */}
            <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold">Campaign Summary</h3>
                <button onClick={() => setActiveTab("campaigns")} className="text-xs text-primary font-bold hover:underline">
                  View all →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-xs text-muted-foreground font-medium">Campaign</th>
                      <th className="text-right py-2 text-xs text-muted-foreground font-medium">Status</th>
                      <th className="text-right py-2 text-xs text-muted-foreground font-medium">Clicks</th>
                      <th className="text-right py-2 text-xs text-muted-foreground font-medium">Conv.</th>
                      <th className="text-right py-2 text-xs text-muted-foreground font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bizCampaigns.slice(0, 5).map((c) => (
                      <tr key={c.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 font-medium">{c.title}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.payoutsPaused ? "bg-destructive/15 text-destructive" :
                            c.status === "active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}>{c.payoutsPaused ? "Paused" : c.status}</span>
                        </td>
                        <td className="py-3 text-right text-muted-foreground">{c.clicks.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-primary">{c.conversions}</td>
                        <td className="py-3 text-right font-bold">${c.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top affiliates quick glance */}
            <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold">Top Affiliates</h3>
                <button onClick={() => setActiveTab("affiliates")} className="text-xs text-primary font-bold hover:underline">
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {topAffiliates.slice(0, 3).map((a, i) => (
                  <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border">
                    <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.conversions} conversions</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{a.earned}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "campaigns":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl">Campaigns</h2>
                <p className="text-sm text-muted-foreground">{bizCampaigns.length} total · {activeCampaigns} active</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
              >
                ＋ New Campaign
              </button>
            </div>

            {bizCampaigns.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
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
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { toggleCampaignPause(c.id); toast({ title: c.payoutsPaused ? "Campaign resumed ▶️" : "Campaign paused ⏸️" }); }}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors" title={c.payoutsPaused ? "Resume" : "Pause"}>
                      {c.payoutsPaused ? <span>▶</span> : <span>⏸</span>}
                    </button>
                    <button onClick={() => setViewingCampaign(c)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"><span>👁</span></button>
                    <button onClick={() => setEditingCampaign({ ...c })} className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"><span>✏️</span></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"><span>🗑️</span></button>
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

                <div className="mt-4 p-4 rounded-xl bg-background/40 border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🏷️</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Manager controls</span>
                    {c.payoutsPaused && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-destructive font-bold">⚠️ Top-up to resume</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Discount spend</span>
                      <span className="font-bold text-foreground">${c.discountSpent.toFixed(2)} / ${c.discountBudget.toFixed(0)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${c.discountSpent >= c.discountBudget ? "bg-destructive" : "bg-accent"}`}
                        style={{ width: `${Math.min(100, (c.discountSpent / Math.max(1, c.discountBudget)) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Click payout</span>
                      <span className="font-bold text-foreground">${c.clickSpent.toFixed(2)} / ${c.clickBudget.toFixed(0)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${c.clickSpent >= c.clickBudget ? "bg-destructive" : "bg-primary"}`}
                        style={{ width: `${Math.min(100, (c.clickSpent / Math.max(1, c.clickBudget)) * 100)}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Discount:</span>
                      {[100, 500].map((amt) => (
                        <button key={amt} onClick={() => { topUpCampaignBudget(c.id, "discount", amt); toast({ title: `+$${amt} discount budget` }); }}
                          className="px-2 py-1 text-[10px] font-bold rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors">+${amt}</button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Clicks:</span>
                      {[50, 200].map((amt) => (
                        <button key={amt} onClick={() => { topUpCampaignBudget(c.id, "click", amt); toast({ title: `+$${amt} click budget` }); }}
                          className="px-2 py-1 text-[10px] font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">+${amt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {bizCampaigns.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg mb-2">No campaigns yet</p>
                <button onClick={() => setShowCreateModal(true)} className="text-primary font-bold hover:underline">Create your first campaign →</button>
              </div>
            )}
          </motion.div>
        );

      case "affiliates":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl">Affiliates</h2>
              <p className="text-sm text-muted-foreground">{topAffiliates.length} creators promoting your brand</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Affiliates", value: topAffiliates.length, emoji: "👥" },
                { label: "Total Clicks", value: topAffiliates.reduce((s, a) => s + a.clicks, 0).toLocaleString(), emoji: "🖱️" },
                { label: "Total Conversions", value: topAffiliates.reduce((s, a) => s + a.conversions, 0), emoji: "🛒" },
                { label: "Total Paid", value: `$${topAffiliates.reduce((s, a) => s + parseInt(a.earned.replace("$", "")), 0).toLocaleString()}`, emoji: "💸" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <span className="text-lg">{s.emoji}</span>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <p className="text-xl font-bold font-heading mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Rank</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Creator</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Niche</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Clicks</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Conv.</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAffiliates.map((a, i) => (
                      <tr key={a.name} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          {i < 3 ? <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span> : <span className="text-muted-foreground font-bold">#{i + 1}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{a.avatar}</span>
                            <div>
                              <p className="font-bold">{a.name}</p>
                              <p className="text-[10px] text-muted-foreground">Joined {a.joined}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{a.niche}</td>
                        <td className="py-3 px-4 text-right">{a.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-primary">{a.conversions}</td>
                        <td className="py-3 px-4 text-right font-bold text-secondary">{a.earned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case "applicants":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl">Campaign Applicants</h2>
              <p className="text-sm text-muted-foreground">Review and manage featured campaign applications</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Pending", value: sampleApplicants.filter(a => a.status === "pending").length, color: "text-accent" },
                { label: "Approved", value: sampleApplicants.filter(a => a.status === "approved").length, color: "text-primary" },
                { label: "Rejected", value: sampleApplicants.filter(a => a.status === "rejected").length, color: "text-destructive" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card text-center">
                  <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {sampleApplicants.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm">{app.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === "pending" ? "bg-accent/15 text-accent" :
                        app.status === "approved" ? "bg-primary/15 text-primary" :
                        "bg-destructive/15 text-destructive"
                      }`}>{app.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{app.niche} · {app.followers} followers · For: {app.campaign}</p>
                    <p className="text-[10px] text-muted-foreground">Applied {app.appliedAt}</p>
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => toast({ title: `${app.name} approved ✅` })}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                        Approve
                      </button>
                      <button onClick={() => toast({ title: `${app.name} rejected`, variant: "destructive" })}
                        className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "giftcards":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl" id="giftcards-heading">Gift Cards</h2>
                <p className="text-sm text-muted-foreground">Manage your Ibloov Gift Card program</p>
              </div>
              {giftCardProgram.enrolled && giftCardProgram.cards && (
                <div className="flex gap-2">
                  <button onClick={() => setShowGenGiftCard(true)}
                    className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm shadow-mint hover:opacity-90 transition-opacity"
                    aria-label="Generate new gift cards">
                    ＋ Generate Cards
                  </button>
                  <button onClick={() => navigate("/business/gift-cards")}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg font-bold text-sm hover:bg-muted/80 transition-colors">
                    ↗ Full Manager
                  </button>
                </div>
              )}
            </div>
            <GiftCardProgram />

            {/* Gift Card CRUD Table */}
            {giftCardProgram.enrolled && giftCardProgram.cards && giftCardProgram.cards.length > 0 && (
              <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-heading font-bold">Gift Card Inventory</h3>
                    <div className="flex rounded-xl border border-border overflow-hidden" role="radiogroup" aria-label="Gift card status filter">
                      {(["all", "active", "redeemed", "voided"] as const).map(f => (
                        <button key={f} onClick={() => setGcFilter(f)}
                          className={`px-3 py-1.5 text-xs font-bold capitalize transition-colors ${gcFilter === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                          role="radio" aria-checked={gcFilter === f}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" aria-labelledby="giftcards-heading">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th scope="col" className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Code</th>
                        <th scope="col" className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Buyer</th>
                        <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Face Value</th>
                        <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Remaining</th>
                        <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                        <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftCardProgram.cards
                        .filter(c => gcFilter === "all" || c.status === gcFilter)
                        .map((card) => (
                        <tr key={card.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{card.code}</td>
                          <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{card.buyerName || "—"}</td>
                          <td className="py-3 px-4 text-right font-bold">${card.faceValue}</td>
                          <td className="py-3 px-4 text-right hidden md:table-cell">${card.remainingBalance.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              card.status === "active" ? "bg-primary/15 text-primary" :
                              card.status === "redeemed" ? "bg-secondary/15 text-secondary" :
                              "bg-destructive/15 text-destructive"
                            }`}>{card.status}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {card.status === "active" && (
                              <button
                                onClick={() => setShowRevokeConfirm(card.id)}
                                className="px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-[11px] font-bold hover:bg-destructive/20 transition-colors"
                                aria-label={`Revoke gift card ${card.code}`}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl" id="analytics-heading">Analytics & Reports</h2>
              <p className="text-sm text-muted-foreground">Filter by date and campaign, then export CSV or PDF</p>
            </div>
            <AnalyticsCharts showExport={true} />

            {/* Conversion funnel */}
            <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-4 sm:p-6">
              <h3 className="font-heading font-bold mb-4">Conversion Funnel 🔄</h3>
              <div className="space-y-3">
                {[
                  { stage: "Link Views", value: bizCampaigns.reduce((s, c) => s + c.clicks * 3, 0).toLocaleString(), pct: 100, color: "bg-muted-foreground" },
                  { stage: "Link Clicks", value: bizCampaigns.reduce((s, c) => s + c.clicks, 0).toLocaleString(), pct: 33, color: "bg-primary" },
                  { stage: "Conversions", value: bizCampaigns.reduce((s, c) => s + c.conversions, 0).toString(), pct: 8, color: "bg-secondary" },
                  { stage: "Repeat Customers", value: Math.round(bizCampaigns.reduce((s, c) => s + c.conversions * 0.3, 0)).toString(), pct: 2.4, color: "bg-accent" },
                ].map((s) => (
                  <div key={s.stage}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{s.stage}</span>
                      <span className="font-bold">{s.value} <span className="text-muted-foreground text-xs">({s.pct}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "payouts":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading font-bold text-xl" id="payouts-heading">Payout Management</h2>
                <p className="text-sm text-muted-foreground">Create runs, track status, and control payout flow</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCreatePayout(true)}
                  className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm shadow-mint hover:opacity-90 transition-opacity"
                  aria-label="Create new payout run">
                  ＋ New Payout Run
                </button>
                <button
                  onClick={() => setShowPayoutConfirm(payoutsPausedGlobal ? "resume" : "pause")}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${payoutsPausedGlobal ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20"}`}
                  aria-label={payoutsPausedGlobal ? "Resume all payouts" : "Pause all payouts"}
                >
                  {payoutsPausedGlobal ? "▶ Resume All" : "⏸ Pause All"}
                </button>
              </div>
            </div>

            {payoutsPausedGlobal && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center gap-3" role="alert">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-sm text-destructive">Payouts are globally paused</p>
                  <p className="text-xs text-muted-foreground">No payouts will be processed until you resume.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Paid", value: `$${payoutRuns.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0).toFixed(2)}`, emoji: "✅" },
                { label: "Processing", value: `$${payoutRuns.filter(p => p.status === "processing").reduce((s, p) => s + p.amount, 0).toFixed(2)}`, emoji: "⏳" },
                { label: "Pending", value: `$${payoutRuns.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0).toFixed(2)}`, emoji: "📋" },
                { label: "This Month", value: `$${payoutRuns.reduce((s, p) => s + p.amount, 0).toFixed(2)}`, emoji: "📅" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card" role="status" aria-label={`${s.label}: ${s.value}`}>
                  <span className="text-lg">{s.emoji}</span>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <p className="text-xl font-bold font-heading mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-labelledby="payouts-heading">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th scope="col" className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Affiliate</th>
                      <th scope="col" className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">Campaign</th>
                      <th scope="col" className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">Date</th>
                      <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Amount</th>
                      <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                      <th scope="col" className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRuns.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-medium">{p.affiliate}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.campaign}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{p.date}</td>
                        <td className="py-3 px-4 text-right font-bold">${p.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === "completed" ? "bg-primary/15 text-primary" :
                            p.status === "processing" ? "bg-secondary/15 text-secondary" :
                            "bg-accent/15 text-accent"
                          }`}>{p.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {p.status === "pending" && (
                            <div className="flex justify-end gap-1">
                              <button onClick={() => {
                                setPayoutRuns(prev => prev.map(r => r.id === p.id ? { ...r, status: "processing" as const } : r));
                                toast({ title: `Processing payout to ${p.affiliate} ⏳` });
                              }} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/20 transition-colors"
                                aria-label={`Process payout to ${p.affiliate}`}>
                                Process
                              </button>
                              <button onClick={() => {
                                setPayoutRuns(prev => prev.filter(r => r.id !== p.id));
                                toast({ title: "Payout cancelled", variant: "destructive" });
                              }} className="px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-[11px] font-bold hover:bg-destructive/20 transition-colors"
                                aria-label={`Cancel payout to ${p.affiliate}`}>
                                Cancel
                              </button>
                            </div>
                          )}
                          {p.status === "processing" && (
                            <button onClick={() => {
                              setPayoutRuns(prev => prev.map(r => r.id === p.id ? { ...r, status: "completed" as const } : r));
                              toast({ title: `Payout to ${p.affiliate} completed ✅` });
                            }} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/20 transition-colors"
                              aria-label={`Complete payout to ${p.affiliate}`}>
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case "activity":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl">Activity Feed</h2>
              <p className="text-sm text-muted-foreground">Real-time updates across all campaigns</p>
            </div>
            <ActivityFeed />
          </motion.div>
        );

      case "referrals":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold text-xl">Referral Codes</h2>
              <p className="text-sm text-muted-foreground">Track affiliate referral links and performance</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Codes", value: sampleReferrals.filter(r => r.active).length, emoji: "🔗" },
                { label: "Total Uses", value: sampleReferrals.reduce((s, r) => s + r.uses, 0), emoji: "📊" },
                { label: "Total Revenue", value: `$${sampleReferrals.reduce((s, r) => s + r.revenue, 0).toLocaleString()}`, emoji: "💰" },
                { label: "Avg / Code", value: `$${Math.round(sampleReferrals.reduce((s, r) => s + r.revenue, 0) / sampleReferrals.length)}`, emoji: "📈" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-gradient-card border border-border shadow-card">
                  <span className="text-lg">{s.emoji}</span>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <p className="text-xl font-bold font-heading mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Code</th>
                      <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Affiliate</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Uses</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleReferrals.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{r.code}</td>
                        <td className="py-3 px-4">{r.affiliate}</td>
                        <td className="py-3 px-4 text-right">{r.uses}</td>
                        <td className="py-3 px-4 text-right font-bold">${r.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                          }`}>{r.active ? "Active" : "Inactive"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case "profile":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-heading font-bold text-xl">Business Profile</h2>
              <p className="text-sm text-muted-foreground">Manage your business information</p>
            </div>

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
                      <button onClick={handleSaveProfile} className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm">Save Changes</button>
                      <button onClick={() => { setIsEditing(false); setProfileDraft(businessProfile); }} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm">Cancel</button>
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
                        ✏️ Edit
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
        );

      case "settings":
        return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-heading font-bold text-xl">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your dashboard preferences</p>
            </div>

            <div className="space-y-4">
              {[
                { title: "Notifications", desc: "Manage email and push notification preferences", emoji: "🔔" },
                { title: "Payout Methods", desc: "Configure how you receive affiliate commission payments", emoji: "🏦" },
                { title: "API Keys", desc: "Manage API keys for integrations", emoji: "🔑" },
                { title: "Team Members", desc: "Invite team members to manage your dashboard", emoji: "👥" },
                { title: "Billing", desc: "View billing history and manage payment methods", emoji: "💳" },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toast({ title: `${item.title} — coming soon!` })}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-background">
        <BusinessSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {/* Top header bar */}
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-xl" role="banner">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-lg px-2 py-1" aria-label="Go to homepage">
                  ← Home
                </button>
                <span className="text-border">|</span>
                <h1 className="font-heading font-bold text-sm sm:text-base">Business Dashboard</h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 sm:px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-mint focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Create new campaign"
              >
                ＋ New Campaign
              </button>
            </div>
          </header>

          {/* Mobile more menu */}
          <AnimatePresence>
            {mobileMoreOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="lg:hidden border-b border-border bg-card p-3 grid grid-cols-3 gap-2">
                {[
                  { key: "referrals", label: "Referrals", emoji: "🔗" },
                  { key: "profile", label: "Profile", emoji: "✏️" },
                  { key: "settings", label: "Settings", emoji: "⚙️" },
                  { key: "activity", label: "Activity", emoji: "⚡" },
                ].map((item) => (
                  <button key={item.key} onClick={() => handleTabChange(item.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === item.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                    <span>{item.emoji}</span> {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content area */}
          <div className="p-4 lg:p-8" role="main" aria-live="polite">
            {renderContent()}
          </div>
        </main>

        {/* Modals */}
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

        {/* Payout pause/resume confirmation */}
        <AnimatePresence>
          {showPayoutConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowPayoutConfirm(null)} role="dialog" aria-modal="true" aria-label="Confirm payout action">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading">
                  {showPayoutConfirm === "pause" ? "⏸ Pause all payouts?" : "▶ Resume all payouts?"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {showPayoutConfirm === "pause"
                    ? "All pending and processing payouts will be held. Affiliates will be notified."
                    : "All held payouts will resume processing. This cannot be undone."
                  }
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowPayoutConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring">Cancel</button>
                  <button onClick={() => {
                    setPayoutsPausedGlobal(!payoutsPausedGlobal);
                    setShowPayoutConfirm(null);
                    toast({ title: payoutsPausedGlobal ? "Payouts resumed ▶️" : "Payouts paused ⏸️" });
                  }} className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    showPayoutConfirm === "pause" ? "bg-destructive text-destructive-foreground" : "bg-gradient-mint text-primary-foreground shadow-mint"
                  }`}>{showPayoutConfirm === "pause" ? "Pause All" : "Resume All"}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Payout Run modal */}
        <AnimatePresence>
          {showCreatePayout && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCreatePayout(false)} role="dialog" aria-modal="true" aria-label="Create payout run">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading">Create Payout Run</h3>
                  <button onClick={() => setShowCreatePayout(false)} className="p-1.5 rounded-lg hover:bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Close">✕</button>
                </div>
                <div>
                  <label htmlFor="payout-affiliate" className="text-xs text-muted-foreground font-medium">Affiliate name</label>
                  <input id="payout-affiliate" value={newPayoutDraft.affiliate} onChange={(e) => setNewPayoutDraft({ ...newPayoutDraft, affiliate: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Sarah M." />
                </div>
                <div>
                  <label htmlFor="payout-amount" className="text-xs text-muted-foreground font-medium">Amount ($)</label>
                  <input id="payout-amount" type="number" value={newPayoutDraft.amount} onChange={(e) => setNewPayoutDraft({ ...newPayoutDraft, amount: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="125.00" />
                </div>
                <div>
                  <label htmlFor="payout-campaign" className="text-xs text-muted-foreground font-medium">Campaign</label>
                  <select id="payout-campaign" value={newPayoutDraft.campaign} onChange={(e) => setNewPayoutDraft({ ...newPayoutDraft, campaign: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select campaign</option>
                    {bizCampaigns.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <button onClick={() => {
                  if (!newPayoutDraft.affiliate || !newPayoutDraft.amount) {
                    toast({ title: "Please fill all fields", variant: "destructive" }); return;
                  }
                  setPayoutRuns(prev => [{
                    id: `p${Date.now()}`, affiliate: newPayoutDraft.affiliate,
                    amount: Number(newPayoutDraft.amount), campaign: newPayoutDraft.campaign,
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    status: "pending" as const,
                  }, ...prev]);
                  setNewPayoutDraft({ affiliate: "", amount: "", campaign: "" });
                  setShowCreatePayout(false);
                  toast({ title: "Payout run created ✅" });
                }} className="w-full px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm shadow-mint focus:outline-none focus:ring-2 focus:ring-ring">
                  💸 Create Run
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Gift Card modal */}
        <AnimatePresence>
          {showGenGiftCard && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowGenGiftCard(false)} role="dialog" aria-modal="true" aria-label="Generate gift cards">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading">🎁 Generate Gift Cards</h3>
                  <button onClick={() => setShowGenGiftCard(false)} className="p-1.5 rounded-lg hover:bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Close">✕</button>
                </div>
                <div>
                  <label htmlFor="gc-facevalue" className="text-xs text-muted-foreground font-medium">Face value ($)</label>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {giftCardProgram.denominations.map(d => (
                      <button key={d} onClick={() => setGcDraft({ ...gcDraft, faceValue: d })}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${gcDraft.faceValue === d ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                        aria-pressed={gcDraft.faceValue === d}>
                        ${d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="gc-qty" className="text-xs text-muted-foreground font-medium">Quantity</label>
                  <input id="gc-qty" type="number" min={1} max={20} value={gcDraft.quantity}
                    onChange={(e) => setGcDraft({ ...gcDraft, quantity: Math.min(20, Math.max(1, Number(e.target.value))) })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label htmlFor="gc-buyer" className="text-xs text-muted-foreground font-medium">Buyer name (optional)</label>
                  <input id="gc-buyer" value={gcDraft.buyerName} onChange={(e) => setGcDraft({ ...gcDraft, buyerName: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Walk-in customer" />
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground">
                    Generating <strong className="text-foreground">{gcDraft.quantity}</strong> × <strong className="text-foreground">${gcDraft.faceValue}</strong> cards
                    = <strong className="text-primary">${gcDraft.quantity * gcDraft.faceValue}</strong> total face value
                  </p>
                </div>
                <button onClick={() => {
                  const { updateGiftCardProgram } = useAffiliate.arguments ? {} as any : {};
                  for (let i = 0; i < gcDraft.quantity; i++) {
                    const code = `IBL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                    const newCard: GiftCard = {
                      id: `gc-${Date.now()}-${i}`,
                      code,
                      faceValue: gcDraft.faceValue,
                      buyerPaid: +(gcDraft.faceValue * (1 - giftCardProgram.redemptionDiscountPercent / 100)).toFixed(2),
                      buyerName: gcDraft.buyerName || "Direct sale",
                      soldVia: "direct",
                      issuedAt: new Date().toLocaleDateString(),
                      status: "active",
                      remainingBalance: gcDraft.faceValue,
                      expiresAt: new Date(Date.now() + 365 * 86400000).toLocaleDateString(),
                    };
                    giftCardProgram.cards.push(newCard);
                  }
                  giftCardProgram.cardsIssued += gcDraft.quantity;
                  giftCardProgram.grossSales += gcDraft.quantity * +(gcDraft.faceValue * (1 - giftCardProgram.redemptionDiscountPercent / 100)).toFixed(2);
                  giftCardProgram.outstandingLiability += gcDraft.quantity * gcDraft.faceValue;
                  setShowGenGiftCard(false);
                  toast({ title: `${gcDraft.quantity} gift card(s) generated 🎉` });
                }} className="w-full px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm shadow-mint focus:outline-none focus:ring-2 focus:ring-ring">
                  🎁 Generate {gcDraft.quantity} Card{gcDraft.quantity > 1 ? "s" : ""}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revoke Gift Card confirmation */}
        <AnimatePresence>
          {showRevokeConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowRevokeConfirm(null)} role="dialog" aria-modal="true" aria-label="Confirm gift card revocation">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
                <h3 className="text-lg font-bold font-heading">🚫 Revoke this gift card?</h3>
                <p className="text-sm text-muted-foreground">
                  This card will be voided and cannot be redeemed. The buyer may need a refund.
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowRevokeConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-muted text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring">Keep Active</button>
                  <button onClick={() => {
                    const card = giftCardProgram.cards.find(c => c.id === showRevokeConfirm);
                    if (card) {
                      card.status = "voided";
                      giftCardProgram.outstandingLiability -= card.remainingBalance;
                      card.remainingBalance = 0;
                    }
                    setShowRevokeConfirm(null);
                    toast({ title: "Gift card revoked 🚫", variant: "destructive" });
                  }} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    Revoke
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <button onClick={() => setViewingCampaign(null)} className="p-1.5 rounded-lg hover:bg-muted text-sm">✕</button>
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
                  <button onClick={() => setEditingCampaign(null)} className="p-1.5 rounded-lg hover:bg-muted text-sm">✕</button>
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
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Offer & Payouts</p>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-muted-foreground">Audience discount</label>
                      <span className="text-xs font-bold text-primary">{editingCampaign.discountPercent}% OFF</span>
                    </div>
                    <input type="range" min={0} max={50} value={editingCampaign.discountPercent}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, discountPercent: Number(e.target.value) })}
                      className="w-full accent-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">CPC ($)</label>
                      <input type="number" step="0.01" value={editingCampaign.cpcRate}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, cpcRate: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Discount budget</label>
                      <input type="number" value={editingCampaign.discountBudget}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, discountBudget: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm" />
                    </div>
                  </div>
                </div>
                <button onClick={handleSaveEdit}
                  className="w-full px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                  💾 Save Changes
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
