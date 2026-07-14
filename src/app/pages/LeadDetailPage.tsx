import { useEffect, useState } from "react";
import { getLead } from "../../api/leadApi";
import {
  ArrowLeft, Globe, Linkedin, Twitter, Mail, Phone, MapPin, Users,
  Building2, TrendingUp, Brain, Star, Download, Send, Clock,
  CheckCircle2, AlertCircle, Sparkles, ExternalLink, Tag, Plus,
  Zap, BarChart3, Shield, Target, Activity, Cpu, Cloud, Code2,
  ChevronRight, Copy, RefreshCw, UserPlus, Bookmark, MoreHorizontal,
  MessageSquare, Hash, Flame, Eye, GitBranch, Database, Layers,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
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
};

// ─── Data ────────────────────────────────────────────────────────────────────

const radarData = [
  { axis: "Revenue Fit", value: 92 },
  { axis: "Tech Stack", value: 78 },
  { axis: "Growth", value: 88 },
  { axis: "Decision Maker", value: 95 },
  { axis: "Intent", value: 73 },
  { axis: "Timing", value: 85 },
];

const intentHistory = [
  { week: "W1", score: 54 },
  { week: "W2", score: 61 },
  { week: "W3", score: 58 },
  { week: "W4", score: 69 },
  { week: "W5", score: 75 },
  { week: "W6", score: 80 },
  { week: "W7", score: 88 },
  { week: "W8", score: 94 },
];

const contacts = [
  { id: 1, name: "Alex Martinez", role: "VP of Engineering", email: "alex@stripe.com", phone: "+1 (415) 555-0182", linkedin: "linkedin.com/in/alexm", confidence: 97, status: "verified", initials: "AM", color: C.primary, isDecision: true },
  { id: 2, name: "Diana Ross", role: "Chief Financial Officer", email: "diana@stripe.com", phone: "+1 (415) 555-0193", linkedin: "linkedin.com/in/dianaross", confidence: 91, status: "verified", initials: "DR", color: C.success, isDecision: true },
  { id: 3, name: "Raj Patel", role: "Director of Partnerships", email: "raj@stripe.com", phone: "+1 (415) 555-0155", linkedin: "linkedin.com/in/rajpatel", confidence: 82, status: "guessed", initials: "RP", color: C.purple, isDecision: false },
  { id: 4, name: "Lisa Wang", role: "Head of Sales", email: "lisa@stripe.com", phone: "+1 (415) 555-0177", linkedin: "linkedin.com/in/lisawang", confidence: 88, status: "verified", initials: "LW", color: C.teal, isDecision: false },
];

const timeline = [
  { type: "ai", icon: Brain, color: C.purple, title: "AI score updated to 94", detail: "Score increased from 81 → 94 due to Series I funding announcement and 3 new VP hires.", time: "2 hours ago" },
  { type: "enrich", icon: Sparkles, color: C.primary, title: "Lead re-enriched", detail: "Updated contact data, firmographics, and technology stack across 200+ data sources.", time: "5 hours ago" },
  { type: "crawl", icon: Globe, color: C.teal, title: "Website recrawled", detail: "Discovered 3 new product pages, updated pricing signals, and found 2 new job postings.", time: "8 hours ago" },
  { type: "intent", icon: Flame, color: C.warning, title: "Intent signal detected", detail: "Company employees searched for 'API integration platform' and 'developer tooling' 12 times.", time: "1 day ago" },
  { type: "verify", icon: CheckCircle2, color: C.success, title: "Email verified", detail: "alex@stripe.com confirmed via MX record + SMTP handshake validation.", time: "2 days ago" },
  { type: "crm", icon: RefreshCw, color: C.muted, title: "Synced to HubSpot", detail: "Lead data pushed to HubSpot CRM — contact and company records updated.", time: "3 days ago" },
  { type: "discover", icon: Target, color: "#F97316", title: "Lead discovered", detail: "Found via LinkedIn crawl — Series B funding announcement matched your target criteria.", time: "5 days ago" },
];

