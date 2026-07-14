import {
  getCrawlStats,
  getCrawlHistory,
  getCrawlStatus,
  startCrawl,
} from "../../api/leadApi";
import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, Square, RefreshCw, Plus, MoreHorizontal, Terminal,
  AlertCircle, CheckCircle2, XCircle, Clock, Cpu, Database, Wifi,
  Zap, Globe, Activity, TrendingUp, ChevronDown, Filter, Bell,
  ArrowUpRight, GitBranch, Layers, Server, Radio, AlertTriangle,
  SkipForward, Trash2, Eye, RotateCcw, ChevronRight, Gauge,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
  ,
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
  orange: "#F97316",
  logBg: "#0D1117",
  logText: "#E6EDF3",
  logMuted: "#8B949E",
  logGreen: "#3FB950",
  logYellow: "#D29922",
  logRed: "#F85149",
  logBlue: "#79C0FF",
  logPurple: "#D2A8FF",
};

// ─── Data ──────────────────────────────────────────────────────────────────

type JobStatus = "running" | "completed" | "queued" | "failed" | "paused" | "throttled";

interface CrawlJob {
  id: string;
  name: string;
  source: string;
  target: string;
  status: JobStatus;
  progress: number;
  records: number;
  errors: number;
  speed: number;
  workers: number;
  started: string;
  eta: string;
  retries: number;
  priority: "high" | "medium" | "low";
}

const CRAWL_JOBS: CrawlJob[] = [
  { id: "job-001", name: "LinkedIn Sales Navigator", source: "LinkedIn", target: "linkedin.com/sales", status: "running", progress: 67, records: 34820, errors: 12, speed: 840, workers: 12, started: "2h 14m ago", eta: "~52m", retries: 0, priority: "high" },
  { id: "job-002", name: "Crunchbase Series B Filter", source: "Crunchbase", target: "crunchbase.com/query", status: "running", progress: 88, records: 8924, errors: 3, speed: 620, workers: 6, started: "48m ago", eta: "~7m", retries: 0, priority: "high" },
  { id: "job-003", name: "G2 Reviews — SaaS CRM", source: "G2", target: "g2.com/categories/crm", status: "throttled", progress: 41, records: 5120, errors: 28, speed: 180, workers: 3, started: "1h 20m ago", eta: "~3h", retries: 7, priority: "medium" },
  { id: "job-004", name: "ProductHunt Weekly Launches", source: "ProductHunt", target: "producthunt.com", status: "queued", progress: 0, records: 0, errors: 0, speed: 0, workers: 0, started: "—", eta: "~1h 30m", retries: 0, priority: "medium" },
  { id: "job-005", name: "AngelList VC Portfolio Scan", source: "AngelList", target: "wellfound.com", status: "paused", progress: 31, records: 5600, errors: 1, speed: 0, workers: 0, started: "Paused", eta: "—", retries: 0, priority: "low" },
  { id: "job-006", name: "Reddit SaaS Community Crawl", source: "Reddit", target: "reddit.com/r/saas", status: "failed", progress: 12, records: 890, errors: 204, speed: 0, workers: 0, started: "3h ago", eta: "—", retries: 3, priority: "low" },
  { id: "job-007", name: "Glassdoor Engineering Jobs", source: "Glassdoor", target: "glassdoor.com/jobs", status: "completed", progress: 100, records: 12400, errors: 5, speed: 0, workers: 0, started: "5h ago", eta: "Done", retries: 0, priority: "medium" },
];

const statusMeta: Record<JobStatus, { color: string; bg: string; icon: typeof Activity; label: string }> = {
  running: { color: C.primary, bg: `${C.primary}14`, icon: Activity, label: "Running" },
  completed: { color: C.success, bg: `${C.success}14`, icon: CheckCircle2, label: "Completed" },
  queued: { color: C.muted, bg: `${C.muted}12`, icon: Clock, label: "Queued" },
  failed: { color: C.error, bg: `${C.error}14`, icon: XCircle, label: "Failed" },
  paused: { color: C.warning, bg: `${C.warning}14`, icon: Pause, label: "Paused" },
  throttled: { color: C.orange, bg: `${C.orange}14`, icon: AlertTriangle, label: "Throttled" },
};

