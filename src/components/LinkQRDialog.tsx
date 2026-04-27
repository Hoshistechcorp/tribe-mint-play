import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "@/hooks/use-toast";
import { useAffiliate } from "@/contexts/AffiliateContext";

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
  label: string;
  businessId?: string;
  code?: string;
}

const LinkQRDialog = ({ open, onClose, url, label, businessId, code }: Props) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { getDiscountForBusiness } = useAffiliate();
  const offer = businessId ? getDiscountForBusiness(businessId) : null;

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(url, { width: 512, margin: 2, color: { dark: "#0f1f0f", light: "#ffffff" } })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [url, open]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `tribemint-qr-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    a.click();
    toast({ title: "📥 QR downloaded!", description: "Print it and share anywhere." });
  };

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">QR Code 📱</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">{label}</p>
            {offer && offer.discountPercent > 0 && !offer.paused && (
              <div className="rounded-xl bg-accent/10 border border-accent/30 px-3 py-2 text-xs">
                <span className="font-bold text-accent">🎁 Your audience saves {offer.discountPercent}%</span>
                {code && <span className="text-muted-foreground"> with code <span className="font-mono font-bold text-foreground">{code}</span></span>}
              </div>
            )}

            <div className="rounded-2xl bg-white p-4 flex items-center justify-center aspect-square">
              {dataUrl ? (
                <img src={dataUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-muted/30 rounded animate-pulse" />
              )}
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50">
              <p className="flex-1 text-xs font-mono truncate text-muted-foreground">{url}</p>
              <button onClick={copy} className="p-1.5 rounded-lg hover:bg-muted">
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button onClick={download} disabled={!dataUrl}
              className="w-full px-4 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-mint flex items-center justify-center gap-2 disabled:opacity-50">
              <Download className="w-4 h-4" /> Download Printable QR
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LinkQRDialog;
