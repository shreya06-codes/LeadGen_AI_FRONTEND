import { useState } from "react";
import { Zap, ArrowRight, Shield, Sparkles, BarChart3 } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0F172A" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: "#2563EB33" }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#2563EB" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">Aurxon</span>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              AI-Powered Lead<br />Generation at Scale
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: "#94A3B8" }}>
              Discover, enrich, and close high-value leads with precision AI models trained on billions of data points.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Sparkles, title: "AI Lead Scoring", desc: "Rank leads by conversion probability with 94% accuracy" },
              { icon: BarChart3, title: "Real-time Enrichment", desc: "Instant firmographic and contact data from 200+ sources" },
              { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II certified with GDPR compliance built-in" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2563EB22", border: "1px solid #2563EB44" }}>
                  <Icon className="w-4 h-4" style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#2563EB", "#10B981", "#8B5CF6", "#F59E0B"].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: c, borderColor: "#0F172A" }} />
            ))}
          </div>
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            <span className="text-white font-medium">4,200+</span> teams generating leads with Aurxon
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#2563EB" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg" style={{ color: "#0F172A" }}>Aurxon</span>
          </div>

          <div className="mb-8">
            <h2 className="font-bold" style={{ color: "#0F172A" }}>Welcome back</h2>
            <p className="mt-1.5" style={{ color: "#64748B" }}>Sign in to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#0F172A" }}>Work Email</label>
              <input
                type="email"
                defaultValue="james@acmecorp.com"
                className="w-full h-10 px-3.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", color: "#0F172A" }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: "#0F172A" }}>Password</label>
                <button type="button" className="text-xs hover:underline" style={{ color: "#2563EB" }}>Forgot password?</button>
              </div>
              <input
                type="password"
                defaultValue="password"
                className="w-full h-10 px-3.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", color: "#0F172A" }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg font-medium flex items-center justify-center gap-2 transition-opacity disabled:opacity-70"
              style={{ backgroundColor: "#2563EB", color: "#ffffff" }}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign in to Aurxon</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: "1px solid #E2E8F0" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs" style={{ backgroundColor: "#F8FAFC", color: "#64748B" }}>or continue with SSO</span>
            </div>
          </div>

          <button
            className="w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", color: "#0F172A" }}
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DBEAFE" }}>
              <span className="text-[9px] font-bold" style={{ color: "#2563EB" }}>G</span>
            </div>
            Continue with Google Workspace
          </button>

          <p className="text-center text-sm mt-6" style={{ color: "#64748B" }}>
            New to Aurxon?{" "}
            <button className="font-medium hover:underline" style={{ color: "#2563EB" }}>Start free trial</button>
          </p>
        </div>
      </div>
    </div>
  );
}