const WORKERS = [
  { id: "W-01", status: "active", jobs: 3, cpu: 74, mem: 58, speed: 380, uptime: "4h 22m" },
  { id: "W-02", status: "active", jobs: 2, cpu: 61, mem: 44, speed: 290, uptime: "4h 22m" },
  { id: "W-03", status: "active", jobs: 4, cpu: 88, mem: 72, speed: 420, uptime: "4h 22m" },
  { id: "W-04", status: "idle", jobs: 0, cpu: 4, mem: 18, speed: 0, uptime: "4h 22m" },
  { id: "W-05", status: "active", jobs: 3, cpu: 52, mem: 39, speed: 310, uptime: "3h 14m" },
  { id: "W-06", status: "error", jobs: 0, cpu: 0, mem: 0, speed: 0, uptime: "Error" },
];

const QUEUES = [
  { name: "crawl:high", pending: 124, processing: 18, failed: 2, health: "healthy" },
  { name: "crawl:medium", pending: 380, processing: 24, failed: 8, health: "healthy" },
  { name: "crawl:low", pending: 842, processing: 12, failed: 31, health: "degraded" },
  { name: "enrich:contacts", pending: 2840, processing: 64, failed: 14, health: "healthy" },
  { name: "verify:email", pending: 1240, processing: 96, failed: 4, health: "healthy" },
  { name: "score:ai", pending: 580, processing: 48, failed: 0, health: "healthy" },
];

const PIPELINE_STAGES = [
  { name: "Web Crawl", icon: Globe, color: C.primary, status: "running", throughput: "840 req/s", latency: "142ms", health: 98 },
  { name: "HTML Parser", icon: Layers, color: C.teal, status: "running", throughput: "820 rec/s", latency: "28ms", health: 99 },
  { name: "NLP Enrichment", icon: Cpu, color: C.purple, status: "running", throughput: "640 rec/s", latency: "210ms", health: 94 },
  { name: "Email Verify", icon: CheckCircle2, color: C.success, status: "running", throughput: "480 rec/s", latency: "380ms", health: 97 },
  { name: "AI Scoring", icon: Zap, color: C.warning, status: "degraded", throughput: "320 rec/s", latency: "620ms", health: 81 },
  { name: "CRM Sync", icon: Database, color: C.muted, status: "idle", throughput: "—", latency: "—", health: 100 },
];

const ALERTS = [
  { id: 1, sev: "error", icon: XCircle, color: C.error, title: "Reddit crawl blocked by Cloudflare WAF", detail: "job-006 hit rate limit after 890 records. Rotating proxy IPs. Manual review required.", time: "12 min ago", acked: false },
  { id: 2, sev: "warning", icon: AlertTriangle, color: C.orange, title: "G2 crawler throttled — speed reduced 78%", detail: "Anti-bot detection on G2. Switched to stealth mode. ETA extended by 2h 40m.", time: "34 min ago", acked: false },
  { id: 3, sev: "warning", icon: AlertTriangle, color: C.warning, title: "Worker W-06 unresponsive", detail: "Heartbeat missed × 3. Attempting auto-restart. Jobs redistributed to W-01 and W-03.", time: "1h ago", acked: true },
  { id: 4, sev: "info", icon: Bell, color: C.primary, title: "AI Scoring latency elevated", detail: "OpenAI API p99 latency: 620ms (up from 210ms baseline). Queue backlog growing.", time: "1h 20m ago", acked: true },
];

const crawlRateHistory = Array.from({ length: 20 }, (_, i) => ({
  t: `${i * 3}m`,
  rate: 600 + Math.sin(i * 0.5) * 150 + Math.random() * 80,
  errors: Math.max(0, 10 + Math.sin(i * 0.8) * 8 + Math.random() * 6),
}));

