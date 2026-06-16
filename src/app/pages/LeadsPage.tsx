import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Filter,
  X,
  Building2,
  MapPin,
  Globe,
  Check,
} from "lucide-react";

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

const LEADS = [
  { id: 1, company: "Stripe Inc.", contact: "Alex Martinez", role: "VP Engineering", email: "alex@stripe.com", score: 94, status: "Hot", industry: "FinTech", employees: "4,000+", location: "San Francisco, CA", website: "stripe.com", saved: true },
  { id: 2, company: "Notion Labs", contact: "Sarah Chen", role: "Head of Growth", email: "sarah@notion.so", score: 87, status: "Hot", industry: "SaaS", employees: "600+", location: "San Francisco, CA", website: "notion.so", saved: false },
  { id: 3, company: "Figma", contact: "Jordan Lee", role: "Director of Sales", email: "jordan@figma.com", score: 81, status: "Warm", industry: "SaaS", employees: "1,200+", location: "New York, NY", website: "figma.com", saved: true },
  { id: 4, company: "Vercel", contact: "Marcus Johnson", role: "CTO", email: "marcus@vercel.com", score: 76, status: "Warm", industry: "Infrastructure", employees: "300+", location: "Remote", website: "vercel.com", saved: false },
  { id: 5, company: "Linear", contact: "Emma Wilson", role: "CEO", email: "emma@linear.app", score: 69, status: "Warm", industry: "SaaS", employees: "100+", location: "San Francisco, CA", website: "linear.app", saved: false },
  { id: 6, company: "Loom Inc.", contact: "David Park", role: "SVP Sales", email: "david@loom.com", score: 55, status: "Cold", industry: "SaaS", employees: "500+", location: "Austin, TX", website: "loom.com", saved: false },
  { id: 7, company: "Retool", contact: "Priya Kapoor", role: "VP Product", email: "priya@retool.com", score: 88, status: "Hot", industry: "SaaS", employees: "400+", location: "San Francisco, CA", website: "retool.com", saved: true },
  { id: 8, company: "Segment", contact: "Tyler Ross", role: "Sales Director", email: "tyler@segment.com", score: 72, status: "Warm", industry: "Data", employees: "600+", location: "San Francisco, CA", website: "segment.com", saved: false },
  { id: 9, company: "Airtable", contact: "Mia Torres", role: "Head of Partnerships", email: "mia@airtable.com", score: 63, status: "Warm", industry: "SaaS", employees: "900+", location: "San Francisco, CA", website: "airtable.com", saved: false },
  { id: 10, company: "Brex", contact: "James Kim", role: "CRO", email: "james@brex.com", score: 91, status: "Hot", industry: "FinTech", employees: "1,000+", location: "San Francisco, CA", website: "brex.com", saved: true },
];

const INDUSTRIES = ["All", "SaaS", "FinTech", "HealthTech", "Infrastructure", "Data", "E-commerce"];
const STATUSES = ["All", "Hot", "Warm", "Cold"];
const SIZES = ["All", "1–50", "51–200", "201–500", "500+"];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? C.success : score >= 60 ? C.warning : C.muted;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${color}25` }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Hot: C.error, Warm: C.warning, Cold: C.muted };
  const c = map[status] ?? C.muted;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${c}14`, color: c }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
      {status}
    </span>
  );
}

interface LeadsPageProps {
  onViewLead: () => void;
}

