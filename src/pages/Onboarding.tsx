import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { Checkbox } from "@/components/ui/checkbox";

type Role = "creator" | "business" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const { setCreatorProfile, setBusinessProfile } = useAffiliate();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(0); // 0 = role select, 1-3 = role-specific steps
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Creator state
  const [creatorData, setCreatorData] = useState({
    displayName: "",
    username: "",
    city: "",
    bio: "",
    instagram: "",
    twitter: "",
    website: "",
    niche: [] as string[],
  });

  // Business state
  const [businessData, setBusinessData] = useState({
    name: "",
    category: "",
    city: "",
    description: "",
    website: "",
    commissionRate: "15",
    logo: "🏪",
  });

  const niches = ["Food & Dining", "Travel", "Nightlife", "Beauty", "Fitness", "Fashion", "Tech", "Lifestyle"];
  const categories = ["Restaurant", "Hotel", "Bar & Lounge", "Café", "Spa & Wellness", "Events", "Retail"];

  const toggleNiche = (n: string) => {
    setCreatorData((prev) => ({
      ...prev,
      niche: prev.niche.includes(n) ? prev.niche.filter((x) => x !== n) : [...prev.niche, n],
    }));
  };

  const totalSteps = role ? 3 : 0;

  const handleFinish = () => {
    fireConfetti();
    if (role === "creator") {
      setCreatorProfile({
        displayName: creatorData.displayName || "New Creator",
        username: creatorData.username || "newcreator",
        city: creatorData.city,
        bio: creatorData.bio,
        niche: creatorData.niche,
        socials: {
          instagram: creatorData.instagram,
          twitter: creatorData.twitter,
          website: creatorData.website,
        },
      });
    } else if (role === "business") {
      setBusinessProfile({
        name: businessData.name,
        category: businessData.category,
        city: businessData.city,
        description: businessData.description,
        website: businessData.website,
        commissionRate: Number(businessData.commissionRate) || 15,
        logo: businessData.logo,
      });
    }
    toast({
      title: role === "creator" ? "Welcome to TribeMint! 🎉" : "Business registered! 🚀",
      description: role === "creator" ? "Start exploring campaigns and earning." : "Your business is ready for affiliates.",
    });
    navigate(role === "creator" ? "/dashboard" : "/business-dashboard");
  };

  const canProceed = () => {
    if (step === 0) return !!role;
    if (role === "creator") {
      if (step === 1) return creatorData.displayName.trim() && creatorData.username.trim();
      if (step === 2) return creatorData.niche.length > 0;
      return acceptedTerms;
    }
    if (role === "business") {
      if (step === 1) return businessData.name.trim() && businessData.category;
      if (step === 2) return businessData.description.trim();
      return acceptedTerms;
    }
    return false;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Progress bar */}
        {step > 0 && (
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-mint"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              {/* Step 0: Role Selection */}
              {step === 0 && (
                <motion.div
                  key="role"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 text-center"
                >
                  <div>
                    <h1 className="text-3xl font-bold font-heading mb-2">
                      Welcome to <span className="text-gradient-mint">TribeMint</span> 🌿
                    </h1>
                    <p className="text-muted-foreground">How do you want to use TribeMint?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRole("creator")}
                      className={`p-6 rounded-2xl border-2 transition-all text-left space-y-3 ${
                        role === "creator"
                          ? "border-primary bg-primary/10 shadow-mint"
                          : "border-border bg-gradient-card hover:border-primary/30"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                         <span className="text-2xl">📢</span>
                      </div>
                      <div>
                        <p className="font-bold font-heading">Creator</p>
                        <p className="text-xs text-muted-foreground">Share links, earn cash, level up</p>
                      </div>
                      {role === "creator" && <span>✓</span>}
                    </button>

                    <button
                      onClick={() => setRole("business")}
                      className={`p-6 rounded-2xl border-2 transition-all text-left space-y-3 ${
                        role === "business"
                          ? "border-primary bg-primary/10 shadow-mint"
                          : "border-border bg-gradient-card hover:border-primary/30"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <span>🏪</span>
                      </div>
                      <div>
                        <p className="font-bold font-heading">Business</p>
                        <p className="text-xs text-muted-foreground">Get affiliates promoting you</p>
                      </div>
                      {role === "business" && <span>✓</span>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Creator Step 1: Profile */}
              {step === 1 && role === "creator" && (
                <motion.div key="c1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Set up your profile 👤</h2>
                    <p className="text-sm text-muted-foreground">Tell the world who you are</p>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-gradient-card border border-border p-6 shadow-card">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Display Name *</label>
                      <input value={creatorData.displayName} onChange={(e) => setCreatorData({ ...creatorData, displayName: e.target.value })} placeholder="Alex Thompson" maxLength={50} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Username *</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                        <input value={creatorData.username} onChange={(e) => setCreatorData({ ...creatorData, username: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() })} placeholder="alexcreates" maxLength={20} className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">City</label>
                      <div className="relative mt-1">
                        <span>📍</span>
                        <input value={creatorData.city} onChange={(e) => setCreatorData({ ...creatorData, city: e.target.value })} placeholder="Lagos, Nigeria" className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Bio</label>
                      <textarea value={creatorData.bio} onChange={(e) => setCreatorData({ ...creatorData, bio: e.target.value })} placeholder="Tell brands why they should work with you..." rows={3} maxLength={200} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Creator Step 2: Niche */}
              {step === 2 && role === "creator" && (
                <motion.div key="c2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Pick your niches 🎯</h2>
                    <p className="text-sm text-muted-foreground">We'll match you with relevant campaigns</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {niches.map((n) => (
                      <button
                        key={n}
                        onClick={() => toggleNiche(n)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          creatorData.niche.includes(n)
                            ? "bg-primary/20 text-primary border border-primary/30 shadow-mint"
                            : "bg-gradient-card border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {creatorData.niche.includes(n) && "✓ "}{n}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Creator Step 3: Socials */}
              {step === 3 && role === "creator" && (
                <motion.div key="c3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Connect your socials 🔗</h2>
                    <p className="text-sm text-muted-foreground">Optional — helps businesses discover you</p>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-gradient-card border border-border p-6 shadow-card">
                    {[
                      { key: "instagram" as const, emoji: "📸", label: "Instagram", placeholder: "@handle" },
                      { key: "twitter" as const, emoji: "🐦", label: "Twitter / X", placeholder: "@handle" },
                      { key: "website" as const, emoji: "🌐", label: "Website", placeholder: "yoursite.com" },
                    ].map((s) => (
                      <div key={s.key} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <span>{s.emoji || "📌"}</span>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground font-medium">{s.label}</label>
                          <input
                            value={creatorData[s.key]}
                            onChange={(e) => setCreatorData({ ...creatorData, [s.key]: e.target.value })}
                            placeholder={s.placeholder}
                            className="w-full mt-0.5 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-3">
                    <span>✨</span>
                    <p className="text-xs text-muted-foreground">You can always update these later in your Settings.</p>
                  </div>
                  <TermsBlock role="creator" checked={acceptedTerms} onChange={setAcceptedTerms} />
                </motion.div>
              )}

              {/* Business Step 1: Info */}
              {step === 1 && role === "business" && (
                <motion.div key="b1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Your business details 🏪</h2>
                    <p className="text-sm text-muted-foreground">Let creators know about your brand</p>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-gradient-card border border-border p-6 shadow-card">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl border border-border">
                        {businessData.logo}
                      </div>
                      <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                        <span>📷</span> Upload Logo
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Business Name *</label>
                      <input value={businessData.name} onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })} placeholder="The Mint Garden" maxLength={60} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Category *</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {categories.map((c) => (
                          <button
                            key={c}
                            onClick={() => setBusinessData({ ...businessData, category: c })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              businessData.category === c
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">City</label>
                      <input value={businessData.city} onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })} placeholder="Lagos, Nigeria" className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Business Step 2: Description */}
              {step === 2 && role === "business" && (
                <motion.div key="b2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Tell your story ✍️</h2>
                    <p className="text-sm text-muted-foreground">Help creators understand your brand</p>
                  </div>
                  <div className="space-y-4 rounded-2xl bg-gradient-card border border-border p-6 shadow-card">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Description *</label>
                      <textarea value={businessData.description} onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })} placeholder="Premium dining experience in the heart of Lagos..." rows={4} maxLength={500} className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Website</label>
                      <input value={businessData.website} onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })} placeholder="https://yourbusiness.com" className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Business Step 3: Commission */}
              {step === 3 && role === "business" && (
                <motion.div key="b3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold font-heading">Set your commission 💰</h2>
                    <p className="text-sm text-muted-foreground">How much will you pay creators per sale?</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-card border border-border p-6 shadow-card space-y-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold font-heading text-gradient-mint">{businessData.commissionRate}%</p>
                      <p className="text-sm text-muted-foreground mt-1">per sale</p>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={businessData.commissionRate}
                      onChange={(e) => setBusinessData({ ...businessData, commissionRate: e.target.value })}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5%</span>
                      <span>Industry avg: 15%</span>
                      <span>40%</span>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                      <p className="text-xs text-muted-foreground">
                        💡 Higher commissions attract more top creators. Businesses offering 15%+ get 3x more affiliates on average.
                      </p>
                    </div>
                  </div>
                  <TermsBlock role="business" checked={acceptedTerms} onChange={setAcceptedTerms} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-2"
                >
                  <span>←</span> Back
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => {
                  if (!canProceed()) {
                    toast({ title: "Please fill in required fields", variant: "destructive" });
                    return;
                  }
                  if (step === 0) setStep(1);
                  else if (step < totalSteps) setStep(step + 1);
                  else handleFinish();
                }}
                disabled={!canProceed()}
                className="px-6 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 0 ? "Get Started" : step === totalSteps ? "Finish 🎉" : "Continue"}
                <span>→</span>
              </button>
            </div>

            {/* Step dots */}
            {step > 0 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i + 1 <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Onboarding;

function TermsBlock({
  role,
  checked,
  onChange,
}: {
  role: "creator" | "business";
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-4 sm:p-5 space-y-3">
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5"
        />
        <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary underline underline-offset-2 hover:opacity-80">Privacy Policy</a>
          {role === "creator" && (
            <>
              , and acknowledge that payouts are processed via{" "}
              <span className="font-semibold">Stripe Connect</span> under their connected-account terms.
            </>
          )}
          {role === "business" && (
            <>
              , and understand TribeMint is <span className="font-semibold">commission-based</span> — no subscription fees, just a take-rate on affiliate-driven revenue.
            </>
          )}
        </span>
      </label>
      <p className="text-[11px] text-muted-foreground pl-7">
        TribeMint is a property of <span className="font-semibold text-foreground/80">Ibloov</span>.
      </p>
    </div>
  );
}