const LOG_LINES = [
  { ts: "08:14:32.841", level: "INFO", tag: "crawl:001", msg: "Fetched 1,240 leads from linkedin.com/sales — batch 34/51" },
  { ts: "08:14:31.220", level: "DEBUG", tag: "parser", msg: "Parsed 840 HTML nodes · 12 ignored (nofollow)" },
  { ts: "08:14:30.104", level: "INFO", tag: "enrich", msg: "Contact enrichment complete for batch 33 — 97.2% hit rate" },
  { ts: "08:14:28.773", level: "WARN", tag: "crawl:003", msg: "Rate limit encountered on g2.com — backing off 15s (retry 7/10)" },
  { ts: "08:14:27.550", level: "INFO", tag: "verify", msg: "Email verified: alex@stripe.com [MX+SMTP] confidence=0.97" },
  { ts: "08:14:25.312", level: "ERROR", tag: "crawl:006", msg: "CF WAF block on reddit.com (HTTP 403) — rotating proxy pool" },
  { ts: "08:14:24.089", level: "INFO", tag: "score:ai", msg: "Scored 480 leads · avg_score=78.3 · model=aurxon-v3.3" },
  { ts: "08:14:22.661", level: "DEBUG", tag: "queue", msg: "Job job-004 enqueued (priority=medium, ETA ~90m)" },
  { ts: "08:14:21.190", level: "INFO", tag: "crawl:002", msg: "Crunchbase batch 88% complete — 8,924 records · 3 errors" },
  { ts: "08:14:19.842", level: "WARN", tag: "worker:W06", msg: "Heartbeat missed (3/3) — marking unhealthy, redistributing jobs" },
  { ts: "08:14:18.401", level: "INFO", tag: "crm:sync", msg: "HubSpot sync: 412 contacts pushed · 0 conflicts" },
  { ts: "08:14:16.774", level: "DEBUG", tag: "nlp", msg: "Named entity extraction: org=Stripe, loc=SF, role=VP_ENG" },
];

// ─── Shared UI ─────────────────────────────────────────────────────────────

