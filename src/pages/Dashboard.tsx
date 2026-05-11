import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Target,
  MousePointer,
  TrendingUp,
  Zap,
  Layers,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Dashboard() {
  const { data: overview, isLoading } = trpc.dashboard.overview.useQuery();
  const { data: funnel } = trpc.dashboard.funnel.useQuery();
  const { data: milestones } = trpc.dashboard.milestones.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalReach = overview?.totalReach ?? 0;
  const totalClicks = overview?.totalClicks ?? 0;
  const ctr = overview?.ctr ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Engine Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Revenue analytics, intent signals, and conversion tracking.</p>
      </div>

      {/* Milestone progress */}
      {milestones && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">Next Milestone</p>
                <p className="text-lg font-semibold mt-1">
                  {milestones.nextMilestone ? (
                    <>
                      Reach <span className="text-emerald-400">{milestones.nextMilestone}</span>
                    </>
                  ) : (
                    <span className="text-emerald-400">All milestones cleared</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-zinc-500">total revenue generated</p>
              </div>
            </div>
            <Progress value={milestones.progress} className="h-2 bg-zinc-800" />
            <div className="flex justify-between mt-2 text-[10px] text-zinc-500 uppercase tracking-wider">
              <span>$0</span>
              <span>{milestones.nextMilestone || "$10K+"}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                Revenue
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-emerald-400" />
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                Reach
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{totalReach.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1">Silent impressions</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <MousePointer className="w-5 h-5 text-emerald-400" />
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                Clicks
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-1">Intent signals</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                CTR
              </Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{ctr.toFixed(1)}%</p>
            <p className="text-xs text-zinc-500 mt-1">Click-through rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel */}
      {funnel && (
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Silent Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{funnel.reach.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">Reach</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-zinc-700" />
                <span className="text-xs text-zinc-600 ml-1">{funnel.clickRate}%</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{funnel.clicks.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">Clicks</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-zinc-700" />
                <span className="text-xs text-zinc-600 ml-1">{funnel.convRate}%</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{funnel.conversions}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Top Intent Keywords
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {overview?.topKeywords && overview.topKeywords.length > 0 ? (
              <div className="space-y-3">
                {overview.topKeywords.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{kw.keyword}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, (kw.count / (overview.topKeywords[0]?.count || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 w-6 text-right">{kw.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No intent data yet. Start tracking signals.</p>
            )}
          </CardContent>
        </Card>

        {/* Campaign Stats */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {overview?.campaignStats && overview.campaignStats.length > 0 ? (
              <div className="space-y-4">
                {overview.campaignStats.map((ch, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-200 capitalize">{ch.channel}</p>
                      <p className="text-xs text-zinc-500">
                        {ch.totalCampaigns} campaigns · {ch.totalReach.toLocaleString()} reach
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(Number(ch.totalRevenue ?? 0))}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No campaigns yet. Launch silent distribution.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Offer Tiers */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Micro Offer Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {overview?.offerStats && overview.offerStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {overview.offerStats.map((tier, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{tier.tier}</p>
                  <p className="text-2xl font-bold mt-1">{tier.totalOffers}</p>
                  <p className="text-xs text-zinc-500 mt-1">offers</p>
                  <p className="text-sm text-emerald-400 mt-2">
                    avg {formatCurrency(Number(tier.avgPrice ?? 0))}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No offers yet. Build your micro-offer stack.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
