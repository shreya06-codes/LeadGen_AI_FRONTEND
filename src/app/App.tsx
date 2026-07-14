import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LeadsPage } from "./pages/LeadsPage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { AIInsightsPage } from "./pages/AIInsightsPage";
import { CrawlPage } from "./pages/CrawlPage";
import { ExportPage } from "./pages/ExportPage";
import { SettingsPage } from "./pages/SettingsPage";

type Page =
  | "dashboard"
  | "leads"
  | "lead-detail"
  | "ai-insights"
  | "crawl"
  | "export"
  | "settings";

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  leads: "Lead Search",
  "lead-detail": "Lead Details",
  "ai-insights": "AI Insights",
  crawl: "Crawl Monitor",
  export: "Export & Integrations",
  settings: "Settings",
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [prevPage, setPrevPage] = useState<Page>("leads");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const navigate = (page: Page) => {
    if (page !== "lead-detail") setPrevPage(currentPage);
    setCurrentPage(page);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav title={PAGE_TITLES[currentPage]} onNavigate={navigate} />

        {currentPage === "dashboard" && (
          <DashboardPage
            onViewLead={() => navigate("lead-detail")}
            onNavigate={navigate}
          />
        )}
        {currentPage === "leads" && (
         <LeadsPage
           onViewLead={(lead) => {
              setSelectedLead(lead);
              setSelectedLeadId(lead.id);
              navigate("lead-detail");
  }}

/>
        )}
        {currentPage === "lead-detail" && (
        <LeadDetailPage
           leadId={selectedLeadId}
             onBack={() =>
             navigate(prevPage === "lead-detail" ? "leads" : prevPage)
  }
/>
        )}
        {currentPage === "ai-insights" && <AIInsightsPage />}
        {currentPage === "crawl" && <CrawlPage />}
        {currentPage === "export" && <ExportPage />}
        {currentPage === "settings" && <SettingsPage />}
      </div>
    </div>
  );
}
