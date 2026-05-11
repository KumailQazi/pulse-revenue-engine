import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Activity, Target, Layers, Megaphone, ArrowRight, BarChart3, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-6 py-24 relative">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-medium">Pulse Revenue Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Track intent. <span className="text-zinc-500">Stack offers.</span>
            <br />
            <span className="text-emerald-400">Scale revenue.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
            A full-stack revenue intelligence platform that captures user intent signals, manages micro-offer funnels, and orchestrates multi-channel distribution campaigns.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Real-time analytics</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-12">Core Modules</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-emerald-500/30 transition-colors">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Intent Tracking</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Capture every user signal — searches, clicks, scrolls, exits. Score intent in real-time and identify what prospects want before they convert.
              </p>
            </div>
            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-emerald-500/30 transition-colors">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Micro Offer Stacking</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Build tiered offer ladders from tripwire to profit-max. Each micro-offer is tracked with conversion rates and revenue attribution.
              </p>
            </div>
            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-emerald-500/30 transition-colors">
                <Megaphone className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Channel Distribution</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Deploy campaigns across email, social, SEO, ads, affiliate, and content channels. Monitor reach, clicks, and revenue per channel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-12">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React 19", desc: "Frontend UI" },
              { name: "Hono + tRPC", desc: "Type-safe API" },
              { name: "Drizzle ORM", desc: "Database layer" },
              { name: "shadcn/ui", desc: "Component library" },
            ].map((tech) => (
              <div key={tech.name} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-emerald-500/20 transition-colors">
                <p className="text-sm font-semibold text-zinc-200">{tech.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-12">Revenue Milestones</h2>
          <div className="flex items-end gap-4 h-48 mb-6">
            {[
              { label: "$1K", h: "h-12", color: "bg-zinc-700" },
              { label: "$2.5K", h: "h-24", color: "bg-zinc-600" },
              { label: "$5K", h: "h-36", color: "bg-zinc-500" },
              { label: "$8.4K+", h: "h-48", color: "bg-emerald-500" },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-full ${bar.h} ${bar.color} rounded-t-sm`} />
                <span className="text-xs text-zinc-500 font-mono">{bar.label}</span>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 text-sm">
            Track revenue milestones with automated goal tracking. Visualize funnel performance from first conversion to scaled recurring revenue.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Zap className="w-3 h-3" />
            <span>Pulse Revenue Engine</span>
          </div>
          <p className="text-zinc-600 text-xs">Full-stack revenue intelligence platform</p>
        </div>
      </footer>
    </div>
  );
}