export function LeadsPage({ onViewLead }: LeadsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>(
    Object.fromEntries(LEADS.map((l) => [l.id, l.saved]))
  );

  const filtered = LEADS.filter((l) => {
    const q = query.toLowerCase();
    const matchQ = !q || l.company.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q) || l.role.toLowerCase().includes(q);
    const matchI = selectedIndustry === "All" || l.industry === selectedIndustry;
    const matchS = selectedStatus === "All" || l.status === selectedStatus;
    return matchQ && matchI && matchS;
  });

  const toggleSelect = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const allSelected = filtered.length > 0 && filtered.every((l) => selected.includes(l.id));
  const toggleAll = () => setAllSelected(!allSelected);
  function setAllSelected(v: boolean) {
    setSelected(v ? filtered.map((l) => l.id) : []);
  }

  return (
    <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: C.bg }}>
      {/* Filter sidebar */}
      {filtersOpen && (
        <aside
          className="w-64 flex-shrink-0 border-r overflow-y-auto"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" style={{ color: C.muted }} />
              <span className="text-sm font-semibold" style={{ color: C.text }}>Filters</span>
            </div>
            <button onClick={() => setFiltersOpen(false)} style={{ color: C.muted }} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Industry */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: C.muted }}>Industry</p>
              <div className="space-y-1">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors"
                    style={{
                      backgroundColor: selectedIndustry === ind ? `${C.primary}12` : "transparent",
                      color: selectedIndustry === ind ? C.primary : C.text,
                    }}
                  >
                    <span>{ind}</span>
                    {selectedIndustry === ind && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: C.border }} />

            {/* Status */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: C.muted }}>Lead Status</p>
              <div className="space-y-1">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors"
                    style={{
                      backgroundColor: selectedStatus === s ? `${C.primary}12` : "transparent",
                      color: selectedStatus === s ? C.primary : C.text,
                    }}
                  >
                    <span>{s}</span>
                    {selectedStatus === s && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: C.border }} />

            {/* Company size */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: C.muted }}>Company Size</p>
              <div className="space-y-1">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors"
                    style={{
                      backgroundColor: selectedSize === s ? `${C.primary}12` : "transparent",
                      color: selectedSize === s ? C.primary : C.text,
                    }}
                  >
                    <span>{s}</span>
                    {selectedSize === s && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: C.border }} />

            {/* AI Score range */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: C.muted }}>Min. AI Score</p>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={50}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
                <span>0</span><span>50</span><span>100</span>
              </div>
            </div>

            <button
              onClick={() => { setSelectedIndustry("All"); setSelectedStatus("All"); setSelectedSize("All"); }}
              className="w-full text-xs py-2 rounded-md border transition-colors hover:opacity-80"
              style={{ borderColor: C.border, color: C.muted }}
            >
              Reset all filters
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div
          className="px-5 py-3.5 border-b flex items-center gap-3 flex-wrap"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, contacts, roles..."
              className="w-full h-9 pl-9 pr-3.5 rounded-lg border text-sm focus:outline-none transition-colors"
              style={{ borderColor: C.border, backgroundColor: C.bg, color: C.text }}
              onFocus={(e) => (e.target.style.borderColor = C.primary)}
              onBlur={(e) => (e.target.style.borderColor = C.border)}
            />
          </div>

          {!filtersOpen && (
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-sm transition-colors"
              style={{ borderColor: C.border, color: C.muted, backgroundColor: C.white }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: C.muted }}>{filtered.length} leads</span>
            {selected.length > 0 && (
              <button
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: `${C.primary}12`, color: C.primary }}
              >
                <Download className="w-3.5 h-3.5" />
                Export {selected.length}
              </button>
            )}
            <button
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-sm transition-colors hover:border-blue-400"
              style={{ borderColor: C.border, color: C.muted }}
            >
              <Download className="w-3.5 h-3.5" />
              Export All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: C.bg }}>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-blue-600 w-4 h-4"
                  />
                </th>
                {["Company", "Contact / Role", "Location", "Industry", "Employees", "AI Score", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: C.muted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="group cursor-pointer transition-colors"
                  style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: selected.includes(lead.id) ? `${C.primary}06` : C.white }}
                  onMouseEnter={(e) => { if (!selected.includes(lead.id)) e.currentTarget.style.backgroundColor = C.bg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selected.includes(lead.id) ? `${C.primary}06` : C.white; }}
                  onClick={onViewLead}
                >
                  <td className="px-4 py-3.5" onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="accent-blue-600 w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: C.primary }}
                      >
                        {lead.company[0]}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: C.text }}>{lead.company}</p>
                        <p className="text-xs" style={{ color: C.muted }}>{lead.website}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium" style={{ color: C.text }}>{lead.contact}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{lead.role}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {lead.location}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor: C.bg, color: C.muted, border: `1px solid ${C.border}` }}>
                      {lead.industry}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs" style={{ color: C.muted }}>{lead.employees}</td>
                  <td className="px-4 py-3.5"><ScoreBadge score={lead.score} /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSavedMap((m) => ({ ...m, [lead.id]: !m[lead.id] })); }}
                        style={{ color: savedMap[lead.id] ? C.warning : C.muted }}
                      >
                        <Star className="w-3.5 h-3.5" fill={savedMap[lead.id] ? C.warning : "none"} />
                      </button>
                      <button style={{ color: C.muted }}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between flex-shrink-0"
          style={{ backgroundColor: C.white, borderColor: C.border }}
        >
          <p className="text-xs" style={{ color: C.muted }}>
            Showing <span className="font-medium" style={{ color: C.text }}>1–{filtered.length}</span> of <span className="font-medium" style={{ color: C.text }}>124,832</span> leads
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-md border flex items-center justify-center transition-colors hover:border-blue-400"
              style={{ borderColor: C.border, color: C.muted }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, "...", 48].map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === "number" && setPage(p)}
                className="w-8 h-8 rounded-md border text-xs font-medium transition-colors"
                style={{
                  borderColor: page === p ? C.primary : C.border,
                  backgroundColor: page === p ? C.primary : "transparent",
                  color: page === p ? "#fff" : C.muted,
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-md border flex items-center justify-center transition-colors hover:border-blue-400"
              style={{ borderColor: C.border, color: C.muted }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
