import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Target,
  Layers,
  Megaphone,
  LogOut,
  Activity,
  User,
} from "lucide-react";

const nav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/intents", label: "Intent Tracking", icon: Target },
  { path: "/offers", label: "Micro Offers", icon: Layers },
  { path: "/distribution", label: "Distribution", icon: Megaphone },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <div>
              <h1 className="text-sm font-bold tracking-wider text-zinc-100">PULSE</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Revenue Engine</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-zinc-800/80 text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user?.name || "Operator"}</p>
              <p className="text-[10px] text-zinc-500">Revenue Engine</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
