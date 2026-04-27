import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, Clock, Link2, ArrowRight } from "lucide-react";
import { sampleCampaigns, type Campaign } from "@/data/sampleCampaigns";

const filters = [
  { label: "All", value: "all", emoji: "🌐" },
  { label: "Open", value: "open", emoji: "🟢" },
  { label: "Featured", value: "featured", emoji: "⭐" },
  { label: "Exclusive", value: "exclusive", emoji: "🔒" },
];

const typeBadge: Record<Campaign["type"], { bg: string; text: string; label: string }> = {
  open: { bg: "bg-primary/15", text: "text-primary", label: "🟢 Open" },
  featured: { bg: "bg-secondary/15", text: "text-secondary", label: "⭐ Featured" },
  exclusive: { bg: "bg-accent/15", text: "text-accent", label: "🔒 Exclusive" },
};

const CampaignsPreview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    const list = activeTab === "all" ? sampleCampaigns : sampleCampaigns.filter((c) => c.type === activeTab);
    return list.slice(0, 6);
  }, [activeTab]);

  return (
    <section id="campaigns" className="py-12 sm:py-20 bg-background">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Live now</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading mt-1.5">
              Browse <span className="font-display italic">campaigns</span> 🎯
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
              Pick a brand, grab your link, start earning. No applications, no waiting.
            </p>
          </div>
          <button
            onClick={() => navigate("/campaigns")}
            className="self-start sm:self-end inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {filters.map((tab) => {
            const count = tab.value === "all" ? sampleCampaigns.length : sampleCampaigns.filter((c) => c.type === tab.value).length;
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "bg-military text-lime border border-military"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((campaign, i) => {
            const badge = typeBadge[campaign.type];
            const slotsLeft = campaign.slots - campaign.slotsUsed;
            const progress = (campaign.slotsUsed / campaign.slots) * 100;

            return (
              <motion.button
                key={campaign.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/campaigns")}
                className="text-left rounded-2xl border border-border bg-card shadow-card overflow-hidden group"
              >
                <div className="relative h-32 sm:h-36 overflow-hidden">
                  <img
                    src={campaign.businessImage}
                    alt={campaign.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-card/90 backdrop-blur-sm text-[10px] font-bold text-primary">
                    {campaign.commission}%
                  </span>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold font-heading text-sm leading-tight">{campaign.title}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {campaign.businessName} · {campaign.city}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {slotsLeft} left</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {campaign.deadline}</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-mint rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground">
                      #{campaign.tags[0]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link2 className="w-3.5 h-3.5" /> Get link
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/campaigns")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-military text-lime font-bold text-sm hover:opacity-90 transition-opacity"
          >
            See all campaigns <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CampaignsPreview;