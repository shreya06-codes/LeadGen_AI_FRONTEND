import { useState } from "react";
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

const exportHistory = [
  { id: 1, name: "SaaS Hot Leads — Q2 2025", format: "CSV", records: 2341, size: "1.4 MB", created: "2 hours ago", status: "ready" },
  { id: 2, name: "FinTech Series B Contacts", format: "JSON", records: 412, size: "284 KB", created: "Yesterday", status: "ready" },
  { id: 3, name: "Full Lead Database Snapshot", format: "CSV", records: 124832, size: "78.2 MB", created: "3 days ago", status: "ready" },
  { id: 4, name: "AI Score > 80 Segment", format: "XLSX", records: 8924, size: "5.1 MB", created: "5 days ago", status: "ready" },
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
  const [selectedCount] = useState(3241);

  const toggle = (id: string) => {
    setStatuses((s) => ({
      ...s,
      [id]: s[id] === "connected" ? "disconnected" : "connected",
    }));
  };

  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="p-6 space-y-5 max-w-screen-xl mx-auto">

        {/* Quick export panel */}
        <div className="rounded-xl p-5" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Quick Export</h3>
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
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium"
              style={{ backgroundColor: C.primary, color: "#fff" }}
            >
              <Download className="w-4 h-4" />
              Export {selectedCount.toLocaleString()} leads
            </button>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center gap-6 text-xs" style={{ borderColor: C.border, color: C.muted }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> GDPR compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> Encrypted in transit</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: C.success }} /> No credit deduction for re-exports</span>
          </div>
        </div>

        {/* Integrations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: C.text }}>Integrations</h3>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: C.border, color: C.muted }}>
              <Plus className="w-3.5 h-3.5" /> Request integration
            </button>
          </div>

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
        </div>

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
