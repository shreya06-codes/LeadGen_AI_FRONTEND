import { useState } from "react";
import {
  Brain, TrendingUp, Target, Sparkles, Download, Calendar,
  Users, Zap, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
  Globe, BarChart3, Activity, RefreshCw, Bell, Flame, Star,
  Building2, ChevronDown, Clock, Filter, Cpu, Shield,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const C = {
  primary: "#2563EB",
  navy: "#0F172A",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  muted: "#64748B",
  text: "#0F172A",
  textSec: "#475569",
  purple: "#8B5CF6",
  teal: "#0D9488",
  pink: "#EC4899",
  orange: "#F97316",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const leadGrowthData = [
  { month: "Jan", discovered: 8400, enriched: 6200, converted: 420 },
  { month: "Feb", discovered: 9800, enriched: 7400, converted: 510 },
  { month: "Mar", discovered: 11200, enriched: 8600, converted: 630 },
  { month: "Apr", discovered: 13500, enriched: 10100, converted: 780 },
  { month: "May", discovered: 15800, enriched: 12300, converted: 940 },
  { month: "Jun", discovered: 18200, enriched: 14600, converted: 1120 },
  { month: "Jul", discovered: 21400, enriched: 17200, converted: 1380 },
  { month: "Aug", discovered: 24800, enriched: 20100, converted: 1640 },
];

const industryData = [
  { name: "SaaS", value: 34, leads: 42340, growth: "+28%" },
  { name: "FinTech", value: 22, leads: 27412, growth: "+41%" },
  { name: "HealthTech", value: 14, leads: 17480, growth: "+19%" },
  { name: "Infrastructure", value: 11, leads: 13720, growth: "+33%" },
  { name: "E-commerce", value: 9, leads: 11230, growth: "+12%" },
  { name: "Other", value: 10, leads: 12650, growth: "+8%" },
];

const industryColors = [C.primary, C.success, C.purple, C.teal, C.warning, C.muted];

const scoreDistData = [
  { range: "90–100", count: 3842, label: "Prime" },
  { range: "80–89", count: 8920, label: "Hot" },
  { range: "70–79", count: 15340, label: "Warm" },
  { range: "60–69", count: 22180, label: "Moderate" },
  { range: "50–59", count: 18420, label: "Low" },
  { range: "<50", count: 11130, label: "Cold" },
];

const enrichmentData = [
  { week: "W1", rate: 78 },
  { week: "W2", rate: 81 },
  { week: "W3", rate: 79 },
  { week: "W4", rate: 84 },
  { week: "W5", rate: 86 },
  { week: "W6", rate: 83 },
  { week: "W7", rate: 88 },
  { week: "W8", rate: 91 },
];

const geoData = [
  { region: "North America", leads: 58420, pct: 47 },
  { region: "Europe", leads: 31240, pct: 25 },
  { region: "Asia Pacific", leads: 19880, pct: 16 },
  { region: "Latin America", leads: 8920, pct: 7 },
  { region: "Middle East & Africa", leads: 6370, pct: 5 },
];

const activityFeed = [
  { id: 1, type: "crawl", icon: Globe, color: C.primary, title: "LinkedIn Sales Navigator crawl completed", detail: "Discovered 2,341 new leads · 18% above expected yield", time: "2 min ago", badge: "Success" },
  { id: 2, type: "alert", icon: AlertCircle, color: C.warning, title: "Enrichment hit rate drop detected", detail: "HealthTech segment dropped 6% — possible data source outage", time: "14 min ago", badge: "Alert" },
  { id: 3, type: "verify", icon: CheckCircle2, color: C.success, title: "Bulk email verification complete", detail: "4,820 contacts verified · 87.3% deliverability rate", time: "31 min ago", badge: "Done" },
  { id: 4, type: "insight", icon: Brain, color: C.purple, title: "New AI pattern detected", detail: "Series B FinTech companies show 3.2× higher intent this week", time: "1 hr ago", badge: "Insight" },
  { id: 5, type: "score", icon: TrendingUp, color: C.success, title: "Score model retrained", detail: "Model v3.3 deployed · avg accuracy improved from 91% → 94%", time: "2 hr ago", badge: "Updated" },
  { id: 6, type: "anomaly", icon: Zap, color: C.error, title: "Unusual traffic spike on Crunchbase crawl", detail: "Rate-limit encountered — crawl auto-throttled, resuming in 8 min", time: "3 hr ago", badge: "Warning" },
  { id: 7, type: "new", icon: Sparkles, color: C.teal, title: "1,204 new leads added to pipeline", detail: "Source: ProductHunt + AngelList batch job", time: "4 hr ago", badge: "New" },
];

const teamMembers = [
  { name: "James Doe", initials: "JD", color: C.primary, role: "Growth Lead", searches: 48, exports: 12, outreach: 34, saved: 89, score: 96 },
  { name: "Sarah Kim", initials: "SK", color: C.success, role: "Sales Manager", searches: 62, exports: 28, outreach: 71, saved: 124, score: 91 },
  { name: "Marcus Liu", initials: "ML", color: C.purple, role: "BDR", searches: 31, exports: 8, outreach: 55, saved: 67, score: 84 },
  { name: "Priya Gupta", initials: "PG", color: C.warning, role: "Account Exec", searches: 27, exports: 14, outreach: 43, saved: 52, score: 79 },
];

const recommendations = [
  {
    icon: Flame,
    color: C.error,
    badge: "High Opportunity",
    title: "FinTech Series B+ companies surging",
    body: "847 new companies entered growth stage this month. Historical data shows 3.2× higher conversion vs baseline. Recommend targeting VP Engineering and CTO roles.",
    action: "Create segment",
    confidence: 94,
  },
  {
    icon: Clock,
    color: C.primary,
    badge: "Timing Signal",
    title: "Outreach window: Tue–Thu 9–11am",
    body: "AI analysis of 18,000+ email interactions confirms VP-level contacts respond 47% more on Tuesday and Wednesday mornings. Schedule campaigns accordingly.",
    action: "Schedule campaign",
    confidence: 89,
  },
  {
    icon: TrendingUp,
    color: C.success,
    badge: "Growth Trend",
    title: "Infrastructure segment growing 33% MoM",
    body: "Cloud infrastructure companies are hiring 40% more SDRs and engineers — strong buying intent signal. 2,140 companies newly eligible for outreach.",
    action: "View leads",
    confidence: 86,
  },
  {
    icon: AlertCircle,
    color: C.warning,
    badge: "Data Quality",
    title: "28 high-score leads need re-enrichment",
    body: "These leads are 90+ days old and show 62% lower accuracy. Re-enriching now will preserve pipeline quality and prevent outreach to stale contacts.",
    action: "Re-enrich now",
    confidence: 98,
  },
];

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "This year", "Custom"];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Card({ children, className = "", noPad = false }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div
      className={`rounded-xl ${noPad ? "" : "p-5"} ${className}`}
      style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: C.text }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Delta({ value, up, suffix = "" }: { value: string; up: boolean; suffix?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: up ? `${C.success}14` : `${C.error}14`, color: up ? C.success : C.error }}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {value}{suffix}
    </span>
  );
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

