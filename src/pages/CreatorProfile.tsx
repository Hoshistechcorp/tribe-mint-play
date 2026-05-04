import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import PageTransition from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useAffiliate } from "@/contexts/AffiliateContext";

const CreatorProfile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const {
    creatorProfile,
    setCreatorProfile,
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = useAffiliate();
  const [activeTab, setActiveTab] = useState<"profile" | "socials" | "payments">("profile");

  const [profile, setProfile] = useState({
    displayName: creatorProfile.displayName,
    username: creatorProfile.username,
    bio: creatorProfile.bio,
    email: creatorProfile.email,
    city: creatorProfile.city,
    avatar: creatorProfile.avatar,
  });

  const [socials, setSocials] = useState([
    { platform: "Instagram", handle: creatorProfile.socials.instagram || "—", connected: !!creatorProfile.socials.instagram, emoji: "📸", followers: "12.4K" },
    { platform: "Twitter / X", handle: creatorProfile.socials.twitter || "—", connected: !!creatorProfile.socials.twitter, emoji: "🐦", followers: "8.2K" },
    { platform: "YouTube", handle: "—", connected: false, emoji: "▶️", followers: "—" },
    { platform: "Website", handle: creatorProfile.socials.website || "—", connected: !!creatorProfile.socials.website, emoji: "🌐", followers: "—" },
  ]);

  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodName, setNewMethodName] = useState("");
  const [newMethodType, setNewMethodType] = useState<"bank" | "paystack" | "flexit">("bank");

  const methodEmoji = (type: string) =>
    type === "bank" ? "🏦" : type === "paystack" ? "💳" : "💳";

  const handleSaveProfile = () => {
    setCreatorProfile(profile);
    toast({ title: "Profile saved! ✅" });
  };

  const handleAddMethod = () => {
    if (!newMethodName.trim()) {
      toast({ title: "❌ Enter a name", description: "Account name required." });
      return;
    }
    addPaymentMethod(newMethodName.trim(), newMethodType);
    toast({ title: "✅ Payment method added!" });
    setNewMethodName("");
    setShowAddMethod(false);
  };

  const tabs = [
    { key: "profile", label: "Profile 👤", emoji: "👤" },
    { key: "socials", label: "Socials 🔗", emoji: "🔗" },
    { key: "payments", label: "Payments 💳", emoji: "💳" },
  ] as const;

  const toggleSocial = (index: number) => {
    const updated = [...socials];
    updated[index].connected = !updated[index].connected;
    setSocials(updated);
    toast({
      title: updated[index].connected ? `${updated[index].platform} Connected! ✅` : `${updated[index].platform} Disconnected`,
    });
  };

  const setDefaultPayment = (id: string) => {
    setDefaultPaymentMethod(id);
    toast({ title: "Default payment updated! 💳" });
  };

  const removePayment = (id: string) => {
    removePaymentMethod(id);
    toast({ title: "Payment method removed", variant: "destructive" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container flex items-center gap-4 h-16">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <span>←</span>
            </button>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg">Settings</h1>
            </div>
          </div>
        </div>

        <div className="container py-8 max-w-3xl space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-card border border-border flex items-center justify-center text-4xl">
                  {profile.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading">{profile.displayName}</h2>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6 space-y-4">
                {[
                  { label: "Display Name", key: "displayName" as const },
                  { label: "Username", key: "username" as const },
                  { label: "Email", key: "email" as const },
                  { label: "City", key: "city" as const },
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
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center gap-2"
                >
                  <span>💾</span> Save Changes
                </button>
              </div>

              {/* Appearance */}
              <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎨</span>
                  <h3 className="font-bold font-heading">Appearance</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Socials Tab */}
          {activeTab === "socials" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {socials.map((s, i) => (
                <div
                  key={s.platform}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <span>{s.emoji || "📌"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm font-heading">{s.platform}</p>
                    <p className="text-xs text-muted-foreground">{s.handle}{s.followers !== "—" && ` · ${s.followers} followers`}</p>
                  </div>
                  <button
                    onClick={() => toggleSocial(i)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      s.connected
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {s.connected ? "Connected ✓" : "Connect"}
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {paymentMethods.map((p) => {
                const emoji = methodEmoji(p.type);
                return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-gradient-card border border-border shadow-card flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-lg">{emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm font-heading">{p.name}</p>
                      {p.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center gap-1">
                          <span>✅</span> Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{p.type}</p>
                  </div>
                  <div className="flex gap-2">
                    {!p.isDefault && (
                      <button
                        onClick={() => setDefaultPayment(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => removePayment(p.id)}
                      className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
                );
              })}

              {showAddMethod ? (
                <div className="p-4 rounded-xl bg-gradient-card border border-border shadow-card space-y-3">
                  <div className="flex gap-2">
                    {(["bank", "paystack", "flexit"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewMethodType(t)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          newMethodType === t ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t === "bank" ? "🏦 Bank" : t === "paystack" ? "💳 Paystack" : "⚡ Flex-it"}
                      </button>
                    ))}
                  </div>
                  <input
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    placeholder="Account name (e.g. GTBank ****1234)"
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddMethod} className="flex-1 py-2.5 bg-gradient-mint text-primary-foreground rounded-lg text-xs font-bold">
                      Add Method
                    </button>
                    <button onClick={() => { setShowAddMethod(false); setNewMethodName(""); }} className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddMethod(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <span>＋</span> Add Payment Method
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default CreatorProfile;
