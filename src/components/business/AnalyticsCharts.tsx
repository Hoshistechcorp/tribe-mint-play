import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "Mon", clicks: 420, conversions: 18, revenue: 540 },
  { name: "Tue", clicks: 680, conversions: 24, revenue: 720 },
  { name: "Wed", clicks: 520, conversions: 20, revenue: 600 },
  { name: "Thu", clicks: 890, conversions: 35, revenue: 1050 },
  { name: "Fri", clicks: 1200, conversions: 48, revenue: 1440 },
  { name: "Sat", clicks: 1500, conversions: 62, revenue: 1860 },
  { name: "Sun", clicks: 1100, conversions: 42, revenue: 1260 },
];

const AnalyticsCharts = () => (
  <div className="space-y-6">
    {/* Revenue Chart */}
    <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
      <h3 className="font-heading font-bold mb-1">Revenue Trend 📈</h3>
      <p className="text-xs text-muted-foreground mb-4">Daily revenue from affiliate conversions</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(162, 72%, 52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(162, 72%, 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 16%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(160, 10%, 8%)",
                border: "1px solid hsl(160, 10%, 16%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value}`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="hsl(162, 72%, 52%)" fill="url(#revenueGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Clicks & Conversions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
        <h3 className="font-heading font-bold text-sm mb-1">Clicks 🖱️</h3>
        <p className="text-2xl font-bold text-primary font-heading mb-3">
          {chartData.reduce((sum, d) => sum + d.clicks, 0).toLocaleString()}
        </p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162, 72%, 52%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(162, 72%, 52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="clicks" stroke="hsl(162, 72%, 52%)" fill="url(#clicksGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border shadow-card p-6">
        <h3 className="font-heading font-bold text-sm mb-1">Conversions 🛒</h3>
        <p className="text-2xl font-bold text-secondary font-heading mb-3">
          {chartData.reduce((sum, d) => sum + d.conversions, 0).toLocaleString()}
        </p>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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

export default AnalyticsCharts;
