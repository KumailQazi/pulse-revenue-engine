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
import { Megaphone, Plus, Play, Pause, Trash2, Eye, MousePointer, DollarSign } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  running: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const channelIcons: Record<string, React.ReactNode> = {
  email: <Megaphone className="w-3.5 h-3.5" />,
  social: <Megaphone className="w-3.5 h-3.5" />,
  seo: <Eye className="w-3.5 h-3.5" />,
  ads: <Megaphone className="w-3.5 h-3.5" />,
  affiliate: <Megaphone className="w-3.5 h-3.5" />,
  content: <Megaphone className="w-3.5 h-3.5" />,
};

export default function Distribution() {
  const [form, setForm] = useState({
    name: "",
    channel: "content" as const,
    content: "",
    status: "draft" as const,
  });

  const utils = trpc.useUtils();
  const { data: campaigns, isLoading } = trpc.distribution.list.useQuery();
  const { data: stats } = trpc.distribution.stats.useQuery();
  const createCampaign = trpc.distribution.create.useMutation({
    onSuccess: () => {
      utils.distribution.list.invalidate();
      utils.distribution.stats.invalidate();
      utils.dashboard.overview.invalidate();
      setForm({ name: "", channel: "content", content: "", status: "draft" });
    },
  });
  const updateCampaign = trpc.distribution.update.useMutation({
    onSuccess: () => {
      utils.distribution.list.invalidate();
      utils.distribution.stats.invalidate();
      utils.dashboard.overview.invalidate();
    },
  });
  const deleteCampaign = trpc.distribution.delete.useMutation({
    onSuccess: () => {
      utils.distribution.list.invalidate();
      utils.distribution.stats.invalidate();
      utils.dashboard.overview.invalidate();
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-emerald-400" />
          Silent Distribution
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Deploy content and offers through automated multi-channel campaigns.
        </p>
      </div>

      {/* Channel stats */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <Card key={s.channel} className="bg-zinc-950 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {channelIcons[s.channel] || <Megaphone className="w-3.5 h-3.5" />}
                  <span className="text-xs uppercase tracking-wider text-zinc-500 capitalize">{s.channel}</span>
                </div>
                <p className="text-xl font-bold">{s.totalCampaigns}</p>
                <p className="text-xs text-zinc-500">campaigns</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {s.totalReach?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointer className="w-3 h-3" /> {s.totalClicks?.toLocaleString() || 0}
                  </span>
                </div>
                <p className="text-sm text-emerald-400 mt-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {Number(s.totalRevenue || 0).toFixed(0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add campaign form */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            New Campaign
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Campaign name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Select
              value={form.channel}
              onValueChange={(v) => setForm((f) => ({ ...f, channel: v as typeof f.channel }))}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {["email", "social", "seo", "ads", "affiliate", "content"].map((c) => (
                  <SelectItem key={c} value={c} className="text-zinc-100 capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Content / angle"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Select
              value={form.status}
              onValueChange={(v) => setForm((f) => ({ ...f, status: v as typeof f.status }))}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {["draft", "scheduled", "running", "paused", "completed"].map((s) => (
                  <SelectItem key={s} value={s} className="text-zinc-100 capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
              onClick={() =>
                createCampaign.mutate({
                  name: form.name,
                  channel: form.channel,
                  content: form.content || undefined,
                  status: form.status,
                })
              }
              disabled={createCampaign.isPending || !form.name}
            >
              <Plus className="w-4 h-4 mr-1" />
              Launch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign list */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Campaign Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900 rounded animate-pulse" />
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${statusColors[campaign.status] || ""}`}
                    >
                      {campaign.status}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{campaign.name}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span className="capitalize">{campaign.channel}</span>
                        {campaign.content && <span>· {campaign.content}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {campaign.reach}
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer className="w-3 h-3" /> {campaign.clicks}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <DollarSign className="w-3 h-3" /> {Number(campaign.revenue || 0).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {campaign.status === "running" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-zinc-500 hover:text-amber-400"
                          onClick={() => updateCampaign.mutate({ id: campaign.id, status: "paused" })}
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                      ) : campaign.status === "paused" || campaign.status === "draft" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-zinc-500 hover:text-emerald-400"
                          onClick={() => updateCampaign.mutate({ id: campaign.id, status: "running" })}
                        >
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-zinc-500 hover:text-red-400"
                        onClick={() => deleteCampaign.mutate({ id: campaign.id })}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-zinc-500">No campaigns in the pipeline.</p>
              <p className="text-xs text-zinc-600 mt-1">Launch your first silent distribution campaign.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
