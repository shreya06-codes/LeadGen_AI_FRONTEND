import { LayoutDashboard, Search, Brain, Activity, Download, Settings, ChevronLeft, ChevronRight, Zap } from "lucide-react";

type Page = "dashboard" | "leads" | "lead-detail" | "ai-insights" | "crawl" | "export" | "settings";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "leads" as Page, label: "Lead Search", icon: Search },
  { id: "ai-insights" as Page, label: "AI Insights", icon: Brain },
  { id: "crawl" as Page, label: "Crawl Monitor", icon: Activity },
  { id: "export" as Page, label: "Export & Integrations", icon: Download },
];

const secondaryItems = [
  { id: "settings" as Page, label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? "64px" : "240px",
        backgroundColor: "#0F172A",
        borderRight: "1px solid #1E293B",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 flex-shrink-0" style={{ borderBottom: "1px solid #1E293B" }}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2563EB" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-lg tracking-tight whitespace-nowrap">Aurxon</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Main</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                backgroundColor: active ? "#2563EB" : "transparent",
                color: active ? "#ffffff" : "#94A3B8",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#1E293B"; e.currentTarget.style.color = "#F8FAFC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = active ? "#2563EB" : "transparent"; e.currentTarget.style.color = active ? "#ffffff" : "#94A3B8"; }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
            </button>
          );
        })}

        <div className="pt-4">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Account</p>
          )}
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                style={{
                  backgroundColor: active ? "#2563EB" : "transparent",
                  color: active ? "#ffffff" : "#94A3B8",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#1E293B"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = active ? "#2563EB" : "transparent"; }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Credits usage */}
      {!collapsed && (
        <div className="px-4 py-4" style={{ borderTop: "1px solid #1E293B" }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs" style={{ color: "#64748B" }}>Credits Used</span>
            <span className="text-xs font-medium text-white">7,340 / 10k</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
            <div className="h-full rounded-full" style={{ width: "73.4%", backgroundColor: "#2563EB" }} />
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 transition-colors"
        style={{ borderTop: "1px solid #1E293B", color: "#64748B" }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1E293B"; e.currentTarget.style.color = "#F8FAFC"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#64748B"; }}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
