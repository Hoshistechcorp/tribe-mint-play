import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fireConfetti } from "@/lib/confetti";

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (campaign: any) => void;
}

const campaignTypes = [
  { value: "open", label: "🟢 Open", desc: "Anyone can join" },
  { value: "featured", label: "⭐ Featured", desc: "Open to all · You approve applicants" },
  { value: "exclusive", label: "🔒 Exclusive", desc: "Invite-only affiliates" },
];

const CreateCampaignModal = ({ open, onClose, onCreated }: CreateCampaignModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [commission, setCommission] = useState("15");
  const [type, setType] = useState("open");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  // Manager offer & payout levers
  const [discountPercent, setDiscountPercent] = useState(10);
  const [discountBudget, setDiscountBudget] = useState("500");
  const [cpcRate, setCpcRate] = useState("0.05");
  const [clickBudget, setClickBudget] = useState("100");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({ title: "Campaign name is required", variant: "destructive" });
      return;
    }
    if (!budget || Number(budget) <= 0) {
      toast({ title: "Please set a valid budget", variant: "destructive" });
      return;
    }

    const newCampaign = {
      id: String(Date.now()),
      title,
      description,
      status: "active",
      affiliates: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: Number(commission),
      budget: `$${Number(budget).toLocaleString()}`,
      type,
      startDate: startDate ? format(startDate, "MMM d, yyyy") : "Today",
      endDate: endDate ? format(endDate, "MMM d, yyyy") : "Ongoing",
      discountPercent,
      discountBudget: Number(discountBudget) || 0,
      cpcRate: Number(cpcRate) || 0,
      clickBudget: Number(clickBudget) || 0,
    };

    onCreated(newCampaign);
    fireConfetti();
    toast({ title: "Campaign Created! 🎉", description: `"${title}" is now live.` });
    
    // Reset
    setTitle("");
    setDescription("");
    setBudget("");
    setCommission("15");
    setType("open");
    setStartDate(undefined);
    setEndDate(undefined);
    setDiscountPercent(10);
    setDiscountBudget("500");
    setCpcRate("0.05");
    setClickBudget("100");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold font-heading">Create Campaign 📢</h2>
              <button onClick={onClose} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  🏷️ Campaign Name
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Brunch Push 🥂"
                  maxLength={80}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  📄 Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what affiliates should promote..."
                  rows={3}
                  maxLength={500}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-2 block">Campaign Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {campaignTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        type === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <p className="text-sm font-bold">{t.label}</p>
                      <p className="text-[10px] mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget & Commission */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    💲 Budget
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    min={0}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    ％ Commission %
                  </label>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    min={1}
                    max={50}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "w-full px-3 py-2.5 rounded-lg border border-border text-sm text-left flex items-center gap-2",
                        !startDate && "text-muted-foreground"
                      )}>
                        📅
                        {startDate ? format(startDate, "MMM d, yyyy") : "Pick date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn(
                        "w-full px-3 py-2.5 rounded-lg border border-border text-sm text-left flex items-center gap-2",
                        !endDate && "text-muted-foreground"
                      )}>
                        📅
                        {endDate ? format(endDate, "MMM d, yyyy") : "Pick date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Offer & Payouts */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-primary">🏷️</span>
                  <h3 className="text-sm font-bold font-heading">Offer & Payouts</h3>
                </div>

                {/* Discount slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-muted-foreground font-medium">Audience discount</label>
                    <span className="text-xs font-bold text-primary">{discountPercent}% OFF</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Buyer sees: <span className="line-through">$50</span>{" "}
                    <span className="font-bold text-foreground">${(50 * (1 - discountPercent / 100)).toFixed(2)}</span>
                  </p>
                </div>

                {/* Discount budget */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    💲 Discount budget cap
                  </label>
                  <input
                    type="number"
                    value={discountBudget}
                    onChange={(e) => setDiscountBudget(e.target.value)}
                    min={0}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {discountPercent > 0 && Number(discountBudget) > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Covers ~{Math.floor(Number(discountBudget) / (50 * discountPercent / 100))} redemptions of a $50 ticket
                    </p>
                  )}
                </div>

                {/* CPC + click budget */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      🖱️ Pay per click
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cpcRate}
                      onChange={(e) => setCpcRate(e.target.value)}
                      min={0}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      💲 Click budget cap
                    </label>
                    <input
                      type="number"
                      value={clickBudget}
                      onChange={(e) => setClickBudget(e.target.value)}
                      min={0}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {Number(cpcRate) > 0 && Number(clickBudget) > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        ~{Math.floor(Number(clickBudget) / Number(cpcRate)).toLocaleString()} clicks
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-mint"
              >
                Launch Campaign 🚀
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCampaignModal;
