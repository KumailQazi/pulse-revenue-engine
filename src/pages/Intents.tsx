import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Plus, Signal } from "lucide-react";

const signalColors: Record<string, string> = {
  search: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  click: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  scroll: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  exit: "bg-red-500/10 text-red-400 border-red-500/20",
  purchase: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  hover: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  form: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function Intents() {
  const [form, setForm] = useState({
    signalType: "click" as const,
    category: "",
    keyword: "",
    pageUrl: "",
    score: "10",
  });

  const utils = trpc.useUtils();
  const { data: intents, isLoading } = trpc.intent.list.useQuery();
  const { data: summary } = trpc.intent.summary.useQuery();
  const { data: heatmap } = trpc.intent.heatmap.useQuery();
  const createIntent = trpc.intent.create.useMutation({
    onSuccess: () => {
      utils.intent.list.invalidate();
      utils.intent.summary.invalidate();
      utils.intent.heatmap.invalidate();
      utils.dashboard.overview.invalidate();
      setForm({ signalType: "click", category: "", keyword: "", pageUrl: "", score: "10" });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-400" />
          Intent Tracking
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Capture and score visitor intent signals to identify what converts.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary?.map((s) => (
          <Card key={s.signalType} className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-4">
              <Badge variant="outline" className={`text-[10px] capitalize ${signalColors[s.signalType] || "border-zinc-700 text-zinc-400"}`}>
                {s.signalType}
              </Badge>
              <p className="text-2xl font-bold mt-2">{s.count}</p>
              <p className="text-xs text-zinc-500">avg score {Number(s.avgScore).toFixed(1)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Heatmap */}
      {heatmap && heatmap.length > 0 && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Signal className="w-4 h-4 text-emerald-400" />
              Intent Heatmap by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {heatmap.map((h, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 capitalize">{h.category || "Uncategorized"}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (h.count / (heatmap[0]?.count || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-8 text-right">{h.count}</span>
                    <span className="text-xs text-zinc-600 w-10 text-right">{h.totalScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add intent form */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Log Intent Signal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Select
              value={form.signalType}
              onValueChange={(v) => setForm((f) => ({ ...f, signalType: v as typeof f.signalType }))}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {["search", "click", "scroll", "exit", "purchase", "hover", "form"].map((t) => (
                  <SelectItem key={t} value={t} className="text-zinc-100 capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Input
              placeholder="Keyword"
              value={form.keyword}
              onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Input
              placeholder="Score (0-100)"
              type="number"
              min={0}
              max={100}
              value={form.score}
              onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
              onClick={() =>
                createIntent.mutate({
                  signalType: form.signalType,
                  category: form.category || undefined,
                  keyword: form.keyword || undefined,
                  score: Number(form.score),
                })
              }
              disabled={createIntent.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              Log Signal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Intent list */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Signals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-zinc-900 rounded animate-pulse" />
              ))}
            </div>
          ) : intents && intents.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {intents.map((intent) => (
                <div key={intent.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${signalColors[intent.signalType] || "border-zinc-700 text-zinc-400"}`}
                    >
                      {intent.signalType}
                    </Badge>
                    <div>
                      <p className="text-sm text-zinc-200">
                        {intent.keyword || intent.category || "Untracked signal"}
                      </p>
                      {intent.pageUrl && (
                        <p className="text-xs text-zinc-600 truncate max-w-xs">{intent.pageUrl}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Score</p>
                      <p className="text-sm font-semibold text-emerald-400">{intent.score}</p>
                    </div>
                    <p className="text-xs text-zinc-600">
                      {new Date(intent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-zinc-500">No intent signals logged yet.</p>
              <p className="text-xs text-zinc-600 mt-1">Start tracking to build your intent map.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
