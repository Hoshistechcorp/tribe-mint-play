import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Wand2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAffiliate } from "@/contexts/AffiliateContext";

interface Props {
  open: boolean;
  onClose: () => void;
  linkId: string;
  currentCode: string;
}

const VanityCodeEditor = ({ open, onClose, linkId, currentCode }: Props) => {
  const { updateLinkCode, isCodeAvailable } = useAffiliate();
  const [value, setValue] = useState(currentCode);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const valid = cleaned.length >= 3 && cleaned.length <= 30;
  const previewUrl = `tribemint.link/${cleaned || "..."}`;
  const isSameAsCurrent = cleaned === currentCode;

  // Debounced live availability check
  useEffect(() => {
    if (!valid || isSameAsCurrent) {
      setAvailable(null);
      setChecking(false);
      return;
    }
    setChecking(true);
    setAvailable(null);
    const t = setTimeout(() => {
      setAvailable(isCodeAvailable(cleaned, linkId));
      setChecking(false);
    }, 450);
    return () => clearTimeout(t);
  }, [cleaned, valid, isSameAsCurrent, isCodeAvailable, linkId]);

  const handleSave = () => {
    if (!valid) {
      toast({ title: "❌ Invalid code", description: "Use 3–30 letters, numbers or dashes." });
      return;
    }
    if (available === false) {
      toast({ title: "❌ Code already taken", description: "Try a different one." });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const ok = updateLinkCode(linkId, cleaned);
      setSaving(false);
      if (ok) {
        toast({ title: "✨ Vanity code updated!", description: `Your link is now ${previewUrl}` });
        onClose();
      } else {
        toast({ title: "❌ Code already taken", description: "Try a different one." });
        setAvailable(false);
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !saving && onClose()}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" /> Edit Vanity Code
              </h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Promo Code</label>
              <div className="flex items-center rounded-xl bg-muted overflow-hidden">
                <span className="px-3 py-3 text-xs text-muted-foreground font-mono">tribemint.link/</span>
                <input
                  autoFocus value={value} onChange={(e) => setValue(e.target.value)}
                  placeholder="my-code"
                  className="flex-1 py-3 pr-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">3–30 chars · letters, numbers, dashes</p>
              {/* Live availability status */}
              <div className="mt-2 min-h-[20px] text-xs flex items-center gap-1.5">
                {!valid && cleaned.length > 0 && (
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Too short
                  </span>
                )}
                {valid && isSameAsCurrent && (
                  <span className="text-muted-foreground">This is your current code</span>
                )}
                {valid && !isSameAsCurrent && checking && (
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking availability...
                  </span>
                )}
                {valid && !isSameAsCurrent && !checking && available === true && (
                  <span className="text-primary font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Available ✨
                  </span>
                )}
                {valid && !isSameAsCurrent && !checking && available === false && (
                  <span className="text-destructive font-semibold flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5" /> Already taken
                  </span>
                )}
              </div>
            </div>

            <motion.div key={cleaned} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-gradient-card border border-primary/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Live Preview</p>
              <p className="font-mono text-sm font-bold text-primary truncate">{previewUrl}</p>
            </motion.div>

            <div className="flex gap-3">
              <button onClick={onClose} disabled={saving}
                className="flex-1 px-4 py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !valid || isSameAsCurrent || checking || available === false}
                className="flex-1 px-4 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VanityCodeEditor;
