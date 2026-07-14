import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { getLeads } from "../../api/leadApi";
import {
  Download,
  CheckCircle2,
  Clock,
  Link,
  Plus,
  Settings,
  ArrowRight,
  FileSpreadsheet,
  FileJson,
  Database,
  Zap,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const C = {
  primary: "#2563EB",
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

type ConnStatus = "connected" | "disconnected" | "error";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: ConnStatus;
  lastSync?: string;
  logo: string;
  color: string;
}

const integrations: Integration[] = [
  { id: "hubspot", name: "HubSpot CRM", category: "CRM", description: "Sync leads directly to HubSpot contacts and companies", status: "connected", lastSync: "2 min ago", logo: "H", color: "#FF7A59" },
  { id: "salesforce", name: "Salesforce", category: "CRM", description: "Push leads to Salesforce with custom field mapping", status: "connected", lastSync: "15 min ago", logo: "S", color: "#00A1E0" },
  { id: "apollo", name: "Apollo.io", category: "Outreach", description: "Import enriched leads into Apollo sequences", status: "disconnected", lastSync: undefined, logo: "A", color: "#6E3BFF" },
  { id: "outreach", name: "Outreach", category: "Outreach", description: "Sync leads to Outreach for automated sequencing", status: "disconnected", lastSync: undefined, logo: "O", color: "#5951FF" },
  { id: "slack", name: "Slack", category: "Notifications", description: "Get real-time alerts for high-score leads in Slack", status: "connected", lastSync: "Just now", logo: "Sl", color: "#4A154B" },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Connect Aurxon to 5,000+ apps via Zapier Zaps", status: "disconnected", lastSync: undefined, logo: "Z", color: "#FF4A00" },
  { id: "segment", name: "Segment", category: "Data", description: "Route lead events to your data warehouse", status: "error", lastSync: "Failed 1h ago", logo: "Sg", color: "#52BD95" },
  { id: "snowflake", name: "Snowflake", category: "Data", description: "Export lead datasets directly to Snowflake tables", status: "disconnected", lastSync: undefined, logo: "Sf", color: "#29B5E8" },
];

const statusConfig: Record<ConnStatus, { color: string; bg: string; label: string; icon: typeof CheckCircle2 }> = {
  connected: { color: C.success, bg: `${C.success}14`, label: "Connected", icon: CheckCircle2 },
  disconnected: { color: C.muted, bg: `${C.muted}12`, label: "Disconnected", icon: AlertCircle },
  error: { color: C.error, bg: `${C.error}14`, label: "Error", icon: AlertCircle },
};

const formatIcons: Record<string, typeof Download> = {
  CSV: FileSpreadsheet,
  JSON: FileJson,
  XLSX: FileSpreadsheet,
};

export function ExportPage() {
  const [statuses, setStatuses] = useState<Record<string, ConnStatus>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.status]))
  );
  const [activeFormat, setActiveFormat] = useState<"CSV" | "JSON" | "XLSX">("CSV");
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [industryFilter, setIndustryFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
        setSelectedCount(data.length);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      }
    };

    fetchLeads();
  }, []);

  const toggle = (id: string) => {
    setStatuses((s) => ({
      ...s,
      [id]: s[id] === "connected" ? "disconnected" : "connected",
    }));
  };

  const categories = [...new Set(integrations.map((i) => i.category))];

  // Derive active filtered dataset
  const filteredLeads = leads.filter((lead) => {
    const industryMatch = industryFilter === "All" || lead.industry === industryFilter;
    const qualityMatch = qualityFilter === "All" || lead.lead_quality === qualityFilter;
    const statusMatch = statusFilter === "All" || lead.status === statusFilter;
    const scoreMatch = lead.score >= minScore;

    return industryMatch && qualityMatch && statusMatch && scoreMatch;
  });

  // Keep live scope counts synced whenever filters shift
  useEffect(() => {
    setSelectedCount(filteredLeads.length);
  }, [industryFilter, qualityFilter, statusFilter, minScore, leads]);

  const exportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = Object.keys(filteredLeads[0]);
    const rows = filteredLeads.map((lead) =>
      headers.map((h) => lead[h] ?? "")
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aurxon_leads.csv";
    link.click();
    URL.revokeObjectURL(url);

    setExportHistory((prev) => [
      {
        id: Date.now(),
        name: "Lead Export",
        format: "CSV",
        records: filteredLeads.length,
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        created: "Just now",
        status: "ready",
      },
      ...prev,
    ]);
  };

  const exportJSON = () => {
    if (filteredLeads.length === 0) return;

    const jsonString = JSON.stringify(filteredLeads, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aurxon_leads.json";
    link.click();
    URL.revokeObjectURL(url);

    setExportHistory((prev) => [
      {
        id: Date.now(),
        name: "Lead Export",
        format: "JSON",
        records: filteredLeads.length,
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        created: "Just now",
        status: "ready",
      },
      ...prev,
    ]);
  };

  const exportExcel = () => {
    if (filteredLeads.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(filteredLeads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "aurxon_leads.xlsx");

    setExportHistory((prev) => [
      {
        id: Date.now(),
        name: "Lead Export",
        format: "XLSX",
        records: filteredLeads.length,
        size: "-",
        created: "Just now",
        status: "ready",
      },
      ...prev,
    ]);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* Quick export panel */}
        <div className="rounded-xl p-5" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Quick Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">

            {/* Industry */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border text-sm"
              style={{ borderColor: C.border }}
            >
              <option value="All">All Industries</option>
              {[...new Set(leads.map((l) => l.industry).filter(Boolean))].map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>

            {/* Lead Quality */}
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border text-sm"
              style={{ borderColor: C.border }}
            >
              <option value="All">All Qualities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border text-sm"
              style={{ borderColor: C.border }}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
            </select>

            {/* Minimum Score */}
            <input
              type="number"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              placeholder="Minimum Score"
              className="h-10 px-3 rounded-lg border text-sm"
              style={{ borderColor: C.border }}
            />

          </div>
          
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs mb-1.5" style={{ color: C.muted }}>Export scope</p>
              <div className="h-10 px-3.5 rounded-lg border flex items-center justify-between text-sm" style={{ borderColor: C.border, color: C.text }}>
                <span>Current filtered view ({selectedCount.toLocaleString()} leads)</span>
                <ChevronRight className="w-4 h-4" style={{ color: C.muted }} />
              </div>
            </div>
            <div>
              <p className="text-xs mb-1.5" style={{ color: C.muted }}>Format</p>
              <div className="flex gap-2">
                {(["CSV", "JSON", "XLSX"] as const).map((fmt) => {
                  const Icon = formatIcons[fmt];
                  return (
                    <button
                      key={fmt}
                      onClick={() => setActiveFormat(fmt)}
                      className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg border text-sm font-medium transition-colors"
                      style={{
                        borderColor: activeFormat === fmt ? C.primary : C.border,
                        backgroundColor: activeFormat === fmt ? `${C.primary}10` : C.white,
                        color: activeFormat === fmt ? C.primary : C.muted,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => {
                if (activeFormat === "CSV") {
                  exportCSV();
                } else if (activeFormat === "JSON") {
                  exportJSON();
                } else {
                  exportExcel();
                }
              }}
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: C.primary,
                color: "#fff",
              }}
            >
              <Download className="w-4 h-4" />
              Export {selectedCount.toLocaleString()} Leads
            </button>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center gap-6 text-xs" style={{ borderColor: C.border, color: C.muted }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> GDPR compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> Encrypted in transit</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> No credit deduction for re-exports</span>
          </div>
        </div>

        {/* Integrations Header Wrapper */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: C.text }}>Integrations</h3>
          <button
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
            style={{
              borderColor: C.border,
              color: C.muted,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Request integration
          </button>
        </div>

        {/* Categories Section */}
        {categories.map((cat) => (
          <div key={cat} className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.muted }}>{cat}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrations.filter((i) => i.category === cat).map((integration) => {
                const status = statuses[integration.id] as ConnStatus;
                const cfg = statusConfig[status];
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={integration.id}
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: integration.color }}
                    >
                      {integration.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm" style={{ color: C.text }}>{integration.name}</span>
                        <span
                          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          <StatusIcon className="w-2.5 h-2.5" />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{integration.description}</p>
                      {integration.lastSync && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: C.muted }}>
                          <RefreshCw className="w-3 h-3" /> Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {status === "connected" && (
                        <button style={{ color: C.muted }}>
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => toggle(integration.id)}
                        className="h-8 px-3 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: status === "connected" ? `${C.error}12` : `${C.primary}12`,
                          color: status === "connected" ? C.error : C.primary,
                          border: `1px solid ${status === "connected" ? `${C.error}30` : `${C.primary}30`}`,
                        }}
                      >
                        {status === "connected" ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Export history */}
        <div className="rounded-xl" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Export History</h3>
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {exportHistory.map((exp) => {
              const Icon = formatIcons[exp.format] ?? Download;
              return (
                <div key={exp.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${C.primary}12` }}>
                    <Icon className="w-4 h-4" style={{ color: C.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: C.text }}>{exp.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {exp.records.toLocaleString()} records · {exp.size} · {exp.format} · {exp.created}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${C.success}14`, color: C.success }}
                    >
                      Ready
                    </span>
                    <button
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border transition-colors hover:border-blue-400"
                      style={{ borderColor: C.border, color: C.muted }}
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}