function Card({ children, className = "", noPad = false }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div className={`rounded-xl ${noPad ? "" : "p-5"} ${className}`}
      style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: m.bg, color: m.color }}>
      <Icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const c = priority === "high" ? C.error : priority === "medium" ? C.warning : C.muted;
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />;
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${color}20` }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: color }} />
    </div>
  );
}

function LogLine({ ts, level, tag, msg }: { ts: string; level: string; tag: string; msg: string }) {
  const levelColor = level === "ERROR" ? C.logRed : level === "WARN" ? C.logYellow : level === "DEBUG" ? C.logMuted : C.logGreen;
  return (
    <div className="flex gap-2 py-0.5 text-xs font-mono leading-5 hover:bg-white/5 px-3 rounded transition-colors">
      <span style={{ color: C.logMuted, flexShrink: 0 }}>{ts}</span>
      <span className="font-bold w-12 flex-shrink-0 text-right" style={{ color: levelColor }}>{level}</span>
      <span className="flex-shrink-0 px-1.5 rounded text-xs" style={{ backgroundColor: "#ffffff0d", color: C.logBlue }}>{tag}</span>
      <span style={{ color: C.logText }}>{msg}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function CrawlPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [logsLive, setLogsLive] = useState(true);
  const [logFilter, setLogFilter] = useState<"all" | "INFO" | "WARN" | "ERROR" | "DEBUG">("all");
  const [ackedAlerts, setAckedAlerts] = useState<number[]>([2, 3]);
  const [showNewCrawl, setShowNewCrawl] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [crawlResult, setCrawlResult] = useState<any>(null);
  const [crawlHistory, setCrawlHistory] = useState<any[]>([]);
  const [crawlStats, setCrawlStats] = useState<any>(null);
  const [crawlStatus, setCrawlStatus] = useState<any>(null);

useEffect(() => {
  loadCrawlData();
}, []);

const loadCrawlData = async () => {
  try {
    const stats = await getCrawlStats();
    const history = await getCrawlHistory();
    const status = await getCrawlStatus();

    setCrawlStats(stats);
    setCrawlHistory(history); // Uses your existing state
    setCrawlStatus(status);
    
    setJobs(history);

  } catch (error) {
    console.error(error);
  }
};

  const running = jobs.filter((j) => j.status === "running").length;
  const failed = jobs.filter((j) => j.status === "failed").length;
  const throttled = jobs.filter((j) => j.status === "throttled").length;
  const totalRecords = jobs.reduce((s, j) => s + j.records, 0);
  const activeWorkers = WORKERS.filter((w) => w.status === "active").length;

  const updateJob = (id: string, patch: Partial<CrawlJob>) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const filteredLogs = logFilter === "all" ? LOG_LINES : LOG_LINES.filter((l) => l.level === logFilter);

  const tooltipStyle = { backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 };

const handleStartCrawler = async () => {
  if (!websiteUrl) {
    alert("Please enter a website URL");
    return;
  }

  setLoading(true);

  try {
    const result = await startCrawl(websiteUrl);

    console.log(result);

    // Show beautiful result card
  setCrawlResult(result);

  setCrawlHistory((prev) => [
    result,
    ...prev,
]);


    setJobs((prev) => [
      {
        id: result.job.id.toString(),
        name: result.job.title,
        source: "Website",
        target: result.job.url,
        status: "completed",
        progress: 100,
        records: 1,
        errors: 0,
        speed: 0,
        workers: 1,
        started: "Just Now",
        eta: "Done",
        retries: 0,
        priority: "medium",
      },
      ...prev,
    ]);

  } catch (error) {
    console.error(error);
    alert("Crawler Failed");
  }

  setLoading(false);
};
  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="p-5 space-y-5 max-w-screen-2xl mx-auto">
  {crawlResult && (
  <div
    className="rounded-xl p-6 mb-5"
    style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    }}
  >
    <h2
      className="text-xl font-bold mb-5"
      style={{ color: "#10B981" }}
    >
      ✅ Crawl Completed Successfully
    </h2>

    <div className="grid grid-cols-2 gap-6">

      <div>
        <p className="text-xs text-gray-500">Company</p>
        <p className="font-semibold">
          {crawlResult.lead.company_name}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Website</p>
        <p className="font-semibold">
          {crawlResult.lead.website}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Status</p>
        <p className="font-semibold text-green-600">
          {crawlResult.job.status}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">HTTP Status</p>
        <p className="font-semibold">
          {crawlResult.job.status_code}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Industry</p>
        <p className="font-semibold">
          {crawlResult.lead.industry}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Company Size</p>
        <p className="font-semibold">
          {crawlResult.lead.company_size}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Lead Quality</p>
        <p className="font-semibold">
          {crawlResult.lead.lead_quality}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Priority</p>
        <p className="font-semibold">
          {crawlResult.score.priority}
        </p>
      </div>

    </div>

    <div className="mt-6">
      <p className="text-sm font-semibold mb-2">
        AI Lead Score
      </p>

      <div
        className="w-full rounded-full h-4"
        style={{ backgroundColor: "#E2E8F0" }}
      >
        <div
          className="h-4 rounded-full"
          style={{
            width: `${crawlResult.score.lead_score}%`,
            backgroundColor: "#2563EB",
          }}
        />
      </div>

      <p className="mt-2 font-bold text-lg">
        {crawlResult.score.lead_score}/100
      </p>
    </div>

    <div className="mt-6">
      <p className="font-semibold mb-2">
        AI Reasons
      </p>

      <ul className="list-disc ml-5">
        {crawlResult.score.reasons.map(
          (reason: string, index: number) => (
            <li key={index}>{reason}</li>
          )
        )}
      </ul>
    </div>
  </div>
)}
{crawlHistory.length > 0 && (
  <div className="mt-8">

    <h2 className="text-xl font-bold mb-4">
      Recent Crawl Jobs
    </h2>

    <table className="w-full border rounded-lg overflow-hidden">

      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Company</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Score</th>
          <th className="p-3 text-left">Website</th>
        </tr>
      </thead>

      <tbody>
        {crawlHistory.map((item) => (

          <tr
            key={item.job.id}
            className="border-t hover:bg-gray-50"
          >

            <td className="p-3">
              {item.job.id}
            </td>

            <td className="p-3">
              {item.lead.company_name}
            </td>

            <td className="p-3">
              {item.job.status}
            </td>

            <td className="p-3">
              {item.score.lead_score}
            </td>

            <td className="p-3">
              {item.lead.website}
            </td>

          </tr>

        ))}
      </tbody>

    </table>

  </div>
)}

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.primary}14` }}>
                  <Activity className="w-4 h-4" style={{ color: C.primary }} />
                </div>
                <h2 className="font-bold text-xl" style={{ color: C.text }}>Crawl Monitor</h2>
              </div>

              {/* Live status chips */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: `${C.primary}14`, color: C.primary }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.primary }} />
                  {running} Running
                </span>
                {failed > 0 && (
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: `${C.error}14`, color: C.error }}>
                    <XCircle className="w-3 h-3" /> {failed} Failed
                  </span>
                )}
                {throttled > 0 && (
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: `${C.orange}14`, color: C.orange }}>
                    <AlertTriangle className="w-3 h-3" /> {throttled} Throttled
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm" style={{ color: C.muted }}>
              Real-time monitoring for crawl jobs, enrichment pipelines, and worker health.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.error; e.currentTarget.style.color = C.error; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
              <Square className="w-3.5 h-3.5" /> Stop All
            </button>
            <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.success; e.currentTarget.style.color = C.success; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
              <Play className="w-3.5 h-3.5" /> Resume All
            </button>
            <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm border transition-colors"
              style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <input
  type="text"
  placeholder="https://example.com"
  value={websiteUrl}
  onChange={(e) => setWebsiteUrl(e.target.value)}
  className="h-9 w-72 px-3 rounded-lg border text-sm outline-none"
  style={{
    borderColor: C.border,
    backgroundColor: C.white,
    color: C.text,
  }}