const techStack = {
  "Frontend": [
    { name: "React", icon: "⚛", color: "#61DAFB" },
    { name: "TypeScript", icon: "TS", color: "#3178C6" },
    { name: "Next.js", icon: "N", color: "#000" },
    { name: "Tailwind CSS", icon: "🎨", color: "#06B6D4" },
  ],
  "Backend": [
    { name: "Node.js", icon: "⬡", color: "#339933" },
    { name: "Ruby on Rails", icon: "💎", color: "#CC0000" },
    { name: "GraphQL", icon: "◈", color: "#E10098" },
    { name: "PostgreSQL", icon: "🐘", color: "#336791" },
  ],
  "Cloud & Infra": [
    { name: "AWS", icon: "☁", color: "#FF9900" },
    { name: "Cloudflare", icon: "🔶", color: "#F38020" },
    { name: "Kubernetes", icon: "⎈", color: "#326CE5" },
    { name: "Terraform", icon: "🔷", color: "#7B42BC" },
  ],
  "Analytics & AI": [
    { name: "Segment", icon: "S", color: "#52BD94" },
    { name: "Amplitude", icon: "A", color: "#4A90E2" },
    { name: "OpenAI", icon: "◉", color: "#10A37F" },
    { name: "Datadog", icon: "🐶", color: "#632CA6" },
  ],
  "Business Tools": [
    { name: "Salesforce", icon: "☁", color: "#00A1E0" },
    { name: "Intercom", icon: "💬", color: "#1F8DED" },
    { name: "Slack", icon: "#", color: "#4A154B" },
    { name: "Stripe", icon: "S", color: "#6772E5" },
  ],
};


const notes = [
  { id: 1, author: "James Doe", initials: "JD", color: C.primary, time: "2 hours ago", text: "Alex mentioned they're evaluating alternatives in Q3. Follow up with the enterprise case study deck." },
  { id: 2, author: "Sarah Kim", initials: "SK", color: C.success, time: "Yesterday", text: "Reached out on LinkedIn — connected. Waiting for reply on intro call request." },
];

const TAGS = ["Enterprise", "High Priority", "Series I", "Decision Maker Found", "FinTech"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: 1, backgroundColor: C.border }} />;
}

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

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold" style={{ color: C.text }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
      style={{ color: copied ? C.success : C.muted }}
    >
      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function ConfidenceDot({ score }: { score: number }) {
  const color = score >= 90 ? C.success : score >= 75 ? C.warning : C.error;
  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {score}%
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
interface LeadDetailPageProps {
  leadId: number | null;
  onBack: () => void;
}


type Tab = "overview" | "contacts" | "insights" | "activity";

 export function LeadDetailPage({ leadId, onBack }: LeadDetailPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [saved, setSaved] = useState(false);
  const [tags, setTags] = useState(TAGS);
  const [noteText, setNoteText] = useState("");
  const [allNotes, setAllNotes] = useState(notes);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagexport, setNewTag] = useState("");
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  if (!leadId) return;

  const fetchLead = async () => {
    try {
      setLoading(true);
      const data = await getLead(leadId);
      setLead(data);
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLead();
}, [leadId]);
if (loading) {
  return (
    <div className="p-6">
      Loading lead details...
    </div>
  );
}
  const aiInsights = [
  {
    icon: Brain,
    color: C.primary,
    label: "Lead Score",
    text: `AI evaluated this company with a score of ${lead?.score || 0}.`,
    confidence: lead?.score || 0,
  },
  {
    icon: TrendingUp,
    color: C.success,
    label: "Industry",
    text: `Industry detected: ${lead?.industry || "Unknown"}.`,
    confidence: 90,
  },
  {
    icon: Building2,
    color: C.warning,
    label: "Company Size",
    text: `Estimated company size: ${lead?.company_size || "Unknown"}.`,
    confidence: 85,
  },
  {
    icon: CheckCircle2,
    color: C.teal,
    label: "Lead Quality",
    text: `Overall lead quality is ${lead?.lead_quality || "Unknown"}.`,
    confidence: 80,
  },
  {
    icon: Globe,
    color: C.purple,
    label: "Website",
    text: lead?.website || "Website not available.",
    confidence: 100,
  },
];

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "contacts", label: `Contacts (${contacts.length})` },
    { id: "insights", label: "AI Insights" },
    { id: "activity", label: "Activity" },
  ];

  const addNote = () => {
    if (!noteText.trim()) return;
    setAllNotes((n) => [
      { id: Date.now(), author: "James Doe", initials: "JD", color: C.primary, time: "Just now", text: noteText.trim() },
      ...n,
    ]);
    setNoteText("");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((t) => [...t, newTag.trim()]);
    }
    setNewTag("");
    setAddingTag(false);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.bg }}>
      <div className="max-w-screen-2xl mx-auto">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-20 px-6 py-4"
          style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-start gap-4 flex-wrap">
            {/* Back + identity */}
            <div className="flex-1 min-w-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs mb-3 transition-colors hover:underline"
                style={{ color: C.muted }}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Lead Search
              </button>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Logo */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-sm"
                  style={{ background: "linear-gradient(135deg, #6772E5 0%, #4A4FD4 100%)" }}
                >
                  S
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-bold text-xl" style={{ color: C.text }}>{lead?.company_name} Inc.</h2>

                    {/* AI Score badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${C.success}14`, border: `1.5px solid ${C.success}35` }}
                    >
                      <Brain className="w-3.5 h-3.5" style={{ color: C.success }} />
                      <span className="text-sm font-black" style={{ color: C.success }}>94</span>
                      <span className="text-xs font-medium" style={{ color: C.success }}>AI Score</span>
                    </div>

                    {/* Verified */}
                    <span
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${C.primary}12`, color: C.primary, border: `1px solid ${C.primary}25` }}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>

                    {/* Status */}
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${C.error}12`, color: C.error }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.error }} />
                      Hot Lead
                    </span>
                  </div>

                 <div
  className="flex items-center gap-4 mt-1.5 flex-wrap text-sm"
  style={{ color: C.muted }}