const kpis = [
  { label: "Total Leads", value: "124,832", delta: "12.4%", up: true, icon: Users, color: C.primary, sub: "vs last month" },
  { label: "Verified Contacts", value: "89,241", delta: "8.7%", up: true, icon: CheckCircle2, color: C.success, sub: "87.3% deliverability" },
  { label: "Conversion Predicted", value: "6.8%", delta: "0.4%", up: false, icon: Target, color: C.warning, sub: "AI forecast" },
  { label: "Avg AI Score", value: "78.3", delta: "3.1%", up: true, icon: Brain, color: C.purple, sub: "across all leads" },
  { label: "Enrichment Rate", value: "91.2%", delta: "2.8%", up: true, icon: Zap, color: C.teal, sub: "last 30 days" },
  { label: "Outreach Open Rate", value: "34.6%", delta: "5.2%", up: true, icon: Activity, color: C.pink, sub: "vs industry 21%" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AIInsightsPage() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filtered = recommendations.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "high") return r.confidence >= 90;
    if (activeFilter === "medium") return r.confidence >= 80 && r.confidence < 90;
    return r.confidence < 80;
  });

  const tooltipStyle = {
    contentStyle: { backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 },
    cursor: { stroke: C.border },
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.purple}14` }}>
                <Brain className="w-4 h-4" style={{ color: C.purple }} />
              </div>
              <h2 className="font-bold text-xl" style={{ color: C.text }}>AI Insights & Analytics</h2>
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${C.purple}14`, color: C.purple }}>
                <Sparkles className="w-3 h-3" /> Live Intelligence
              </span>
            </div>
            <p className="text-sm" style={{ color: C.muted }}>
              AI-powered analytics, predictive insights, and performance intelligence across your entire lead pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Date range picker */}
            <div className="relative">
              <button
                onClick={() => setDateOpen((o) => !o)}
                className="flex items-center gap-2 h-9 px-3.5 rounded-lg text-sm border transition-colors"
                style={{ borderColor: C.border, backgroundColor: C.white, color: C.text }}
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: C.muted }} />
                {dateRange}
                <ChevronDown className="w-3.5 h-3.5" style={{ color: C.muted }} />
              </button>
              {dateOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-44 rounded-xl py-1.5 shadow-lg" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                    {DATE_RANGES.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setDateRange(r); setDateOpen(false); }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors"
                        style={{ color: C.text }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        {r}
                        {dateRange === r && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.primary }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: C.border, backgroundColor: C.white, color: C.muted }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>

            <button
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: C.primary, color: "#fff" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh AI
            </button>
          </div>
        </div>

        {/* ── AI Engine status banner ──────────────────────────────────────── */}
        <div
          className="rounded-xl p-5 flex items-center gap-6 flex-wrap"
          style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1E293B 100%)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.purple}30` }}>
              <Cpu className="w-5 h-5" style={{ color: "#C4B5FD" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold">Aurxon AI Engine v3.3</p>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${C.success}25`, color: C.success }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> Operational
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Last trained 4 hours ago · Processing 124,832 leads in real time</p>
            </div>
          </div>
          <div className="flex gap-8 flex-wrap">
            {[
              { label: "Model Accuracy", value: "94.2%", up: true },
              { label: "Enrichment Hit Rate", value: "91.2%", up: true },
              { label: "Intent Precision", value: "87.6%", up: true },
              { label: "Avg Latency", value: "142ms", up: true },
            ].map(({ label, value, up }) => (
              <div key={label}>
                <p className="text-xs" style={{ color: "#94A3B8" }}>{label}</p>
                <p className="text-white font-bold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: C.success }} />
            <span className="text-xs" style={{ color: "#94A3B8" }}>SOC 2 · GDPR</span>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map(({ label, value, delta, up, icon: Icon, color, sub }) => (
            <Card key={label}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <Delta value={delta} up={up} />
              </div>
              <p className="text-2xl font-black" style={{ color: C.text }}>{value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: C.muted }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: `${C.muted}99` }}>{sub}</p>
            </Card>
          ))}
        </div>

        {/* ── Charts row 1 ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Lead growth area chart */}
          <Card className="lg:col-span-2">
            <SectionLabel
              title="Lead Pipeline Growth"
              subtitle="Discovered · Enriched · Converted"
              action={
                <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
                  {[["Discovered", C.primary], ["Enriched", C.success], ["Converted", C.purple]].map(([l, c]) => (
                    <span key={l as string} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c as string }} />{l}
                    </span>
                  ))}
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={leadGrowthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  {[["gB", C.primary], ["gG", C.success], ["gP", C.purple]].map(([id, color]) => (
                    <linearGradient key={id as string} id={id as string} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color as string} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={color as string} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle.contentStyle} cursor={{ stroke: C.border }} />
                <Area type="monotone" dataKey="discovered" stroke={C.primary} strokeWidth={2} fill="url(#gB)" />
                <Area type="monotone" dataKey="enriched" stroke={C.success} strokeWidth={2} fill="url(#gG)" />
                <Area type="monotone" dataKey="converted" stroke={C.purple} strokeWidth={2} fill="url(#gP)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Industry pie */}
          <Card>
            <SectionLabel title="Industry Distribution" subtitle="By lead count" />
            <PieChart width={220} height={160} style={{ margin: "0 auto" }}>
              <Pie
                data={industryData}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={72}
                dataKey="value"
                strokeWidth={0}
                paddingAngle={2}
              >
                {industryData.map((_, i) => (
                  <Cell key={`ind-${i}`} fill={industryColors[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle.contentStyle} formatter={(v: any) => [`${v}%`, "Share"]} />
            </PieChart>
            <div className="space-y-2 mt-1">
              {industryData.map(({ name, leads, growth }, i) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: industryColors[i] }} />
                  <span className="text-xs flex-1 truncate" style={{ color: C.textSec }}>{name}</span>
                  <span className="text-xs font-semibold" style={{ color: C.text }}>{(leads / 1000).toFixed(0)}k</span>
                  <span className="text-xs font-medium" style={{ color: C.success }}>{growth}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* AI Score distribution */}
          <Card>
            <SectionLabel title="AI Score Distribution" subtitle="Lead quality breakdown" />
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scoreDistData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle.contentStyle} cursor={{ fill: `${C.primary}08` }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
                  {scoreDistData.map((_, i) => {
                    const colors = [C.success, C.success, C.primary, C.warning, C.warning, C.muted];
                    return <Cell key={`score-${i}`} fill={colors[i]} fillOpacity={0.85} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Enrichment trend */}
          <Card>
            <SectionLabel
              title="Enrichment Success Rate"
              subtitle="8-week rolling average"
              action={<Delta value="2.8%" up={true} />}
            />
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={enrichmentData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle.contentStyle} cursor={{ stroke: C.border }} formatter={(v: any) => [`${v}%`, "Rate"]} />
                <Line type="monotone" dataKey="rate" stroke={C.teal} strokeWidth={2.5} dot={{ r: 3.5, fill: C.teal, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span style={{ color: C.muted }}>Current: <span className="font-bold" style={{ color: C.teal }}>91.2%</span></span>
              <span style={{ color: C.muted }}>Target: <span className="font-medium" style={{ color: C.text }}>95%</span></span>
            </div>
          </Card>

          {/* Geographic distribution */}
          <Card>
            <SectionLabel title="Geographic Distribution" subtitle="Leads by region" />
            <div className="space-y-3">
              {geoData.map(({ region, leads, pct }) => (
                <div key={region}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Globe className="w-3 h-3 flex-shrink-0" style={{ color: C.muted }} />
                      <span className="truncate" style={{ color: C.textSec }}>{region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs flex-shrink-0">
                      <span style={{ color: C.muted }}>{(leads / 1000).toFixed(1)}k</span>
                      <span className="font-bold w-7 text-right" style={{ color: C.text }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 40 ? C.primary : pct >= 20 ? C.success : pct >= 10 ? C.purple : C.muted }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 flex items-center justify-between text-xs" style={{ borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.muted }}>Total coverage</span>
              <span className="font-semibold" style={{ color: C.text }}>124,832 leads · 68 countries</span>
            </div>
          </Card>
        </div>

        {/* ── AI Recommendations + Activity Feed ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Recommendations — 3 cols */}
          <div className="xl:col-span-3 space-y-0" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12 }}>
            <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>AI Recommendations</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${C.purple}14`, color: C.purple }}>
                  {recommendations.length} active
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {(["all", "high", "medium", "low"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className="text-xs px-2.5 py-1 rounded-md font-medium transition-colors capitalize"
                    style={{
                      backgroundColor: activeFilter === f ? C.primary : C.bg,
                      color: activeFilter === f ? "#fff" : C.muted,
                      border: `1px solid ${activeFilter === f ? C.primary : C.border}`,
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filtered.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <div
                  key={rec.title}
                  className="px-5 py-4 group cursor-pointer transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : undefined }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${rec.color}14` }}>
                      <Icon className="w-4 h-4" style={{ color: rec.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${rec.color}14`, color: rec.color }}>
                          {rec.badge}
                        </span>
                        <span className="text-xs" style={{ color: C.muted }}>
                          Confidence: <span className="font-bold" style={{ color: rec.confidence >= 90 ? C.success : C.warning }}>{rec.confidence}%</span>
                        </span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>{rec.title}</p>
                      <p className="text-sm leading-relaxed mt-0.5" style={{ color: C.textSec }}>{rec.body}</p>
                      <button
                        className="mt-2 text-xs font-medium flex items-center gap-1 hover:underline"
                        style={{ color: C.primary }}
                      >
                        {rec.action} <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity feed — 2 cols */}
          <div className="xl:col-span-2" style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12 }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>Real-time Activity</h3>
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${C.success}14`, color: C.success }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> Live
                </span>
              </div>
              <button style={{ color: C.muted }}>
                <Bell className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 460 }}>
              {activityFeed.map((item, i) => {
                const Icon = item.icon;
                const badgeColors: Record<string, string> = {
                  Success: C.success, Done: C.success, Insight: C.purple, Updated: C.primary,
                  Alert: C.warning, Warning: C.error, New: C.teal,
                };
                const bc = badgeColors[item.badge] ?? C.muted;
                return (
                  <div
                    key={item.id}
                    className="px-4 py-3.5 group cursor-pointer transition-colors"
                    style={{ borderBottom: i < activityFeed.length - 1 ? `1px solid ${C.border}` : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${item.color}14` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold leading-snug" style={{ color: C.text }}>{item.title}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0" style={{ backgroundColor: `${bc}14`, color: bc }}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: C.muted }}>{item.detail}</p>
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: `${C.muted}99` }}>
                          <Clock className="w-2.5 h-2.5" /> {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Team Performance ─────────────────────────────────────────────── */}
        <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Team Performance</h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Activity, exports, and outreach metrics per team member</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg border" style={{ borderColor: C.border, color: C.muted }}>
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  {["Team Member", "Searches", "Exports", "Outreach Sent", "Leads Saved", "Performance"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: C.muted }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((m, i) => (
                  <tr
                    key={m.name}
                    style={{ borderBottom: i < teamMembers.length - 1 ? `1px solid ${C.border}` : undefined }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: m.color }}>
                          {m.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-xs" style={{ color: C.text }}>{m.name}</p>
                          <p className="text-xs" style={{ color: C.muted }}>{m.role}</p>
                        </div>
                      </div>
                    </td>
                    {[m.searches, m.exports, m.outreach, m.saved].map((val, vi) => (
                      <td key={vi} className="px-5 py-4 text-sm font-semibold" style={{ color: C.text }}>{val}</td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${m.score}%`,
                              backgroundColor: m.score >= 90 ? C.success : m.score >= 80 ? C.primary : C.warning,
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: m.score >= 90 ? C.success : m.score >= 80 ? C.primary : C.warning }}>
                          {m.score}
                        </span>
                        {i === 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${C.warning}14`, color: C.warning }}>
                            🏆 Top
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
