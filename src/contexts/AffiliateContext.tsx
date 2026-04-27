import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { type Business } from "@/data/sampleBusinesses";
import { sampleCampaigns, type Campaign } from "@/data/sampleCampaigns";

export interface AffiliateLink {
  id: string;
  businessId: string;
  businessName: string;
  code: string;
  clicks: number;
  conversions: number;
  earned: number;
  active: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "earning" | "withdrawal";
  amount: number;
  source: string;
  date: string;
  status: "completed" | "pending" | "failed";
  campaignId?: string;
  methodId?: string;
  estimatedArrival?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank" | "paystack" | "flexit";
  isDefault: boolean;
}

export interface CreatorProfile {
  displayName: string;
  username: string;
  bio: string;
  email: string;
  city: string;
  avatar: string;
  niche: string[];
  socials: { instagram: string; twitter: string; website: string };
}

export interface BusinessProfile {
  name: string;
  category: string;
  city: string;
  description: string;
  website: string;
  commissionRate: number;
  logo: string;
  rating: number;
}

export interface BizCampaign {
  id: string;
  title: string;
  description?: string;
  status: "active" | "ended" | "paused";
  affiliates: number;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  budget?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityEvent {
  id: string;
  emoji: string;
  text: string;
  date: string;
}

export interface Referral {
  id: string;
  name: string;
  joinedAt: string;
  status: "pending" | "joined" | "active";
  earned: number;
}

interface Balance {
  available: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
}

interface AffiliateContextType {
  // Core
  affiliateLinks: AffiliateLink[];
  joinedCampaigns: string[];
  balance: Balance;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];

  // Profiles
  creatorProfile: CreatorProfile;
  businessProfile: BusinessProfile;
  setCreatorProfile: (p: Partial<CreatorProfile>) => void;
  setBusinessProfile: (p: Partial<BusinessProfile>) => void;

  // Campaigns (creator side reads merged list)
  allCampaigns: Campaign[];
  bizCampaigns: BizCampaign[];
  addBizCampaign: (c: BizCampaign & { description?: string; type?: string }) => void;
  updateBizCampaign: (id: string, patch: Partial<BizCampaign>) => void;
  deleteBizCampaign: (id: string) => void;

  // Activity (creator)
  activity: ActivityEvent[];

  // Earned badges (derived)
  badges: { emoji: string; name: string; desc: string; earned: boolean }[];

  generateLink: (business: Business) => AffiliateLink;
  joinCampaign: (campaign: Campaign) => void;
  isCampaignJoined: (campaignId: string) => boolean;
  requestWithdrawal: (amount: number, methodId: string) => boolean;
  addPaymentMethod: (name: string, type: PaymentMethod["type"]) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // New
  updateLinkCode: (linkId: string, newCode: string) => boolean;
  confirmWithdrawal: (txId: string) => void;
  cancelWithdrawal: (txId: string) => void;
  referralCode: string;
  referrals: Referral[];
  referralEarnings: number;
  simulateReferralSignup: () => void;
}

const AffiliateContext = createContext<AffiliateContextType | null>(null);

const STORAGE_KEY = "tribemint_state_v2";

const defaultCreator: CreatorProfile = {
  displayName: "Alex Thompson",
  username: "alexcreates",
  bio: "Digital creator & lifestyle curator. Sharing the best experiences across Lagos, London & Dubai. 🌍✨",
  email: "alex@tribemint.com",
  city: "Lagos",
  avatar: "🧑‍💻",
  niche: ["Food & Dining", "Travel"],
  socials: { instagram: "@alexcreates", twitter: "@alexcreates", website: "alexcreates.com" },
};

const defaultBusiness: BusinessProfile = {
  name: "The Mint Garden",
  category: "Restaurant & Bar",
  city: "Lagos",
  description: "Premium dining experience in the heart of Lagos. Farm-to-table cuisine with craft cocktails.",
  website: "themintgarden.com",
  commissionRate: 15,
  logo: "🌿",
  rating: 4.8,
};

const initialLinks: AffiliateLink[] = [
  { id: "l1", businessId: "1", businessName: "The Mint Garden", code: "the-mint-garden", clicks: 2340, conversions: 28, earned: 420.0, active: true, createdAt: "Feb 15, 2026" },
  { id: "l2", businessId: "2", businessName: "Azure Hotel & Spa", code: "azure-hotel-&-spa", clicks: 1890, conversions: 19, earned: 340.2, active: true, createdAt: "Feb 20, 2026" },
  { id: "l3", businessId: "3", businessName: "Neon Lounge", code: "neon-lounge", clicks: 980, conversions: 12, earned: 78.4, active: true, createdAt: "Mar 1, 2026" },
  { id: "l4", businessId: "4", businessName: "Bamboo Kitchen", code: "bamboo-kitchen", clicks: 650, conversions: 8, earned: 65.0, active: false, createdAt: "Mar 3, 2026" },
];