>
  <span className="flex items-center gap-1">
    <Building2 className="w-3.5 h-3.5" />
    {lead?.industry || "Unknown"}
  </span>

  <span className="flex items-center gap-1">
    <Users className="w-3.5 h-3.5" />
    {lead?.company_size || "Unknown"}
  </span>

  <span className="flex items-center gap-1">
    ⭐ Score: {lead?.score || 0}
  </span>

  <a
    href={lead?.website || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1 hover:underline"
    style={{ color: C.primary }}
  >
    <Globe className="w-3.5 h-3.5" />
    {lead?.website || "No Website"}
  </a>
</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
              <button
                onClick={() => setSaved((s) => !s)}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  border: `1px solid ${saved ? C.warning : C.border}`,
                  color: saved ? C.warning : C.muted,
                  backgroundColor: saved ? `${C.warning}10` : C.white,
                }}
              >
                <Star className="w-3.5 h-3.5" fill={saved ? C.warning : "none"} />
                {saved ? "Saved" : "Save"}
              </button>

              <button
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
              >
                <UserPlus className="w-3.5 h-3.5" /> Campaign
              </button>

              <button
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.color = C.teal; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> CRM Sync
              </button>

              <button
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>

              <button
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: C.primary, color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.primary)}
              >
                <Send className="w-3.5 h-3.5" /> Reach Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-4" style={{ borderBottom: `1px solid ${C.border}`, marginBottom: -1 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
                style={{
                  borderColor: activeTab === tab.id ? C.primary : "transparent",
                  color: activeTab === tab.id ? C.primary : C.muted,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="p-6">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

              {/* Left — 2 cols */}
              <div className="xl:col-span-2 space-y-5">

                {/* Company overview card */}
                <Card>
                  <SectionHeader title="Company Overview" subtitle="Enriched from 200+ data sources" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                   {[
                      { label: "Company", value: lead?.company_name || "Unknown" },
                      { label: "Website", value: lead?.website || "N/A" },
                      { label: "Industry", value: lead?.industry || "Unknown" },
                      { label: "Company Size", value: lead?.company_size || "Unknown" },
                      { label: "Lead Score", value: lead?.score || "0" },
                      { label: "Lead Quality", value: lead?.lead_quality || "Unknown" },
                      { label: "Status", value: lead?.status || "New" },
                      { label: "Phone", value: lead?.phone || "Not Available" },
                      { label: "Email", value: lead?.email || "Not Available" },
  ].map(({ label, value }) => (
    <div key={label}>
      <p
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: C.muted }}
      >
        {label}
      </p>

      <p
        className="text-sm font-semibold mt-1"
        style={{ color: C.text }}
      >
        {value}
      </p>
    </div>
    
  ))}
