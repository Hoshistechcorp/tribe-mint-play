import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Store, Check, ChevronDown, Plus } from "lucide-react";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";

type Role = "creator" | "business";

const META: Record<Role, { label: string; sub: string; icon: typeof Megaphone; route: string }> = {
  creator: { label: "Creator", sub: "Share & earn", icon: Megaphone, route: "/dashboard" },
  business: { label: "Business", sub: "Get affiliates", icon: Store, route: "/business-dashboard" },
};

const RoleSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const navigate = useNavigate();
  const { activeRole, accountsEnabled, setActiveRole } = useAffiliate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const Active = META[activeRole].icon;

  const switchTo = (r: Role) => {
    if (!accountsEnabled[r]) {
      navigate(`/onboarding?role=${r}`);
      return;
    }
    setActiveRole(r);
    toast({ title: `Switched to ${META[r].label}`, description: `You're now viewing your ${META[r].label.toLowerCase()} account.` });
    setOpen(false);
    navigate(META[r].route);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
        aria-label="Switch account"
      >
        <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
          <Active size={16} strokeWidth={2} />
        </span>
        {!compact && (
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Account</span>
            <span className="text-xs font-bold">{META[activeRole].label}</span>
          </span>
        )}
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-card p-2 z-50">
          <p className="px-2 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Switch account</p>
          {(["creator", "business"] as Role[]).map((r) => {
            const m = META[r];
            const Icon = m.icon;
            const isActive = r === activeRole;
            const isEnabled = accountsEnabled[r];
            return (
              <button
                key={r}
                onClick={() => switchTo(r)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                  isActive ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-primary/20 text-primary" : "bg-muted text-foreground"}`}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold leading-tight">{m.label}</span>
                  <span className="block text-[11px] text-muted-foreground">{isEnabled ? m.sub : "Not set up yet"}</span>
                </span>
                {isActive ? (
                  <Check size={16} className="text-primary" />
                ) : !isEnabled ? (
                  <Plus size={16} className="text-muted-foreground" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;