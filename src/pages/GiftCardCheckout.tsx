import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sampleBusinesses } from "@/data/sampleBusinesses";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { toast } from "@/hooks/use-toast";
import { fireConfetti } from "@/lib/confetti";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

type Step = "select" | "checkout" | "processing" | "confirmed";

const GiftCardCheckout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { purchaseGiftCard, giftCardProgram } = useAffiliate();

  const businessId = params.get("business") || "1";
  const preselected = params.get("amount") ? Number(params.get("amount")) : null;
  const refCode = params.get("ref") || undefined;

  const business = sampleBusinesses.find((b) => b.id === businessId);
  const denominations = giftCardProgram.enrolled
    ? giftCardProgram.denominations
    : [25, 50, 100, 200];
  const discountPct = giftCardProgram.enrolled
    ? giftCardProgram.redemptionDiscountPercent
    : 10;

  const [step, setStep] = useState<Step>("select");
  const [selectedAmount, setSelectedAmount] = useState<number>(preselected || denominations[0]);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [purchasedCard, setPurchasedCard] = useState<{ code: string; amount: number } | null>(null);

  const buyerPays = +(selectedAmount * (1 - discountPct / 100)).toFixed(2);
  const savings = +(selectedAmount - buyerPays).toFixed(2);

  const handleProceedToCheckout = () => {
    if (!recipientEmail.trim() || !recipientName.trim()) {
      toast({ title: "Please fill in recipient details", variant: "destructive" });
      return;
    }
    setStep("checkout");
  };

  const handlePayment = () => {
    setStep("processing");
    // Simulate Stripe processing
    setTimeout(() => {
      const card = purchaseGiftCard({
        businessId,
        businessName: business?.name || "Business",
        faceValue: selectedAmount,
        buyerPaid: buyerPays,
        recipientName,
        recipientEmail,
        senderName: senderName || "Anonymous",
        personalMessage,
        refCode,
      });
      setPurchasedCard({ code: card.code, amount: selectedAmount });
      setStep("confirmed");
      fireConfetti();
    }, 2500);
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Business not found</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12 container max-w-2xl">
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-8">
            {["Select", "Checkout", "Confirmation"].map((label, i) => {
              const stepIdx = step === "select" ? 0 : step === "checkout" ? 1 : 2;
              return (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors ${i <= stepIdx ? "bg-primary" : "bg-muted"}`} />
                  <p className={`text-[10px] mt-1 font-medium ${i <= stepIdx ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Select gift card */}
            {step === "select" && (
              <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex items-center gap-4">
                  <img src={business.image} alt={business.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h1 className="text-xl font-bold font-heading">Buy a Gift Card</h1>
                    <p className="text-sm text-muted-foreground">{business.name} · {business.city}</p>
                  </div>
                </div>

                {/* Denomination picker */}
                <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-4">
                  <h2 className="font-bold text-sm">Choose amount</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {denominations.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedAmount(d)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          selectedAmount === d
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="text-lg font-bold font-heading">${d}</p>
                        {discountPct > 0 && (
                          <p className="text-[10px] text-primary font-bold mt-0.5">
                            Pay ${(d * (1 - discountPct / 100)).toFixed(2)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                  {discountPct > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
                      <span>🎉</span>
                      <p className="text-xs text-primary font-bold">
                        You save ${savings.toFixed(2)} ({discountPct}% off) on this card!
                      </p>
                    </div>
                  )}
                </div>

                {/* Recipient details */}
                <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-4">
                  <h2 className="font-bold text-sm">Recipient details</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Recipient name *</label>
                      <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Recipient email *</label>
                      <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Your name (optional)</label>
                    <input value={senderName} onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name"
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Personal message (optional)</label>
                    <textarea value={personalMessage} onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Happy birthday! Enjoy dinner on me 🎂"
                      rows={2}
                      className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  </div>
                </div>

                {/* Order summary */}
                <div className="p-5 rounded-2xl bg-gradient-card border border-border shadow-card space-y-3">
                  <h2 className="font-bold text-sm">Order summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Gift card value</span><span className="font-bold">${selectedAmount}</span></div>
                    {discountPct > 0 && (
                      <div className="flex justify-between text-primary"><span>Discount ({discountPct}%)</span><span className="font-bold">-${savings.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border text-base"><span className="font-bold">Total</span><span className="font-bold text-primary">${buyerPays}</span></div>
                  </div>
                </div>

                <button onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-gradient-mint text-primary-foreground rounded-xl font-extrabold text-sm shadow-mint hover:opacity-90 transition-opacity">
                  Proceed to Payment →
                </button>
              </motion.div>
            )}

            {/* STEP 2: Simulated Stripe Checkout */}
            {step === "checkout" && (
              <motion.div key="checkout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <button onClick={() => setStep("select")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  ← Back
                </button>

                <div className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card space-y-5">
                  {/* Stripe-like header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ibloov Gift Card</p>
                      <p className="text-lg font-bold font-heading">{business.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-heading text-primary">${buyerPays}</p>
                      {discountPct > 0 && <p className="text-xs text-muted-foreground line-through">${selectedAmount}</p>}
                    </div>
                  </div>

                  {/* Payment form */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">💳</span>
                      <p className="font-bold text-sm">Payment details</p>
                      <span className="ml-auto px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground">🔒 Secure</span>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Card number</label>
                      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground font-medium">Expiry</label>
                        <input value={expiry} onChange={(e) => setExpiry(e.target.value)}
                          className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground font-medium">CVC</label>
                        <input value={cvc} onChange={(e) => setCvc(e.target.value)}
                          className="w-full mt-1 px-3 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                  </div>

                  {/* Summary line items */}
                  <div className="space-y-2 pt-4 border-t border-border text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>To: {recipientName}</span><span>{recipientEmail}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">${selectedAmount} Gift Card</span><span className="font-bold">${buyerPays}</span></div>
                  </div>

                  <button onClick={handlePayment}
                    className="w-full py-4 bg-gradient-mint text-primary-foreground rounded-xl font-extrabold text-sm shadow-mint hover:opacity-90 transition-opacity">
                    💳 Pay ${buyerPays}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground">
                    Powered by Stripe · Secure payment processing
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2.5: Processing */}
            {step === "processing" && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
                />
                <div className="text-center space-y-2">
                  <p className="font-bold font-heading text-lg">Processing payment...</p>
                  <p className="text-sm text-muted-foreground">Verifying with Stripe and generating your gift card</p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground text-center">
                  <ProcessingStep label="Sending payment to Stripe" delay={0} />
                  <ProcessingStep label="Validating payment" delay={800} />
                  <ProcessingStep label="Generating gift card code" delay={1600} />
                  <ProcessingStep label="Sending to recipient's email" delay={2200} />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirmation */}
            {step === "confirmed" && purchasedCard && (
              <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center space-y-3">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <span className="text-6xl block">🎉</span>
                  </motion.div>
                  <h1 className="text-2xl font-bold font-heading">Gift Card Sent!</h1>
                  <p className="text-sm text-muted-foreground">
                    A ${purchasedCard.amount} gift card for {business.name} has been sent to {recipientEmail}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card space-y-4">
                  {/* Virtual card display */}
                  <div className={`relative rounded-xl p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Ibloov Gift Card</p>
                    <p className="text-2xl font-extrabold font-heading mb-4">${purchasedCard.amount}</p>
                    <p className="font-mono text-sm tracking-widest text-white/80">{purchasedCard.code}</p>
                    <p className="text-xs text-white/50 mt-2">Redeemable at {business.name}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Recipient</span><span className="font-bold">{recipientName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{recipientEmail}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Amount paid</span><span className="font-bold text-primary">${buyerPays}</span></div>
                    {senderName && <div className="flex justify-between"><span className="text-muted-foreground">From</span><span>{senderName}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-primary font-bold">✅ Confirmed</span></div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/15 text-xs text-muted-foreground flex items-start gap-2">
                    <span>📧</span>
                    <div>
                      <p className="font-bold text-foreground">Confirmation emails sent</p>
                      <p>A gift card with the code has been emailed to {recipientEmail}. A receipt has been sent to you.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate(`/business/${businessId}`)}
                    className="flex-1 py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-colors">
                    ← Back to {business.name}
                  </button>
                  <button onClick={() => navigate("/my-gift-cards")}
                    className="flex-1 py-3 bg-gradient-mint text-primary-foreground rounded-xl font-bold text-sm shadow-mint hover:opacity-90 transition-opacity">
                    🎁 View My Gift Cards
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

const ProcessingStep = ({ label, delay }: { label: string; delay: number }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;
  return (
    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 justify-center">
      <span className="text-primary">✓</span> {label}
    </motion.p>
  );
};

export default GiftCardCheckout;