</div>

                  <Divider />
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: C.muted }}>Description</p>
                    <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>
                    {lead?.company_name} was discovered using the AI Lead Generation crawler.
                    Company information shown below is enriched automatically from the crawl
                  results and backend enrichment service.
                    </p>
                  </div>

                  <Divider />
              <div className="mt-4 flex items-center gap-5 flex-wrap">
                 <a
                 href={lead?.website || "#"}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                 style={{ color: C.primary }}
                 >
                <Globe className="w-4 h-4" />
                {lead?.website || "No Website"}
                 </a>
</div>
                </Card>

                {/* Tech stack */}
                <Card>
                  <SectionHeader
                    title="Technology Stack"
                    subtitle="Detected across website, job postings, and public repos"
                    action={
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${C.teal}14`, color: C.teal }}>
                        {Object.values(techStack).flat().length} tools detected
                      </span>
                    }
                  />
                  <div className="space-y-4">
                    {Object.entries(techStack).map(([category, tools]) => {
                      const catIcon: Record<string, typeof Code2> = {
                        "Frontend": Code2,
                        "Backend": Database,
                        "Cloud & Infra": Cloud,
                        "Analytics & AI": BarChart3,
                        "Business Tools": Layers,
                      };
                      const Icon = catIcon[category] ?? Cpu;
                      return (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5" style={{ color: C.muted }} />
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{category}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tools.map((tool) => (
                              <span
                                key={tool.name}
                                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium border"
                                style={{ backgroundColor: C.bg, borderColor: C.border, color: C.text }}
                              >
                                <span className="text-[11px] font-bold" style={{ color: tool.color }}>{tool.icon}</span>
                                {tool.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Notes & Tags */}
                <Card>
                  <SectionHeader title="Notes & Tags" subtitle="Internal team collaboration" />

                  {/* Tags */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: C.muted }}>Tags</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium cursor-default"
                          style={{ backgroundColor: `${C.purple}10`, color: C.purple, border: `1px solid ${C.purple}25` }}
                        >
                          <Hash className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                            className="ml-0.5 opacity-60 hover:opacity-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {addingTag ? (
                        <input
                          autoFocus
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addTag(); if (e.key === "Escape") setAddingTag(false); }}
                          onBlur={addTag}
                          placeholder="Tag name..."
                          className="text-xs px-2.5 py-1 rounded-full border focus:outline-none"
                          style={{ borderColor: C.primary, color: C.text, width: 100 }}
                        />
                      ) : (
                        <button
                          onClick={() => setAddingTag(true)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors"
                          style={{ border: `1px dashed ${C.border}`, color: C.muted }}
                        >
                          <Plus className="w-3 h-3" /> Add tag
                        </button>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* Add note */}
                  <div className="mt-4 mb-4">
                    <div
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.primary }}>
                        JD
                      </div>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }}
                        placeholder="Add a note... (⌘Enter to submit)"
                        rows={2}
                        className="flex-1 bg-transparent resize-none focus:outline-none text-sm"
                        style={{ color: C.text }}
                      />
                      {noteText && (
                        <button
                          onClick={addNote}
                          className="self-end px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: C.primary, color: "#fff" }}
                        >
                          Post
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes list */}
                  <div className="space-y-3">
                    {allNotes.map((note) => (
                      <div key={note.id} className="flex gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: note.color }}
                        >
                          {note.initials}
                        </div>
                        <div
                          className="flex-1 p-3 rounded-xl"
                          style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold" style={{ color: C.text }}>{note.author}</span>
                            <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}>
                              <Clock className="w-3 h-3" /> {note.time}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right — 1 col */}
              <div className="space-y-5">

                {/* AI Score card */}
                <Card>
                  <SectionHeader title="AI Lead Score" subtitle="Multi-dimensional fit analysis" />

                  <div className="text-center mb-5">
                    <div
                      className="w-24 h-24 rounded-full mx-auto flex flex-col items-center justify-center border-4"
                      style={{ borderColor: C.success, backgroundColor: `${C.success}10` }}
                    >
                      <span className="text-3xl font-black" style={{ color: C.success }}>94</span>
                      <span className="text-xs font-medium" style={{ color: C.success }}>Excellent</span>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={190}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                      <PolarGrid stroke={C.border} />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: C.muted }} />
                      <Radar dataKey="value" stroke={C.primary} fill={C.primary} fillOpacity={0.15} strokeWidth={1.5} />
                      <Tooltip contentStyle={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>

                  <div className="space-y-2 mt-2">
                    {radarData.map(({ axis, value }) => {
                      const color = value >= 85 ? C.success : value >= 70 ? C.primary : C.warning;
                      return (
                        <div key={axis} className="flex items-center gap-2">
                          <span className="text-xs w-28 flex-shrink-0" style={{ color: C.muted }}>{axis}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-xs w-7 text-right font-bold" style={{ color }}>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Intent trend */}
                <Card>
                  <SectionHeader title="Intent Trend" subtitle="Buying signal strength (8 weeks)" />
                  <ResponsiveContainer width="100%" height={130}>
                    <LineChart data={intentHistory} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} cursor={{ stroke: C.border }} />
                      <Line type="monotone" dataKey="score" stroke={C.warning} strokeWidth={2.5} dot={{ r: 3, fill: C.warning }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span style={{ color: C.muted }}>Intent increasing</span>
                    <span className="font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${C.success}14`, color: C.success }}>
                      ↑ +74% this month
                    </span>
                  </div>
                </Card>

                {/* Quick contact */}
                <Card>
                  <SectionHeader
                    title="Key Contact"
                    action={
                      <button className="text-xs" style={{ color: C.primary }} onClick={() => setActiveTab("contacts")}>
                        All contacts →
                      </button>
                    }
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: C.primary }}>
                      AM
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>Alex Martinez</p>
                      <p className="text-xs" style={{ color: C.muted }}>VP of Engineering</p>
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${C.success}14`, color: C.success }}>
                        Decision Maker
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {
                        icon: Mail,
                        label: lead?.email || "Email not available",
                        verified: !!lead?.email,
},
                      {
                        icon: Phone,
                        label: lead?.phone || "Phone not available",
                        verified: !!lead?.phone,
                      },
                      { icon: Linkedin, label: "linkedin.com/in/alexm", verified: false },
                    ].map(({ icon: Icon, label, verified }) => (
                      <div key={label} className="flex items-center gap-2 text-xs group">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                        <span style={{ color: C.primary }} className="hover:underline cursor-pointer flex-1">{label}</span>
                        {verified && <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: C.success }} />}
                        <CopyButton value={label} />
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full mt-4 h-9 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}25` }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${C.primary}18`)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${C.primary}10`)}
                  >
                    <Send className="w-3.5 h-3.5" /> Send Outreach
                  </button>
                </Card>
              </div>
            </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === "contacts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: C.muted }}>{contacts.length} contacts found at Stripe</p>
                <button className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium" style={{ backgroundColor: C.primary, color: "#fff" }}>
                  <UserPlus className="w-3.5 h-3.5" /> Add Contact
                </button>
              </div>

              {contacts.map((c) => (
                <Card key={c.id}>
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Avatar */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: c.color }}>
                        {c.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: C.text }}>{c.name}</p>
                          {c.isDecision && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${C.warning}14`, color: C.warning }}>
                              Decision Maker
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{c.role}</p>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
                      <div className="flex items-center gap-2 text-xs group">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                        <span className="truncate hover:underline cursor-pointer" style={{ color: C.primary }}>{c.email}</span>
                        {c.status === "verified" && <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: C.success }} />}
                        <CopyButton value={c.email} />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                        <span style={{ color: C.textSec }}>{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Linkedin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.muted }} />
                        <a href="#" onClick={(e) => e.preventDefault()} className="truncate hover:underline" style={{ color: C.primary }}>{c.linkedin}</a>
                      </div>
                    </div>

                    {/* Confidence + actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: C.muted }}>Confidence</p>
                        <ConfidenceDot score={c.confidence} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="h-8 px-3 rounded-lg text-xs font-medium transition-colors"
                          style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}25` }}
                        >
                          <Send className="w-3 h-3" />
                        </button>
                        <button
                          className="h-8 px-3 rounded-lg text-xs border"
                          style={{ borderColor: C.border, color: C.muted }}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

   
              {/* Insights cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map(({ icon: Icon, color, label, text, confidence }) => (
                  <Card key={label}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>{label}</p>
                          <ConfidenceDot score={confidence} />
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>{text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Hiring trends */}
              <Card>
                <SectionHeader title="Hiring Trends" subtitle="Active job postings signal growth areas" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { dept: "Engineering", count: 42, trend: "+18%", color: C.primary },
                    { dept: "Sales", count: 28, trend: "+34%", color: C.success },
                    { dept: "Product", count: 15, trend: "+12%", color: C.purple },
                    { dept: "Marketing", count: 9, trend: "-4%", color: C.muted },
                  ].map(({ dept, count, trend, color }) => (
                    <div
                      key={dept}
                      className="p-3.5 rounded-xl text-center"
                      style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}
                    >
                      <p className="text-2xl font-black" style={{ color }}>{count}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: C.text }}>{dept}</p>
                      <p className="text-xs font-medium mt-1" style={{ color: trend.startsWith("+") ? C.success : C.error }}>{trend}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended outreach */}
              <Card>
                <SectionHeader title="Recommended Outreach Strategy" />
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Reference their engineering blog", desc: "Stripe's April post on 'Developer-first infrastructure' — open with this as a shared angle." },
                    { step: "2", title: "Lead with API reliability ROI", desc: "Highlight 3 case studies with FinTech companies that achieved 99.99% uptime with your tooling." },
                    { step: "3", title: "Optimal send window", desc: "Tuesday–Thursday, 9–11am PT. Alex's LinkedIn activity peaks on Tuesdays based on post timing analysis." },
                    { step: "4", title: "Subject line suggestion", desc: '"How [Company X] cut API downtime 40% — relevant to Stripe\'s infra roadmap"' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${C.primary}14`, color: C.primary }}
                      >
                        {step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>{title}</p>
                        <p className="text-sm mt-0.5" style={{ color: C.textSec }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
        
{/* AI INSIGHTS TAB */}
{activeTab === "insights" && (
  <Card>
    <SectionHeader
      title="AI Insights"
      subtitle="Generated from backend data"
    />

    <div className="space-y-4">
      <div><strong>Lead Score:</strong> {lead?.score}</div>
      <div><strong>Industry:</strong> {lead?.industry}</div>
      <div><strong>Company Size:</strong> {lead?.company_size}</div>
      <div><strong>Lead Quality:</strong> {lead?.lead_quality}</div>
      <div><strong>Website:</strong> {lead?.website}</div>
    </div>
  </Card>
)}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div className="max-w-2xl">
              <Card>
                <SectionHeader title="Activity Timeline" subtitle="All enrichment, crawl, and outreach events" />
                <div className="relative">
                  {/* Vertical line */}
                  <div
                    className="absolute left-4 top-0 bottom-0 w-px"
                    style={{ backgroundColor: C.border }}
                  />
                  <div className="space-y-0">
                    {timeline.map(({ type, icon: Icon, color, title, detail, time }, i) => (
                      <div key={type + i} className="flex gap-4 relative pb-5 last:pb-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                          style={{ backgroundColor: `${color}18`, border: `2px solid ${color}30` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <div
                          className="flex-1 p-3.5 rounded-xl"
                          style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, marginTop: 4 }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold" style={{ color: C.text }}>{title}</p>
                            <span className="text-xs flex items-center gap-1 flex-shrink-0" style={{ color: C.muted }}>
                              <Clock className="w-3 h-3" /> {time}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: C.textSec }}>{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    
  );
}
