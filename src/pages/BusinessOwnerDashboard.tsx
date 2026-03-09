import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  DollarSign,
  BarChart3,
  Edit3,
  Trash2,
  Eye,
  TrendingUp,
  Star,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import CreateCampaignModal from "@/components/business/CreateCampaignModal";
import AnalyticsCharts from "@/components/business/AnalyticsCharts";
import ActivityFeed from "@/components/business/ActivityFeed";
import { toast } from "@/hooks/use-toast";

const businessProfile = {
  name: "The Mint Garden",
  category: "Restaurant & Bar",
  city: "Lagos",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  bio: "Premium dining experience in the heart of Lagos. Farm-to-table cuisine with craft cocktails.",
  rating: 4.8,
  totalAffiliates: 45,
  totalRevenue: "$12,450",
};

const initialCampaigns = [
  { id: "1", title: "Weekend Brunch Push 🥂", status: "active", affiliates: 23, clicks: 4500, conversions: 120, revenue: "$3,600", commission: 15 },
  { id: "2", title: "Date Night Special 🌙", status: "active", affiliates: 18, clicks: 2800, conversions: 85, revenue: "$2,550", commission: 12 },
  { id: "3", title: "Holiday Menu Launch 🎄", status: "ended", affiliates: 31, clicks: 6200, conversions: 210, revenue: "$6,300", commission: 18 },
];

const topAffiliates = [
  { name: "Sarah M.", clicks: 1200, conversions: 45, earned: "$675", avatar: "🧑‍💻" },
  { name: "James K.", clicks: 980, conversions: 38, earned: "$570", avatar: "🎨" },
  { name: "Aisha D.", clicks: 850, conversions: 32, earned: "$480", avatar: "📸" },
  { name: "David O.", clicks: 720, conversions: 28, earned: "$420", avatar: "🎯" },
  { name: "Fatima B.", clicks: 650, conversions: 22, earned: "$330", avatar: "✨" },
];

const BusinessOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "affiliates" | "profile">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(businessProfile);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { key: "overview", label: "Overview 📊", icon: BarChart3 },
    { key: "campaigns", label: "Campaigns 📢", icon: BarChart3 },
    { key: "affiliates", label: "Affiliates 👥", icon: Users },
    { key: "profile", label: "Profile ✏️", icon: Edit3 },
  ] as const;

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    toast({ title: "Campaign deleted", variant: "destructive" });
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-xl">
          <div className="container flex items-center gap-4 h-16">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg">Business Dashboard</h1>
              <p className="text-xs text-muted-foreground">{profile.name} · {profile.city}</p>
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
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: profile.totalRevenue, icon: DollarSign, color: "text-primary" },
              { label: "Active Affiliates", value: profile.totalAffiliates, icon: Users, color: "text-secondary" },
              { label: "Avg Rating", value: profile.rating, icon: Star, color: "text-accent" },
              { label: "Campaigns", value: campaigns.length, icon: BarChart3, color: "text-primary" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnalyticsCharts />
                </div>
                <div>
                  <ActivityFeed />
                </div>
              </div>
            </motion.div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {campaigns.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold">{c.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === "active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.commission}% commission · {c.affiliates} affiliates</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCampaign(c.id)}
                        className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                      >
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
                      <p className="text-lg font-bold font-heading text-secondary">{c.revenue}</p>
                      <p className="text-[10px] text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {campaigns.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-lg mb-2">No campaigns yet</p>
                  <button onClick={() => setShowCreateModal(true)} className="text-primary font-bold hover:underline">
                    Create your first campaign →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Affiliates Tab */}
          {activeTab === "affiliates" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h3 className="font-heading font-bold text-lg">Top Performing Affiliates 🏆</h3>
              {topAffiliates.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {a.avatar}
                  </div>
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

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
              <div className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${profile.image})` }} />
                <div className="p-6 space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-3">
                        {[
                          { label: "Business Name", key: "name" as const },
                          { label: "Category", key: "category" as const },
                        ].map((field) => (
                          <div key={field.key}>
                            <label className="text-xs text-muted-foreground font-medium">{field.label}</label>
                            <input
                              value={profile[field.key]}
                              onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        ))}
                        <div>
                          <label className="text-xs text-muted-foreground font-medium">Bio</label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={3}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setIsEditing(false); toast({ title: "Profile Updated! ✅" }); }}
                          className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm"
                        >
                          Save Changes
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-xl font-bold font-heading">{profile.name}</h2>
                          <p className="text-sm text-muted-foreground">{profile.category} · {profile.city}</p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">⭐ {profile.rating} Rating</span>
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">👥 {profile.totalAffiliates} Affiliates</span>
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
            setCampaigns([campaign, ...campaigns]);
          }}
        />
      </div>
    </PageTransition>
  );
};

export default BusinessOwnerDashboard;
