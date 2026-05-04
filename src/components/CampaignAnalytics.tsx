import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAffiliate } from "@/contexts/AffiliateContext";

const CampaignAnalytics = () => {
  const navigate = useNavigate();
  const { joinedCampaigns, allCampaigns, affiliateLinks } = useAffiliate();

  const rows = useMemo(() => {
    return joinedCampaigns
      .map((id) => {
        const c = allCampaigns.find((x) => x.id === id);
        if (!c) return null;
        const link = affiliateLinks.find((l) => l.businessId === c.businessId);
        return {
          id: c.id,
          title: c.title,
          businessName: c.businessName,
          commission: c.commission,
          clicks: link?.clicks || 0,
          conversions: link?.conversions || 0,
          earned: link?.earned || 0,
          cvr: link && link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
        };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
  }, [joinedCampaigns, allCampaigns, affiliateLinks]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Campaign Analytics 📊</h2>
        <button onClick={() => navigate("/campaigns")} className="text-sm text-primary font-medium hover:underline">
          + Join more
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 rounded-2xl border border-border bg-gradient-card text-center">
          <span className="text-4xl block mx-auto mb-3">🎯</span>
          <p className="text-muted-foreground text-sm mb-4">You haven't joined any campaigns yet.</p>
          <button onClick={() => navigate("/campaigns")}
            className="px-6 py-2.5 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm">
            Browse Campaigns
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gradient-card border border-border shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm font-heading truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.businessName} · {r.commission}% commission</p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-md bg-primary/10 text-primary font-bold whitespace-nowrap">
                  CVR {r.cvr.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[10px]">🖱️</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Clicks</span>
                  </div>
                  <p className="font-bold font-heading text-sm">{r.clicks.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[10px]">👥</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Conv.</span>
                  </div>
                  <p className="font-bold font-heading text-sm">{r.conversions}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[10px]">💲</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Earned</span>
                  </div>
                  <p className="font-bold font-heading text-sm text-primary">${r.earned.toFixed(2)}</p>
                </div>
              </div>
              {/* Progress bar relative to top performer */}
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (r.earned / Math.max(...rows.map(x => x.earned), 1)) * 100)}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-gradient-mint" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignAnalytics;
