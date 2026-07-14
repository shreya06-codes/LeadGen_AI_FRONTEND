import { useEffect, useState } from "react";
import { getLeads } from "../../api/leadApi";
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ExternalLink,
  Brain,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  purple: "#8B5CF6",
};

const areaData = [
  { month: "Jan", leads: 1840, enriched: 1200 },
  { month: "Feb", leads: 2200, enriched: 1600 },
  { month: "Mar", leads: 1980, enriched: 1450 },
  { month: "Apr", leads: 2780, enriched: 2100 },
  { month: "May", leads: 3200, enriched: 2600 },
  { month: "Jun", leads: 2900, enriched: 2300 },
  { month: "Jul", leads: 3800, enriched: 3100 },
  { month: "Aug", leads: 4200, enriched: 3500 },
];





function StatCard({ label, value, delta, deltaLabel, icon: Icon, iconColor, trend }: any) {
  const up = trend === "up";
  
  return (
    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }} className="rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}14` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          style={{
            backgroundColor: up ? `${C.success}14` : `${C.error}14`,
            color: up ? C.success : C.error,
          }}
        >
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {delta}
        </span>
      </div>
      <p className="text-2xl font-bold" style={{ color: C.text }}>{value}</p>
      <p className="text-sm mt-0.5" style={{ color: C.muted }}>{label}</p>
      <p className="text-xs mt-1" style={{ color: C.muted }}>{deltaLabel}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : C.muted;
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Hot: C.error, Warm: C.warning, Cold: C.muted };
  const c = map[status] ?? C.muted;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${c}14`, color: c }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
      {status}
    </span>
  );
}

interface DashboardPageProps {
   onViewLead: (leadId: number) => void;
   onNavigate: (page: any) => void;
}

export function DashboardPage({ onViewLead, onNavigate }: DashboardPageProps) {

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);
  const totalLeads = leads.length;

const newLeads = leads.filter(
  (lead) => lead.status === "New"
).length;

const highQualityLeads = leads.filter(
  (lead) => lead.lead_quality === "High"
).length;

const averageScore =
  leads.length > 0
    ? Math.round(
        leads.reduce((sum, lead) => sum + (lead.score || 0), 0) /
          leads.length
      )
    : 0;
 const recentLeads = leads.slice(0, 6).map((lead) => ({
  id: lead.id,
  company: lead.company_name,
  contact: lead.email || "Not Available",
  role: lead.industry || "Unknown",
  score: lead.score,
  status: lead.lead_quality,
  industry: lead.industry,
  location: lead.website || "N/A",
}));   

const pieData = [
  {
    name: "High",
    value: leads.filter((lead) => lead.lead_quality === "High").length,
    color: C.success,
  },
  {
    name: "Medium",
    value: leads.filter((lead) => lead.lead_quality === "Medium").length,
    color: C.warning,
  },
  {
    name: "Low",
    value: leads.filter((lead) => lead.lead_quality === "Low").length,
    color: C.error,
  },
];

const aiInsights = [
  {
    icon: TrendingUp,
    color: C.success,
    text: `Total Leads Generated: ${leads.length}`,
  },
  {
    icon: Brain,
    color: C.purple,
    text: `${leads.filter(l => l.status === "New").length} new leads are ready for outreach.`,
  },
  {
    icon: Target,
    color: C.primary,
    text: `${leads.filter(l => l.lead_quality === "High").length} high-quality leads identified.`,
  },
];

const industryCount = leads.reduce((acc: Record<string, number>, lead: any) => {
  const industry = lead.industry || "Unknown";
  acc[industry] = (acc[industry] || 0) + 1;
  return acc;
}, {});

const barData = Object.entries(industryCount).map(([name, value]) => ({
  name,
  value,
}));
  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard
    label="Total Leads"
    value={totalLeads.toString()}
    delta={`${newLeads} New`}
    deltaLabel="Available Leads"
    icon={Users}
    iconColor={C.primary}
    trend="up"
  />

  <StatCard
    label="AI Score Avg."
    value={averageScore.toString()}
    delta={`${highQualityLeads} High Quality`}
    deltaLabel="Qualified Leads"
    icon={Brain}
    iconColor={C.purple}
    trend="up"
  />

  <StatCard
    label="High Quality"
    value={highQualityLeads.toString()}
    delta="AI Qualified"
    deltaLabel="Lead Quality"
    icon={Zap}
    iconColor={C.success}
    trend="up"
  />

  <StatCard
    label="New Leads"
    value={newLeads.toString()}
    delta="Recently Added"
    deltaLabel="Status"
    icon={Target}
    iconColor={C.warning}
    trend="up"
  />
</div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Area chart */}
          <div
            className="lg:col-span-2 rounded-xl p-5"
            style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>Lead Pipeline</h3>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Discovered vs enriched leads over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: C.muted }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.primary }} />
                  Discovered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.success }} />
                  Enriched
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.success} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                  cursor={{ stroke: C.border }}
                />
                <Area type="monotone" dataKey="leads" stroke={C.primary} strokeWidth={2} fill="url(#gBlue)" />
                <Area type="monotone" dataKey="enriched" stroke={C.success} strokeWidth={2} fill="url(#gGreen)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie + bar stacked */}
          <div className="space-y-4">
            {/* Lead temp pie */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Lead Temperature</h3>
              <div className="flex items-center gap-4">
                <PieChart width={80} height={80}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={24} outerRadius={38} dataKey="value" strokeWidth={0}>
                    {pieData.map((e) => <Cell key={`pie-${e.name}`} fill={e.color} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2 flex-1">
                  {pieData.map((e) => (
                    <div key={e.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5" style={{ color: C.muted }}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                        {e.name}
                      </span>
                      <span className="font-semibold" style={{ color: C.text }}>{e.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry bar */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>By Industry</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} layout="vertical" margin={{ left: 60, right: 20, top: 10, bottom: 10 }}
>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip
                    contentStyle={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: `${C.primary}08` }}
                  />
                  <Bar dataKey="value" fill={C.primary} radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights strip */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${C.purple}18` }}>
                <Brain className="w-3.5 h-3.5" style={{ color: C.purple }} />
              </div>
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>AI Insights</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${C.purple}14`, color: C.purple }}>3 new</span>
            </div>
            <button
              onClick={() => onNavigate("ai-insights")}
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: C.primary }}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map(({ icon: Icon, color, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}
              >
                <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: C.text }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads table */}
        <div
          className="rounded-xl"
          style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Recent Leads</h3>
            <button
              onClick={() => onNavigate("leads")}
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: C.primary }}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Company", "Contact", "Role", "Industry", "AI Score", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: C.muted }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 6).map((lead) => (
                  <tr
                    key={lead.id}
                    className="group cursor-pointer transition-colors"
                    style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                    onClick={() => onViewLead(lead.id)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: C.primary }}
                        >
                          {lead.company_name?.charAt(0) || "?"}
                        </div>
                        <span className="text-sm font-medium" style={{ color: C.text }}></span>{lead.company_name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: C.text }}>{lead.email || "N/A"}</td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: C.muted }}>{lead.company_size || "N/A"}</td>
              
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.muted }}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
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
