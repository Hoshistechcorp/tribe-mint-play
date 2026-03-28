import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-24 pb-16">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy + CTAs */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-background text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Powered by AuraLink
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] font-heading text-foreground"
            >
              Share a link.
              <br />
              Earn{" "}
              <span className="relative inline-block">
                <span className="font-display italic text-foreground">real money.</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-lime/30 rounded-full -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Promote restaurants, hotels, events, and gift cards to your audience. Earn commissions on every booking, every sale, every click.{" "}
              <span className="font-semibold text-foreground">
                500 followers or 500K — your earnings are based on impact, not reach.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/onboarding")}
                className="px-10 py-5 font-extrabold bg-military text-lime rounded-full text-base hover:opacity-90 transition-opacity shadow-mint"
              >
                Start Earning Free →
              </button>
              <button
                onClick={() => navigate("/business-dashboard")}
                className="px-10 py-5 font-extrabold bg-background text-foreground rounded-full text-base border-2 border-border hover:border-foreground transition-colors"
              >
                I'm a Business →
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-start gap-10 pt-4"
            >
              <div>
                <p className="text-3xl font-heading font-extrabold text-foreground">10-15%</p>
                <p className="text-sm text-muted-foreground mt-1">Commission per sale</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-extrabold text-foreground font-display italic">24hr</p>
                <p className="text-sm text-muted-foreground mt-1">Payouts via Flex-it</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-extrabold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground mt-1">Creator target by 2028</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Creator Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden lg:block relative"
          >
            {/* Main card */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-card max-w-md mx-auto">
              {/* Profile */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-lime/20 border-4 border-lime flex items-center justify-center text-4xl mb-3">
                  🧕
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground">Ada Osei</h3>
                <p className="text-sm text-muted-foreground">@adaeats · Lagos & Atlanta</p>
                <span className="mt-2 px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-xs font-bold text-foreground">
                  🌿 Grower · Base + 5%
                </span>
              </div>

              {/* Earnings card */}
              <div className="bg-muted/50 rounded-2xl p-5 mb-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">This Month's Earnings</p>
                <p className="text-4xl font-display italic text-foreground">$2,847</p>
                <p className="text-sm font-semibold text-lime mt-1">↑ 34% vs last month</p>
              </div>

              {/* Active campaigns */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Active Campaigns</p>
                <div className="space-y-3">
                  {[
                    { name: "Bacchanalia ATL", rate: "12% on gift cards", earned: "$640", emoji: "🍽️" },
                    { name: "W Hotel Midtown", rate: "10% on bookings", earned: "$1,203", emoji: "🏨" },
                    { name: "Afrobeats Fest", rate: "15% on tickets", earned: "$1,004", emoji: "🎵" },
                  ].map((campaign) => (
                    <div key={campaign.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
                          {campaign.emoji}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">{campaign.rate}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-foreground">{campaign.earned}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notifications */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -left-8 bg-card border border-border px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2"
            >
              <span className="text-lg">💰</span>
              +$47 commission just now
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
              className="absolute bottom-1/3 -right-12 bg-card border border-border px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2"
            >
              <span className="text-lg">🎁</span>
              Gift card sold via your link!
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
              className="absolute bottom-4 -left-6 bg-card border border-border px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-card flex items-center gap-2"
            >
              <span className="text-lg">📈</span>
              142 clicks today
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
