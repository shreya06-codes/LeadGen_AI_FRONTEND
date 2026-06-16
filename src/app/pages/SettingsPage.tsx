import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  Key,
  ChevronRight,
  Check,
  Upload,
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

type Tab = "profile" | "notifications" | "security" | "billing" | "team" | "api";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: checked ? C.primary : C.border }}
    >
      <div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <h3 className="font-semibold" style={{ color: C.text }}>{title}</h3>
        {description && <p className="text-sm mt-0.5" style={{ color: C.muted }}>{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [notifs, setNotifs] = useState({
    newLeads: true,
    crawlComplete: true,
    aiInsights: true,
    weeklyReport: false,
    exportReady: true,
    scoreChange: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: C.bg }}>
      {/* Settings sidebar */}
      <aside
        className="w-56 flex-shrink-0 border-r overflow-y-auto"
        style={{ backgroundColor: C.white, borderColor: C.border }}
      >
        <nav className="p-3 space-y-0.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: activeTab === id ? `${C.primary}10` : "transparent",
                color: activeTab === id ? C.primary : C.text,
                fontWeight: activeTab === id ? 500 : 400,
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5 max-w-2xl">

          {activeTab === "profile" && (
            <>
              <SectionCard title="Personal Information" description="Update your name, email, and profile picture">
                <div className="space-y-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: C.primary }}>
                      JD
                    </div>
                    <div>
                      <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border" style={{ borderColor: C.border, color: C.text }}>
                        <Upload className="w-3.5 h-3.5" /> Upload photo
                      </button>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "First Name", value: "James" },
                      { label: "Last Name", value: "Doe" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{label}</label>
                        <input
                          defaultValue={value}
                          className="w-full h-10 px-3.5 rounded-lg border text-sm focus:outline-none"
                          style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                          onFocus={(e) => (e.target.style.borderColor = C.primary)}
                          onBlur={(e) => (e.target.style.borderColor = C.border)}
                        />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Work Email</label>
                      <input
                        defaultValue="james@acmecorp.com"
                        className="w-full h-10 px-3.5 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                        onFocus={(e) => (e.target.style.borderColor = C.primary)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Role / Title</label>
                      <input
                        defaultValue="Growth Lead"
                        className="w-full h-10 px-3.5 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                        onFocus={(e) => (e.target.style.borderColor = C.primary)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Workspace" description="Your organization settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Company Name</label>
                    <input
                      defaultValue="Acme Corp"
                      className="w-full h-10 px-3.5 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                      onFocus={(e) => (e.target.style.borderColor = C.primary)}
                      onBlur={(e) => (e.target.style.borderColor = C.border)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>Workspace URL</label>
                    <div className="flex">
                      <span className="h-10 px-3.5 rounded-l-lg border border-r-0 flex items-center text-sm" style={{ borderColor: C.border, backgroundColor: C.bg, color: C.muted }}>
                        app.aurxon.io/
                      </span>
                      <input
                        defaultValue="acmecorp"
                        className="flex-1 h-10 px-3.5 rounded-r-lg border text-sm focus:outline-none"
                        style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                        onFocus={(e) => (e.target.style.borderColor = C.primary)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "notifications" && (
            <SectionCard title="Notification Preferences" description="Choose which events trigger alerts">
              <div className="space-y-4">
                {([
                  { key: "newLeads", label: "New lead discovered", desc: "When a new high-score lead is found" },
                  { key: "crawlComplete", label: "Crawl job completed", desc: "When a crawl finishes or fails" },
                  { key: "aiInsights", label: "New AI insights", desc: "When the AI generates fresh recommendations" },
                  { key: "weeklyReport", label: "Weekly summary report", desc: "Monday morning digest of your pipeline" },
                  { key: "exportReady", label: "Export ready", desc: "When a bulk export is available to download" },
                  { key: "scoreChange", label: "Score changes", desc: "When a saved lead's AI score shifts significantly" },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: C.border }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: C.text }}>{label}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{desc}</p>
                    </div>
                    <Toggle
                      checked={notifs[key]}
                      onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === "security" && (
            <>
              <SectionCard title="Password" description="Update your password to keep your account secure">
                <div className="space-y-4">
                  {["Current password", "New password", "Confirm new password"].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{label}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full h-10 px-3.5 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: C.border, color: C.text, backgroundColor: C.bg }}
                        onFocus={(e) => (e.target.style.borderColor = C.primary)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: C.text }}>Authenticator App</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>Use an app like Google Authenticator or 1Password</p>
                  </div>
                  <button
                    className="h-8 px-3.5 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: `${C.primary}12`, color: C.primary, border: `1px solid ${C.primary}30` }}
                  >
                    Enable 2FA
                  </button>
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "billing" && (
            <>
              <div className="rounded-xl p-5" style={{ backgroundColor: C.primary, color: "#fff" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Current Plan</p>
                    <h3 className="text-2xl font-bold mt-1">Growth</h3>
                    <p className="text-sm opacity-80 mt-1">$299/month · Billed annually</p>
                  </div>
                  <button className="h-8 px-3.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
                    Upgrade to Enterprise
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-sm">
                  <div><p className="opacity-70 text-xs">Leads/month</p><p className="font-semibold mt-0.5">50,000</p></div>
                  <div><p className="opacity-70 text-xs">AI Credits</p><p className="font-semibold mt-0.5">10,000</p></div>
                  <div><p className="opacity-70 text-xs">Team seats</p><p className="font-semibold mt-0.5">10</p></div>
                </div>
              </div>

              <SectionCard title="Usage This Month">
                <div className="space-y-4">
                  {[
                    { label: "Lead discoveries", used: 34820, total: 50000 },
                    { label: "AI credits", used: 7340, total: 10000 },
                    { label: "API calls", used: 128400, total: 500000 },
                  ].map(({ label, used, total }) => {
                    const pct = (used / total) * 100;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: C.muted }}>
                          <span>{label}</span>
                          <span><span className="font-medium" style={{ color: C.text }}>{used.toLocaleString()}</span> / {total.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: pct > 80 ? C.warning : C.primary }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === "team" && (
            <SectionCard title="Team Members" description="Manage who has access to your workspace">
              <div className="space-y-3 mb-4">
                {[
                  { name: "James Doe", email: "james@acmecorp.com", role: "Owner", initials: "JD" },
                  { name: "Sarah Kim", email: "sarah@acmecorp.com", role: "Admin", initials: "SK" },
                  { name: "Marcus Liu", email: "marcus@acmecorp.com", role: "Member", initials: "ML" },
                  { name: "Priya Gupta", email: "priya@acmecorp.com", role: "Member", initials: "PG" },
                ].map(({ name, email, role, initials }) => (
                  <div key={email} className="flex items-center gap-3 p-3 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: C.primary }}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: C.text }}>{name}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{email}</p>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: role === "Owner" ? `${C.purple}14` : `${C.primary}10`,
                        color: role === "Owner" ? C.purple : C.primary,
                      }}
                    >
                      {role}
                    </span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}30` }}>
                + Invite team member
              </button>
            </SectionCard>
          )}

          {activeTab === "api" && (
            <SectionCard title="API Keys" description="Manage keys for programmatic access to Aurxon">
              <div className="space-y-3 mb-4">
                {[
                  { name: "Production Key", key: "aurx_live_sk_••••••••••••••••••••••3f8a", created: "Jan 12, 2025", lastUsed: "2 min ago" },
                  { name: "Development Key", key: "aurx_test_sk_••••••••••••••••••••••7b2c", created: "Mar 5, 2025", lastUsed: "3 days ago" },
                ].map(({ name, key, created, lastUsed }) => (
                  <div key={name} className="p-4 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: C.text }}>{name}</p>
                      <button className="text-xs px-2.5 py-1 rounded border" style={{ borderColor: C.error, color: C.error }}>
                        Revoke
                      </button>
                    </div>
                    <code className="block text-xs px-3 py-2 rounded-md mb-2" style={{ backgroundColor: C.bg, color: C.muted, fontFamily: "'JetBrains Mono', monospace" }}>
                      {key}
                    </code>
                    <div className="flex gap-4 text-xs" style={{ color: C.muted }}>
                      <span>Created {created}</span>
                      <span>Last used {lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: `${C.primary}10`, color: C.primary, border: `1px solid ${C.primary}30` }}>
                + Generate new key
              </button>
            </SectionCard>
          )}

          {/* Save button */}
          {["profile", "notifications", "security"].includes(activeTab) && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: saved ? C.success : C.primary, color: "#fff" }}
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
