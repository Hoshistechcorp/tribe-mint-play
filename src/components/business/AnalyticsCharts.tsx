import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "@/hooks/use-toast";

const allChartData = [
  { name: "Apr 21", clicks: 320, conversions: 12, revenue: 360, campaign: "Weekend Brunch Push 🥂" },
  { name: "Apr 22", clicks: 410, conversions: 16, revenue: 480, campaign: "Weekend Brunch Push 🥂" },
  { name: "Apr 23", clicks: 280, conversions: 10, revenue: 300, campaign: "Date Night Special 🌙" },
  { name: "Apr 24", clicks: 520, conversions: 20, revenue: 600, campaign: "Date Night Special 🌙" },
  { name: "Apr 25", clicks: 680, conversions: 28, revenue: 840, campaign: "Weekend Brunch Push 🥂" },
  { name: "Apr 26", clicks: 890, conversions: 35, revenue: 1050, campaign: "Weekend Brunch Push 🥂" },
  { name: "Apr 27", clicks: 750, conversions: 30, revenue: 900, campaign: "Date Night Special 🌙" },
  { name: "Apr 28", clicks: 420, conversions: 18, revenue: 540, campaign: "Weekend Brunch Push 🥂" },
  { name: "Apr 29", clicks: 680, conversions: 24, revenue: 720, campaign: "Date Night Special 🌙" },
  { name: "Apr 30", clicks: 520, conversions: 20, revenue: 600, campaign: "Weekend Brunch Push 🥂" },
  { name: "May 1", clicks: 890, conversions: 35, revenue: 1050, campaign: "Holiday Menu Launch 🎄" },
  { name: "May 2", clicks: 1200, conversions: 48, revenue: 1440, campaign: "Weekend Brunch Push 🥂" },
  { name: "May 3", clicks: 1500, conversions: 62, revenue: 1860, campaign: "Date Night Special 🌙" },
  { name: "May 4", clicks: 1100, conversions: 42, revenue: 1260, campaign: "Weekend Brunch Push 🥂" },
];

const campaigns = ["All Campaigns", "Weekend Brunch Push 🥂", "Date Night Special 🌙", "Holiday Menu Launch 🎄"];
const dateRanges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "All time", days: 999 },
];

interface AnalyticsChartsProps {
  showExport?: boolean;
}

const AnalyticsCharts = ({ showExport = true }: AnalyticsChartsProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState("All Campaigns");
  const [selectedRange, setSelectedRange] = useState(14);
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const filteredData = useMemo(() => {
    let data = allChartData;
    if (selectedCampaign !== "All Campaigns") {
      data = data.filter(d => d.campaign === selectedCampaign);
    }
    return data.slice(-selectedRange);
  }, [selectedCampaign, selectedRange]);

  const totalClicks = filteredData.reduce((s, d) => s + d.clicks, 0);
  const totalConversions = filteredData.reduce((s, d) => s + d.conversions, 0);
  const totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0);

  const exportCSV = () => {
    const header = "Date,Campaign,Clicks,Conversions,Revenue\n";
    const rows = filteredData.map(d => `${d.name},${d.campaign},${d.clicks},${d.conversions},${d.revenue}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${selectedCampaign.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV downloaded 📁" });
  };

  const exportPDF = () => {
    // Simulated PDF export — in production this would use a backend
    const content = `TRIBEMINT ANALYTICS REPORT\n${"=".repeat(40)}\nCampaign: ${selectedCampaign}\nDate Range: Last ${selectedRange} days\n\nTotal Clicks: ${totalClicks.toLocaleString()}\nTotal Conversions: ${totalConversions}\nTotal Revenue: $${totalRevenue.toLocaleString()}\n\n${"─".repeat(40)}\nDAILY BREAKDOWN:\n${filteredData.map(d => `${d.name}: ${d.clicks} clicks, ${d.conversions} conv, $${d.revenue}`).join("\n")}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded 📄" });
  };

  return (
    <div className="space-y-6">
      {/* Filter controls */}
      {showExport && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap" role="toolbar" aria-label="Analytics filters">
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="campaign-filter" className="sr-only">Filter by campaign</label>
            <select
              id="campaign-filter"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-3 py-2 rounded-xl bg-card border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring min-w-[180px]"
              aria-label="Filter by campaign"
            >
              {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex rounded-xl border border-border overflow-hidden" role="radiogroup" aria-label="Date range">
              {dateRanges.map(r => (
                <button
                  key={r.days}
                  onClick={() => setSelectedRange(r.days)}
                  className={`px-3 py-2 text-xs font-bold transition-colors ${selectedRange === r.days ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                  role="radio"
                  aria-checked={selectedRange === r.days}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex rounded-xl border border-border overflow-hidden" role="radiogroup" aria-label="Chart type">
              {(["area", "bar"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`px-3 py-2 text-xs font-bold transition-colors ${chartType === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
                  role="radio"
                  aria-checked={chartType === t}
                >
                  {t === "area" ? "📈 Line" : "📊 Bar"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors" aria-label="Download CSV report">
              📥 CSV
            </button>
            <button onClick={exportPDF} className="px-3 py-2 rounded-xl bg-secondary/10 text-secondary text-xs font-bold hover:bg-secondary/20 transition-colors" aria-label="Download PDF report">
              📄 Report
            </button>
          </div>
        </div>
      )}

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clicks", value: totalClicks.toLocaleString(), color: "text-primary" },
          { label: "Conversions", value: totalConversions.toLocaleString(), color: "text-secondary" },
          { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "text-accent" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center" role="status" aria-label={`${s.label}: ${s.value}`}>
            <p className={`text-lg sm:text-xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-4 sm:p-6">
        <h3 className="font-heading font-bold mb-1 text-base">Revenue Trend 📈</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {selectedCampaign === "All Campaigns" ? "All campaigns" : selectedCampaign} · {selectedRange >= 999 ? "All time" : `Last ${selectedRange} days`}
        </p>
        <div className="h-56" role="img" aria-label="Revenue trend chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 30%, 35%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150, 30%, 35%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(150, 30%, 35%)" fill="url(#revenueGradient)" strokeWidth={2} />
            </AreaChart>
            ) : (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(150, 30%, 35%)" radius={[6, 6, 0, 0]} />
            </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clicks & Conversions side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-4 sm:p-6">
          <h3 className="font-heading font-bold text-sm mb-1">Clicks 🖱️</h3>
          <p className="text-2xl font-bold text-primary font-heading mb-3">{totalClicks.toLocaleString()}</p>
          <div className="h-32" role="img" aria-label="Clicks sparkline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(150, 30%, 35%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(150, 30%, 35%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="clicks" stroke="hsl(150, 30%, 35%)" fill="url(#clicksGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-4 sm:p-6">
          <h3 className="font-heading font-bold text-sm mb-1">Conversions 🛒</h3>
          <p className="text-2xl font-bold text-secondary font-heading mb-3">{totalConversions.toLocaleString()}</p>
          <div className="h-32" role="img" aria-label="Conversions sparkline">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(16, 90%, 62%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(16, 90%, 62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="conversions" stroke="hsl(16, 90%, 62%)" fill="url(#convGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