/>
           <button
  onClick={handleStartCrawler}
  className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold transition-colors"
  style={{ backgroundColor: C.primary, color: "#fff" }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
>
  <Plus className="w-3.5 h-3.5" />
  Start Crawl
</button>

        {/* ── KPI strip ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {[
            { label: "Pages / Hour", value: "47.2K", icon: Globe, color: C.primary, sub: "Live throughput" },
            { label: "Records Extracted", value: totalRecords.toLocaleString(), icon: Database, color: C.success, sub: "Across all active jobs" },
            { label: "Active Workers", value: `${activeWorkers} / ${WORKERS.length}`, icon: Server, color: C.purple, sub: "1 in error state" },
            { label: "Queue Depth", value: "5,010", icon: Layers, color: C.warning, sub: "Across 6 queues" },
            { label: "Avg Crawl Latency", value: "142ms", icon: Gauge, color: C.teal, sub: "p50 response time" },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <Card key={label}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${C.success}14`, color: C.success }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> Live
                </span>
              </div>
              <p className="text-xl font-black" style={{ color: C.text }}>{value}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: C.muted }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: `${C.muted}99` }}>{sub}</p>
            </Card>
          ))}
        </div>

        {/* ── Rate chart ─────────────────────────────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Crawl Rate — Last 60 Minutes</h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>Pages / minute across all active workers</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.primary }} />Throughput</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.error }} />Errors</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={crawlRateHistory} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gErr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.error} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={C.error} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: C.border }} />
              <Area type="monotone" dataKey="rate" name="Throughput" stroke={C.primary} strokeWidth={2} fill="url(#gRate)" />
              <Area type="monotone" dataKey="errors" name="Errors" stroke={C.error} strokeWidth={1.5} fill="url(#gErr)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* ── Active Crawl Table ─────────────────────────────────────────── */}
        <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-2"
            style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Crawl Jobs</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: `${C.primary}14`, color: C.primary }}>{jobs.length} jobs</span>
            </div>
            <button className="flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg border"
              style={{ borderColor: C.border, color: C.muted }}>
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  {["", "Job / Source", "Status", "Progress", "Records", "Errors", "Speed", "Workers", "ETA", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: C.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const prog = job.progress;
                  const progColor = job.status === "failed" ? C.error : job.status === "completed" ? C.success : job.status === "throttled" ? C.orange : job.status === "paused" ? C.warning : C.primary;
                  return (
                    <tr key={job.id} className="group transition-colors"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>

                      <td className="pl-4 py-4 pr-1 w-5">
                        <PriorityDot priority={job.priority} />
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-xs" style={{ color: C.text }}>{job.name}</p>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: C.muted }}>
                          <Globe className="w-3 h-3" />{job.target}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: `${C.muted}88` }}>
                          Started {job.started} {job.retries > 0 && <span style={{ color: C.warning }}>· {job.retries} retries</span>}
                        </p>
                      </td>

                      <td className="px-4 py-4"><StatusBadge status={job.status} /></td>

                      <td className="px-4 py-4 min-w-[120px]">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span style={{ color: C.muted }}>{prog}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden w-24" style={{ backgroundColor: `${progColor}18` }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, backgroundColor: progColor }} />
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-semibold" style={{ color: C.text }}>
                        {job.records.toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold" style={{ color: job.errors > 20 ? C.error : job.errors > 5 ? C.warning : C.success }}>
                          {job.errors}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs" style={{ color: C.muted }}>
                        {job.speed > 0 ? <><span className="font-semibold" style={{ color: C.text }}>{job.speed}</span> req/s</> : "—"}
                      </td>

                      <td className="px-4 py-4 text-xs" style={{ color: C.muted }}>
                        {job.workers > 0 ? <><span className="font-semibold" style={{ color: C.text }}>{job.workers}</span> active</> : "—"}
                      </td>

                      <td className="px-4 py-4 text-xs font-medium" style={{ color: C.textSec }}>{job.eta}</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {job.status === "running" && (
                            <button onClick={() => updateJob(job.id, { status: "paused", speed: 0, workers: 0 })}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: C.muted, border: `1px solid ${C.border}` }}
                              title="Pause"
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.warning)}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
                              <Pause className="w-3 h-3" />
                            </button>
                          )}
                          {(job.status === "paused" || job.status === "failed" || job.status === "throttled") && (
                            <button onClick={() => updateJob(job.id, { status: "running", speed: 400, workers: 4 })}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: C.muted, border: `1px solid ${C.border}` }}
                              title="Resume"
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.success)}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
                              <Play className="w-3 h-3" />
                            </button>
                          )}
                          {job.status === "queued" && (
                            <button onClick={() => updateJob(job.id, { status: "running", speed: 500, workers: 5 })}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: C.muted, border: `1px solid ${C.border}` }}
                              title="Start now"
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.primary)}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
                              <SkipForward className="w-3 h-3" />
                            </button>
                          )}
                          {["running", "paused"].includes(job.status) && (
                            <button onClick={() => updateJob(job.id, { status: "failed", speed: 0, workers: 0 })}
                              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                              style={{ color: C.muted, border: `1px solid ${C.border}` }}
                              title="Stop"
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.error)}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
                              <Square className="w-3 h-3" />
                            </button>
                          )}
                          <button className="w-7 h-7 rounded-md flex items-center justify-center"
                            style={{ color: C.muted, border: `1px solid ${C.border}` }}>
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Queue + Workers ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Queue cards */}
          <Card noPad>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>Queue Status</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${C.muted}12`, color: C.muted }}>Redis-backed</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: C.success }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> Live
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {QUEUES.map((q) => {
                const total = q.pending + q.processing;
                const pct = total > 0 ? (q.processing / total) * 100 : 0;
                const healthColor = q.health === "healthy" ? C.success : q.health === "degraded" ? C.warning : C.error;
                return (
                  <div key={q.name} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs font-mono font-semibold" style={{ color: C.primary }}>{q.name}</code>
                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{ backgroundColor: `${healthColor}14`, color: healthColor }}>
                          {q.health}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: C.muted }}>
                        <span><span className="font-semibold" style={{ color: C.text }}>{q.pending}</span> pending</span>
                        <span><span className="font-semibold" style={{ color: C.primary }}>{q.processing}</span> processing</span>
                        {q.failed > 0 && <span><span className="font-semibold" style={{ color: C.error }}>{q.failed}</span> failed</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <MiniBar value={q.processing} max={q.pending + q.processing + 1} color={C.primary} />
                      <p className="text-xs mt-1" style={{ color: C.muted }}>{Math.round(pct)}% active</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Worker grid */}
          <Card noPad>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>Worker Health</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${C.success}14`, color: C.success }}>
                  {activeWorkers}/{WORKERS.length} active
                </span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORKERS.map((w) => {
                const statusColor = w.status === "active" ? C.success : w.status === "idle" ? C.muted : C.error;
                const cpuColor = w.cpu > 85 ? C.error : w.cpu > 65 ? C.warning : C.success;
                return (
                  <div key={w.id} className="p-3.5 rounded-xl"
                    style={{ border: `1.5px solid ${w.status === "error" ? `${C.error}40` : C.border}`, backgroundColor: w.status === "error" ? `${C.error}06` : C.bg }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" style={{ color: statusColor }} />
                        <code className="text-xs font-mono font-bold" style={{ color: C.text }}>{w.id}</code>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                        style={{ backgroundColor: `${statusColor}14`, color: statusColor }}>
                        {w.status}
                      </span>
                    </div>
                    {w.status !== "error" ? (
                      <>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
                          <div>
                            <p style={{ color: C.muted }}>CPU</p>
                            <p className="font-bold" style={{ color: cpuColor }}>{w.cpu}%</p>
                          </div>
                          <div>
                            <p style={{ color: C.muted }}>Memory</p>
                            <p className="font-bold" style={{ color: C.text }}>{w.mem}%</p>
                          </div>
                          <div>
                            <p style={{ color: C.muted }}>Jobs</p>
                            <p className="font-bold" style={{ color: C.text }}>{w.jobs}</p>
                          </div>
                          <div>
                            <p style={{ color: C.muted }}>Speed</p>
                            <p className="font-bold" style={{ color: C.text }}>{w.speed > 0 ? `${w.speed}/s` : "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <MiniBar value={w.cpu} color={cpuColor} />
                          <span className="text-xs" style={{ color: C.muted }}>Up {w.uptime}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs" style={{ color: C.error }}>
                        <p className="font-semibold">Heartbeat lost</p>
                        <p style={{ color: C.muted }}>Auto-restart in progress</p>
                        <button className="mt-2 flex items-center gap-1 hover:underline" style={{ color: C.primary }}>
                          <RotateCcw className="w-3 h-3" /> Force restart
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Logs + Pipeline ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Logs panel */}
          <div className="xl:col-span-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            {/* Logs toolbar */}
            <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2"
              style={{ backgroundColor: C.navy, borderBottom: `1px solid #1E293B` }}>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: "#94A3B8" }} />
                <span className="text-sm font-semibold" style={{ color: "#F8FAFC" }}>Live Logs</span>
                {logsLive && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${C.success}25`, color: C.success }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> Live
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Level filter */}
                <div className="flex gap-1">
                  {(["all", "INFO", "WARN", "ERROR", "DEBUG"] as const).map((f) => (
                    <button key={f}
                      onClick={() => setLogFilter(f)}
                      className="text-xs px-2 py-1 rounded font-mono font-semibold transition-colors"
                      style={{
                        backgroundColor: logFilter === f ? (f === "ERROR" ? C.logRed : f === "WARN" ? C.logYellow : f === "DEBUG" ? "#30363D" : "#1F6FEB") + "30" : "transparent",
                        color: logFilter === f ? (f === "ERROR" ? C.logRed : f === "WARN" ? C.logYellow : f === "DEBUG" ? C.logMuted : C.logBlue) : C.logMuted,
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={() => setLogsLive((l) => !l)}
                  className="text-xs px-2 py-1 rounded font-medium"
                  style={{ backgroundColor: logsLive ? "#ffffff12" : "#ffffff08", color: logsLive ? C.logGreen : C.logMuted }}>
                  {logsLive ? "⏸ Pause" : "▶ Resume"}
                </button>
              </div>
            </div>
            {/* Log lines */}
            <div ref={logRef} className="overflow-y-auto py-2" style={{ backgroundColor: C.logBg, height: 320 }}>
              {filteredLogs.map((line, i) => <LogLine key={i} {...line} />)}
            </div>
          </div>

          {/* AI Pipeline */}
          <Card noPad>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: C.text }}>AI Pipeline</h3>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Stage health & throughput</p>
              </div>
            </div>
            <div className="p-4 space-y-1">
              {PIPELINE_STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const statusColor = stage.status === "running" ? C.success : stage.status === "degraded" ? C.warning : C.muted;
                const healthColor = stage.health >= 95 ? C.success : stage.health >= 80 ? C.warning : C.error;
                const isLast = i === PIPELINE_STAGES.length - 1;
                return (
                  <div key={stage.name}>
                    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                      style={{ border: `1px solid ${stage.status === "degraded" ? `${C.warning}35` : C.border}`, backgroundColor: stage.status === "degraded" ? `${C.warning}06` : "transparent" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${stage.color}14` }}>
                        <Icon className="w-4 h-4" style={{ color: stage.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold" style={{ color: C.text }}>{stage.name}</p>
                          <span className="text-xs font-semibold" style={{ color: healthColor }}>{stage.health}%</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5 text-xs" style={{ color: C.muted }}>
                          <span>{stage.throughput}</span>
                          <span className="capitalize" style={{ color: statusColor }}>{stage.status}</span>
                        </div>
                        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${healthColor}20` }}>
                          <div className="h-full rounded-full" style={{ width: `${stage.health}%`, backgroundColor: healthColor }} />
                        </div>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex justify-center py-0.5">
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" style={{ color: C.border }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Alerts ─────────────────────────────────────────────────────── */}
        <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Alerts & Notifications</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: `${C.error}14`, color: C.error }}>
                {ALERTS.filter((a) => !ackedAlerts.includes(a.id)).length} unacknowledged
              </span>
            </div>
            <button onClick={() => setAckedAlerts(ALERTS.map((a) => a.id))}
              className="text-xs hover:underline" style={{ color: C.primary }}>
              Ack all
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {ALERTS.map((alert) => {
              const Icon = alert.icon;
              const acked = ackedAlerts.includes(alert.id);
              return (
                <div key={alert.id}
                  className="px-5 py-4 flex items-start gap-4 transition-colors"
                  style={{ opacity: acked ? 0.5 : 1 }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${alert.color}14` }}>
                    <Icon className="w-4 h-4" style={{ color: alert.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold" style={{ color: C.text }}>{alert.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color: C.muted }}>{alert.time}</span>
                        {!acked && (
                          <button onClick={() => setAckedAlerts((a) => [...a, alert.id])}
                            className="text-xs px-2 py-0.5 rounded font-medium hover:opacity-80"
                            style={{ backgroundColor: `${C.primary}14`, color: C.primary }}>
                            Ack
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mt-0.5 leading-relaxed" style={{ color: C.textSec }}>{alert.detail}</p>
                    {alert.sev === "error" && !acked && (
                      <div className="flex items-center gap-2 mt-2">
                        <button className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: C.primary }}>
                          <RotateCcw className="w-3 h-3" /> Retry job
                        </button>
                        <span style={{ color: C.border }}>·</span>
                        <button className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: C.muted }}>
                          <Eye className="w-3 h-3" /> View logs
                        </button>

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>

  );
}
