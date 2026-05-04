import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

const statusColors: Record<string, string> = {
  active: "bg-primary/15 text-primary",
  redeemed: "bg-muted text-muted-foreground",
  expired: "bg-destructive/15 text-destructive",
};

const cardGradients = [
  "from-emerald-600 to-emerald-800",
  "from-amber-600 to-amber-800",
  "from-purple-600 to-purple-800",
  "from-rose-600 to-rose-800",
  "from-blue-600 to-blue-800",
];

const MyGiftCards = () => {
  const navigate = useNavigate();
  const { purchasedGiftCards } = useAffiliate();

  const active = purchasedGiftCards.filter((c) => c.status === "active");
  const used = purchasedGiftCards.filter((c) => c.status !== "active");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 container max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold font-heading">My Gift Cards 🎁</h1>
              <p className="text-sm text-muted-foreground">{purchasedGiftCards.length} cards purchased</p>
            </div>
            <button onClick={() => navigate("/search")}
              className="px-4 py-2 bg-gradient-mint text-primary-foreground rounded-lg font-bold text-sm shadow-mint hover:opacity-90 transition-opacity">
              ＋ Buy another
            </button>
          </div>

          {purchasedGiftCards.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 space-y-4">
              <span className="text-6xl block">🎁</span>
              <h2 className="text-xl font-bold font-heading">No gift cards yet</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Browse businesses and buy gift cards for friends, family, or yourself.
              </p>
              <button onClick={() => navigate("/search")}
                className="px-6 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm shadow-mint hover:opacity-90 transition-opacity">
                Browse Businesses →
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {active.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active ({active.length})</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {active.map((card, i) => (
                      <motion.div key={card.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl bg-gradient-card border border-border shadow-card overflow-hidden">
                        <div className={`p-5 bg-gradient-to-br ${cardGradients[i % cardGradients.length]} text-white relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Ibloov Gift Card</p>
                          <p className="text-2xl font-extrabold font-heading mt-1">${card.faceValue}</p>
                          <p className="font-mono text-xs tracking-widest text-white/70 mt-2">{card.code}</p>
                          <p className="text-[10px] text-white/50 mt-1">{card.businessName}</p>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">To: {card.recipientName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[card.status]}`}>
                              {card.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Balance: ${card.remainingBalance}</span>
                            <span>Exp: {card.expiresAt}</span>
                          </div>
                          <button onClick={() => {
                            navigator.clipboard.writeText(card.code);
                            toast({ title: "Code copied! 📋", description: card.code });
                          }}
                            className="w-full mt-2 py-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold transition-colors">
                            📋 Copy Code
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {used.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Used / Expired ({used.length})</h2>
                  <div className="space-y-2">
                    {used.map((card) => (
                      <div key={card.id} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">${card.faceValue} — {card.businessName}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[card.status]}`}>
                              {card.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">To: {card.recipientName} · {card.purchasedAt}</p>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">{card.code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default MyGiftCards;