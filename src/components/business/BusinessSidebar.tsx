import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAffiliate } from "@/contexts/AffiliateContext";

const navItems = [
  { key: "overview", label: "Overview", emoji: "📊" },
  { key: "campaigns", label: "Campaigns", emoji: "📢" },
  { key: "affiliates", label: "Affiliates", emoji: "👥" },
  { key: "applicants", label: "Applicants", emoji: "📋" },
  { key: "giftcards", label: "Gift Cards", emoji: "🎁" },
  { key: "analytics", label: "Analytics", emoji: "📈" },
  { key: "payouts", label: "Payouts", emoji: "💸" },
  { key: "activity", label: "Activity", emoji: "⚡" },
  { key: "referrals", label: "Referrals", emoji: "🔗" },
  { key: "profile", label: "Profile", emoji: "✏️" },
  { key: "settings", label: "Settings", emoji: "⚙️" },
];

interface BusinessSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const BusinessSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }: BusinessSidebarProps) => {
  const { businessProfile } = useAffiliate();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 z-30",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm truncate">{businessProfile.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{businessProfile.category} · {businessProfile.city}</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === item.key
                  ? "bg-primary text-primary-foreground shadow-mint"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-base flex-shrink-0">{item.emoji}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{businessProfile.logo}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold truncate">TribeMint Business</p>
                <p className="text-[10px] text-muted-foreground">Powered by Ibloov</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="flex overflow-x-auto px-2 py-1.5 gap-0.5">
          {navItems.slice(0, 7).map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                "flex flex-col items-center min-w-[56px] px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors",
                activeTab === item.key
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <span className="text-base mb-0.5">{item.emoji}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const moreItems = navItems.slice(7);
              const next = moreItems.find(i => i.key !== activeTab) || moreItems[0];
              onTabChange(activeTab === "more" ? "settings" : "more");
            }}
            className={cn(
              "flex flex-col items-center min-w-[56px] px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors",
              navItems.slice(7).some(i => i.key === activeTab)
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            )}
          >
            <span className="text-base mb-0.5">•••</span>
            <span>More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BusinessSidebar;