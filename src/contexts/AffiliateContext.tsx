import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Business } from "@/data/sampleBusinesses";
import { type Campaign } from "@/data/sampleCampaigns";

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
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank" | "paystack" | "flexit";
  isDefault: boolean;
}

interface Balance {
  available: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
}

interface AffiliateContextType {
  affiliateLinks: AffiliateLink[];
  joinedCampaigns: string[];
  balance: Balance;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  generateLink: (business: Business) => AffiliateLink;
  joinCampaign: (campaign: Campaign) => void;
  isCampaignJoined: (campaignId: string) => boolean;
  requestWithdrawal: (amount: number, methodId: string) => boolean;
  addPaymentMethod: (name: string, type: PaymentMethod["type"]) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

const AffiliateContext = createContext<AffiliateContextType | null>(null);

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
  { id: "t7", type: "earning", amount: 5.6, source: "Bamboo Kitchen", date: "Mar 3", status: "pending" },
  { id: "t8", type: "earning", amount: 18.0, source: "Skyline Suites", date: "Mar 2", status: "completed" },
  { id: "t9", type: "withdrawal", amount: -100.0, source: "Bank Transfer", date: "Mar 1", status: "failed" },
  { id: "t10", type: "earning", amount: 33.0, source: "Coral Bay Resort", date: "Feb 28", status: "completed" },
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: "pm1", name: "GTBank ****4521", type: "bank", isDefault: true },
  { id: "pm2", name: "Paystack Wallet", type: "paystack", isDefault: false },
  { id: "pm3", name: "Flex-it", type: "flexit", isDefault: false },
];

export function AffiliateProvider({ children }: { children: ReactNode }) {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(initialLinks);
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);
  const [balance, setBalance] = useState<Balance>({
    available: 845.0,
    pending: 312.5,
    totalEarned: 4250.0,
    totalWithdrawn: 3092.5,
  });
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);

  // Simulate live click tracking - random increments every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAffiliateLinks((prev) =>
        prev.map((link) => {
          if (!link.active) return link;
          const clickBump = Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0;
          const convBump = clickBump > 2 && Math.random() > 0.7 ? 1 : 0;
          const earnBump = convBump * (Math.random() * 3 + 0.5);
          if (clickBump === 0) return link;
          return {
            ...link,
            clicks: link.clicks + clickBump,
            conversions: link.conversions + convBump,
            earned: +(link.earned + earnBump).toFixed(2),
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const generateLink = useCallback((business: Business): AffiliateLink => {
    const existing = affiliateLinks.find((l) => l.businessId === business.id);
    if (existing) return existing;

    const newLink: AffiliateLink = {
      id: `l${Date.now()}`,
      businessId: business.id,
      businessName: business.name,
      code: business.name.toLowerCase().replace(/\s+/g, "-"),
      clicks: 0,
      conversions: 0,
      earned: 0,
      active: true,
      createdAt: "Today",
    };
    setAffiliateLinks((prev) => [newLink, ...prev]);
    return newLink;
  }, [affiliateLinks]);

  const joinCampaign = useCallback((campaign: Campaign) => {
    if (joinedCampaigns.includes(campaign.id)) return;
    setJoinedCampaigns((prev) => [...prev, campaign.id]);
    // Also generate a link for this business if not already
    const existing = affiliateLinks.find((l) => l.businessId === campaign.businessId);
    if (!existing) {
      const newLink: AffiliateLink = {
        id: `l${Date.now()}`,
        businessId: campaign.businessId,
        businessName: campaign.businessName,
        code: campaign.businessName.toLowerCase().replace(/\s+/g, "-"),
        clicks: 0,
        conversions: 0,
        earned: 0,
        active: true,
        createdAt: "Today",
      };
      setAffiliateLinks((prev) => [newLink, ...prev]);
    }
  }, [joinedCampaigns, affiliateLinks]);

  const isCampaignJoined = useCallback((campaignId: string) => {
    return joinedCampaigns.includes(campaignId);
  }, [joinedCampaigns]);

  const requestWithdrawal = useCallback((amount: number, methodId: string): boolean => {
    if (amount < 5 || amount > balance.available) return false;
    const method = paymentMethods.find((m) => m.id === methodId);
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: "withdrawal",
      amount: -amount,
      source: method?.name || "Bank Transfer",
      date: "Just now",
      status: "pending",
    };
    setTransactions((prev) => [newTx, ...prev]);
    setBalance((prev) => ({
      ...prev,
      available: +(prev.available - amount).toFixed(2),
      totalWithdrawn: +(prev.totalWithdrawn + amount).toFixed(2),
    }));
    return true;
  }, [balance.available, paymentMethods]);

  const addPaymentMethod = useCallback((name: string, type: PaymentMethod["type"]) => {
    const newMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      name,
      type,
      isDefault: false,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  }, []);

  return (
    <AffiliateContext.Provider
      value={{
        affiliateLinks,
        joinedCampaigns,
        balance,
        transactions,
        paymentMethods,
        generateLink,
        joinCampaign,
        isCampaignJoined,
        requestWithdrawal,
        addPaymentMethod,
        setDefaultPaymentMethod,
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
