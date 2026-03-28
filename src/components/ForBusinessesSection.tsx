import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Active Creators", value: "47", icon: "👥" },
  { label: "Revenue Driven", value: "$18.4K", icon: "💰" },
  { label: "Campaign ROI", value: "6.7x", icon: "📈" },
];

const benefits = [
  { icon: "💲", title: "Performance-Only Pricing", metric: "$0 upfront", desc: "Pay only when a creator drives a sale." },
  { icon: "🎯", title: "Full-Funnel Attribution", metric: "100% tracked", desc: "Every click, sign-up, and purchase traced." },
  { icon: "🎁", title: "Gift Card Distribution", metric: "3.2x wider", desc: "Creators sell your gift cards everywhere." },
  { icon: "🤖", title: "AI Creator Matching", metric: "Smart match", desc: "We match you with creators who fit your brand." },
  { icon: "📊", title: "Campaign Dashboard", metric: "6.7x ROI", desc: "Real-time analytics on every campaign." },
  { icon: "🔗", title: "AuraLink Connected", metric: "15+ cards", desc: "Seamlessly connected to your AuraLink inventory." },
];

const ForBusinessesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="for-businesses" className="py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-military/10 border border-military/20 text-xs font-bold uppercase tracking-wider text-foreground">
              🏨 For Restaurants, Hotels & Venues
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading">
              Stop paying for impressions.{" "}
              <span className="font-display italic text-military">Pay for results.</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              TribeMint connects your business with a network of trusted creators who promote you to their audience. You only pay when they deliver real customers.
            </p>
            <button
              onClick={() => navigate("/business-dashboard")}
              className="px-8 py-4 font-extrabold bg-military text-lime rounded-full text-base hover:opacity-90 transition-opacity shadow-mint"
            >
              Launch Your Campaign →
            </button>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-military rounded-2xl p-6 border border-lime/10 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-extrabold font-heading text-lg">Campaign Overview</h3>
              <span className="text-lime text-xs font-bold">Last 7 days</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <p className="text-lime text-2xl font-extrabold font-heading">{s.value}</p>
                  <p className="text-white/40 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Mini bar chart mockup */}
            <div className="flex items-end gap-2 h-20">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-lime/20 rounded-t-lg relative" style={{ height: `${h}%` }}>
                  <div className="absolute inset-0 bg-lime/40 rounded-t-lg" style={{ height: `${h * 0.7}%`, marginTop: 'auto', bottom: 0, position: 'absolute' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/30">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Benefit cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5 bg-gradient-card border border-border hover:border-military/30 transition-colors shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{b.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-military/10 text-foreground text-[11px] font-extrabold">
                  {b.metric}
                </span>
              </div>
              <h3 className="text-sm font-extrabold font-heading mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForBusinessesSection;