const initialTransactions: Transaction[] = [
  { id: "t1", type: "earning", amount: 12.5, source: "The Mint Garden", date: "Today", status: "completed" },
  { id: "t2", type: "earning", amount: 8.0, source: "Azure Hotel & Spa", date: "Today", status: "completed" },
  { id: "t3", type: "withdrawal", amount: -200.0, source: "Bank Transfer", date: "Yesterday", status: "completed" },
  { id: "t4", type: "earning", amount: 22.3, source: "Neon Lounge", date: "Yesterday", status: "completed" },
  { id: "t5", type: "earning", amount: 45.0, source: "Azure Hotel & Spa", date: "Mar 5", status: "completed" },
  { id: "t6", type: "withdrawal", amount: -500.0, source: "Paystack", date: "Mar 3", status: "completed" },
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: "pm1", name: "GTBank ****4521", type: "bank", isDefault: true },
  { id: "pm2", name: "Paystack Wallet", type: "paystack", isDefault: false },
  { id: "pm3", name: "Flex-it", type: "flexit", isDefault: false },
];

const initialBizCampaigns: BizCampaign[] = [
  { id: "1", title: "Weekend Brunch Push 🥂", description: "Promote our weekend brunch menu.", status: "active", affiliates: 23, clicks: 4500, conversions: 120, revenue: 3600, commission: 15 },
  { id: "2", title: "Date Night Special 🌙", description: "Romantic dinner package.", status: "active", affiliates: 18, clicks: 2800, conversions: 85, revenue: 2550, commission: 12 },
  { id: "3", title: "Holiday Menu Launch 🎄", description: "Limited holiday menu.", status: "ended", affiliates: 31, clicks: 6200, conversions: 210, revenue: 6300, commission: 18 },
];

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

interface PersistedState {
  affiliateLinks: AffiliateLink[];
  joinedCampaigns: string[];
  balance: Balance;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  creatorProfile: CreatorProfile;
  businessProfile: BusinessProfile;
  bizCampaigns: BizCampaign[];
  customCampaigns: Campaign[];
  activity: ActivityEvent[];
  referralCode: string;
  referrals: Referral[];
}

const defaultState: PersistedState = {
  affiliateLinks: initialLinks,
  joinedCampaigns: [],
  balance: { available: 845.0, pending: 312.5, totalEarned: 4250.0, totalWithdrawn: 3092.5 },
  transactions: initialTransactions,
  paymentMethods: initialPaymentMethods,
  creatorProfile: defaultCreator,
  businessProfile: defaultBusiness,
  bizCampaigns: initialBizCampaigns,
  customCampaigns: [],
  activity: [
    { id: "a1", emoji: "💰", text: "Earned $12.50 from The Mint Garden", date: "2m ago" },
    { id: "a2", emoji: "🔗", text: "New click on Azure Hotel link", date: "5m ago" },
  ],
  referralCode: "alex-tribe",
  referrals: [
    { id: "r1", name: "Maya Chen", joinedAt: "Mar 12, 2026", status: "active", earned: 24.5 },
    { id: "r2", name: "Tomi Bello", joinedAt: "Mar 18, 2026", status: "joined", earned: 8.0 },
    { id: "r3", name: "Sara Lin", joinedAt: "Mar 22, 2026", status: "pending", earned: 0 },
  ],
};

