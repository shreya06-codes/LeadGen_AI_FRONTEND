import { Bell, Search, ChevronDown, Plus, Command } from "lucide-react";

type Page = "dashboard" | "leads" | "lead-detail" | "ai-insights" | "crawl" | "export" | "settings";

interface TopNavProps {
  title: string;
  onNavigate: (page: Page) => void;
}

export function TopNav({ title, onNavigate }: TopNavProps) {
  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}
    >
      <div className="flex items-center gap-4">
        <h1 className="font-semibold" style={{ color: "#0F172A" }}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={() => onNavigate("leads")}
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg text-sm w-56 transition-colors"
          style={{ backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", color: "#64748B" }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-left">Search leads...</span>
          <span className="flex items-center gap-0.5 text-xs opacity-60">
            <Command className="w-3 h-3" />K
          </span>
        </button>

        {/* New Search */}
        <button
          onClick={() => onNavigate("leads")}
          className="hidden md:flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: "#2563EB", color: "#ffffff" }}
        >
          <Plus className="w-3.5 h-3.5" />
          New Search
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-lg border flex items-center justify-center transition-colors"
          style={{ borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}
        >
          <Bell className="w-4 h-4" style={{ color: "#64748B" }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#EF4444" }} />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: "#2563EB" }}>
            JD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium leading-none" style={{ color: "#0F172A" }}>James Doe</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Growth Team</p>
          </div>
          <ChevronDown className="hidden md:block w-3.5 h-3.5" style={{ color: "#64748B" }} />
        </button>
      </div>
    </header>
  );
}