export function AffiliateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState(STORAGE_KEY, defaultState));

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Simulate live click tracking + business revenue mirroring
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        let activityToAdd: ActivityEvent[] = [];
        const updatedLinks = prev.affiliateLinks.map((link) => {
          if (!link.active) return link;
          const clickBump = Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0;
          const convBump = clickBump > 2 && Math.random() > 0.7 ? 1 : 0;
          const earnBump = +(convBump * (Math.random() * 3 + 0.5)).toFixed(2);
          if (clickBump === 0) return link;

          // Mirror to business revenue if it's the current business
          if (earnBump > 0 && link.businessId === "1") {
            activityToAdd.push({
              id: `a${Date.now()}-${Math.random()}`,
              emoji: "💰",
              text: `Earned $${earnBump.toFixed(2)} from ${link.businessName}`,
              date: "just now",
            });
          }
          return {
            ...link,
            clicks: link.clicks + clickBump,
            conversions: link.conversions + convBump,
            earned: +(link.earned + earnBump).toFixed(2),
          };
        });

        const newActivity = [...activityToAdd, ...prev.activity].slice(0, 20);

        return { ...prev, affiliateLinks: updatedLinks, activity: newActivity };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate referral earnings trickling in
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.referrals.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.referrals.length);
        const target = prev.referrals[idx];
        if (!target || target.status === "pending") return prev;
        const bump = +(Math.random() * 2.5 + 0.5).toFixed(2);
        const updated = [...prev.referrals];
        updated[idx] = { ...target, earned: +(target.earned + bump).toFixed(2) };
        return { ...prev, referrals: updated };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const generateLink = useCallback((business: Business): AffiliateLink => {
    const existing = state.affiliateLinks.find((l) => l.businessId === business.id);
    if (existing) return existing;
    const newLink: AffiliateLink = {
      id: `l${Date.now()}`,
      businessId: business.id,
      businessName: business.name,
      code: business.name.toLowerCase().replace(/\s+/g, "-"),
      clicks: 0, conversions: 0, earned: 0, active: true, createdAt: "Today",
    };
    setState((prev) => ({
      ...prev,
      affiliateLinks: [newLink, ...prev.affiliateLinks],
      activity: [{ id: `a${Date.now()}`, emoji: "🔗", text: `Generated link for ${business.name}`, date: "just now" }, ...prev.activity].slice(0, 20),
    }));
    return newLink;
  }, [state.affiliateLinks]);

  const joinCampaign = useCallback((campaign: Campaign) => {
    setState((prev) => {
      if (prev.joinedCampaigns.includes(campaign.id)) return prev;
      const existing = prev.affiliateLinks.find((l) => l.businessId === campaign.businessId);
      const links = existing
        ? prev.affiliateLinks
        : [{
            id: `l${Date.now()}`,
            businessId: campaign.businessId,
            businessName: campaign.businessName,
            code: campaign.businessName.toLowerCase().replace(/\s+/g, "-"),
            clicks: 0, conversions: 0, earned: 0, active: true, createdAt: "Today",
          }, ...prev.affiliateLinks];
      return {
        ...prev,
        joinedCampaigns: [...prev.joinedCampaigns, campaign.id],
        affiliateLinks: links,
        activity: [{ id: `a${Date.now()}`, emoji: "🎯", text: `Joined "${campaign.title}"`, date: "just now" }, ...prev.activity].slice(0, 20),
      };
    });
  }, []);

  const isCampaignJoined = useCallback((id: string) => state.joinedCampaigns.includes(id), [state.joinedCampaigns]);

  const requestWithdrawal = useCallback((amount: number, methodId: string): boolean => {
    if (amount < 5 || amount > state.balance.available) return false;
    const method = state.paymentMethods.find((m) => m.id === methodId);
    setState((prev) => ({
      ...prev,
      transactions: [{
        id: `t${Date.now()}`, type: "withdrawal", amount: -amount,
        source: method?.name || "Bank Transfer", date: "Just now", status: "pending",
        methodId,
        estimatedArrival: "Within 24 hours",
      }, ...prev.transactions],
      balance: {
        ...prev.balance,
        available: +(prev.balance.available - amount).toFixed(2),
        totalWithdrawn: +(prev.balance.totalWithdrawn + amount).toFixed(2),
      },
    }));
    return true;
  }, [state.balance.available, state.paymentMethods]);

  const confirmWithdrawal = useCallback((txId: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === txId && t.type === "withdrawal" ? { ...t, status: "completed" as const, date: "Just now" } : t
      ),
      activity: [
        { id: `a${Date.now()}`, emoji: "✅", text: `Withdrawal confirmed`, date: "just now" },
        ...prev.activity,
      ].slice(0, 20),
    }));
  }, []);

  const cancelWithdrawal = useCallback((txId: string) => {
    setState((prev) => {
      const tx = prev.transactions.find((t) => t.id === txId);
      if (!tx || tx.status !== "pending") return prev;
      const refund = Math.abs(tx.amount);
      return {
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === txId ? { ...t, status: "failed" as const } : t
        ),
        balance: {
          ...prev.balance,
          available: +(prev.balance.available + refund).toFixed(2),
          totalWithdrawn: +(prev.balance.totalWithdrawn - refund).toFixed(2),
        },
      };
    });
  }, []);

  const updateLinkCode = useCallback((linkId: string, newCode: string): boolean => {
    const clean = newCode.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!clean || clean.length < 3) return false;
    let success = true;
    setState((prev) => {
      if (prev.affiliateLinks.some((l) => l.id !== linkId && l.code === clean)) {
        success = false;
        return prev;
      }
      return {
        ...prev,
        affiliateLinks: prev.affiliateLinks.map((l) => (l.id === linkId ? { ...l, code: clean } : l)),
      };
    });
    return success;
  }, []);

  const simulateReferralSignup = useCallback(() => {
    const names = ["Jordan Pierce", "Aisha Khan", "Diego Marin", "Lola Okafor", "Ravi Patel", "Mia Hart"];
    const name = names[Math.floor(Math.random() * names.length)];
    setState((prev) => ({
      ...prev,
      referrals: [
        { id: `r${Date.now()}`, name, joinedAt: "Just now", status: "pending", earned: 0 },
        ...prev.referrals,
      ],
      activity: [
        { id: `a${Date.now()}`, emoji: "🤝", text: `${name} signed up via your referral`, date: "just now" },
        ...prev.activity,
      ].slice(0, 20),
    }));
  }, []);

  const addPaymentMethod = useCallback((name: string, type: PaymentMethod["type"]) => {
    setState((prev) => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, { id: `pm${Date.now()}`, name, type, isDefault: false }],
    }));
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setState((prev) => ({ ...prev, paymentMethods: prev.paymentMethods.filter((m) => m.id !== id) }));
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })),
    }));
  }, []);

  const setCreatorProfile = useCallback((p: Partial<CreatorProfile>) => {
    setState((prev) => ({ ...prev, creatorProfile: { ...prev.creatorProfile, ...p } }));
  }, []);

  const setBusinessProfile = useCallback((p: Partial<BusinessProfile>) => {
    setState((prev) => ({ ...prev, businessProfile: { ...prev.businessProfile, ...p } }));
  }, []);

  const addBizCampaign = useCallback((c: BizCampaign & { description?: string; type?: string }) => {
    setState((prev) => {
      // Also create a creator-facing Campaign
      const creatorCampaign: Campaign = {
        id: c.id,
        businessId: "1",
        businessName: prev.businessProfile.name,
        businessImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        title: c.title,
        description: c.description || "Newly launched campaign.",
        type: (c.type as Campaign["type"]) || "open",
        commission: c.commission,
        deadline: c.endDate || "Ongoing",
        slots: 50,
        slotsUsed: 0,
        tags: ["new"],
        city: prev.businessProfile.city,
      };
      return {
        ...prev,
        bizCampaigns: [c, ...prev.bizCampaigns],
        customCampaigns: [creatorCampaign, ...prev.customCampaigns],
      };
    });
  }, []);

  const updateBizCampaign = useCallback((id: string, patch: Partial<BizCampaign>) => {
    setState((prev) => ({
      ...prev,
      bizCampaigns: prev.bizCampaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteBizCampaign = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bizCampaigns: prev.bizCampaigns.filter((c) => c.id !== id),
      customCampaigns: prev.customCampaigns.filter((c) => c.id !== id),
    }));
  }, []);

  // Derived: badges based on real milestones
  const badges = useMemo(() => {
    const totalLinks = state.affiliateLinks.length;
    const totalEarned = state.affiliateLinks.reduce((s, l) => s + l.earned, 0) + state.balance.totalEarned;
    const totalConvs = state.affiliateLinks.reduce((s, l) => s + l.conversions, 0);
    const cities = new Set<string>();
    return [
      { emoji: "🔗", name: "First Link", desc: "Generate 1 link", earned: totalLinks >= 1 },
      { emoji: "⭐", name: "Top Promoter", desc: "10+ links", earned: totalLinks >= 10 },
      { emoji: "🎯", name: "Closer", desc: "10 conversions", earned: totalConvs >= 10 },
      { emoji: "💎", name: "Diamond Earner", desc: "$1K earned", earned: totalEarned >= 1000 },
      { emoji: "🏆", name: "5K Club", desc: "$5K earned", earned: totalEarned >= 5000 },
      { emoji: "🌍", name: "Global Reach", desc: "3 cities", earned: cities.size >= 3 },
    ];
  }, [state.affiliateLinks, state.balance.totalEarned]);

  const allCampaigns = useMemo(
    () => [...state.customCampaigns, ...sampleCampaigns],
    [state.customCampaigns]
  );

  const referralEarnings = useMemo(
    () => state.referrals.reduce((s, r) => s + r.earned, 0),
    [state.referrals]
  );

  return (
    <AffiliateContext.Provider
      value={{
        affiliateLinks: state.affiliateLinks,
        joinedCampaigns: state.joinedCampaigns,
        balance: state.balance,
        transactions: state.transactions,
        paymentMethods: state.paymentMethods,
        creatorProfile: state.creatorProfile,
        businessProfile: state.businessProfile,
        bizCampaigns: state.bizCampaigns,
        allCampaigns,
        activity: state.activity,
        badges,
        setCreatorProfile,
        setBusinessProfile,
        addBizCampaign,
        updateBizCampaign,
        deleteBizCampaign,
        generateLink,
        joinCampaign,
        isCampaignJoined,
        requestWithdrawal,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        updateLinkCode,
        confirmWithdrawal,
        cancelWithdrawal,
        referralCode: state.referralCode,
        referrals: state.referrals,
        referralEarnings,
        simulateReferralSignup,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
}

export function useAffiliate() {
  const ctx = useContext(AffiliateContext);
  if (!ctx) throw new Error("useAffiliate must be used within AffiliateProvider");
  return ctx;
}
