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
import { Layers, Plus, DollarSign, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

const tierColors: Record<string, string> = {
  tripwire: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  core: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  profit: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  max: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function Offers() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    tier: "tripwire" as const,
    stackOrder: "1",
  });

  const utils = trpc.useUtils();
  const { data: offers, isLoading } = trpc.offer.list.useQuery();
  const { data: stats } = trpc.offer.stats.useQuery();
  const createOffer = trpc.offer.create.useMutation({
    onSuccess: () => {
      utils.offer.list.invalidate();
      utils.offer.stats.invalidate();
      utils.dashboard.overview.invalidate();
      setForm({ name: "", price: "", description: "", tier: "tripwire", stackOrder: "1" });
    },
  });
  const deleteOffer = trpc.offer.delete.useMutation({
    onSuccess: () => {
      utils.offer.list.invalidate();
      utils.offer.stats.invalidate();
      utils.dashboard.overview.invalidate();
    },
  });
  const updateOffer = trpc.offer.update.useMutation({
    onSuccess: () => utils.offer.list.invalidate(),
  });

  const sortedOffers = offers?.slice().sort((a, b) => {
    const order = { tripwire: 1, core: 2, profit: 3, max: 4 };
    return (order[a.tier] || 0) - (order[b.tier] || 0) || a.stackOrder - b.stackOrder;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-400" />
          Micro Offer Stack
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Build tiered offers that stack from tripwire to max profit.
        </p>
      </div>

      {/* Tier stats */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.tier} className="bg-zinc-950 border-zinc-800">
              <CardContent className="p-4">
                <Badge variant="outline" className={`text-[10px] capitalize ${tierColors[s.tier] || ""}`}>
                  {s.tier}
                </Badge>
                <p className="text-2xl font-bold mt-2">{s.totalOffers}</p>
                <p className="text-xs text-zinc-500">offers</p>
                <p className="text-sm text-emerald-400 mt-1">
                  avg ${Number(s.avgPrice).toFixed(0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add offer form */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Add Micro Offer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input
              placeholder="Offer name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Select
              value={form.tier}
              onValueChange={(v) => setForm((f) => ({ ...f, tier: v as typeof f.tier }))}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {["tripwire", "core", "profit", "max"].map((t) => (
                  <SelectItem key={t} value={t} className="text-zinc-100 capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Stack order"
              type="number"
              min={1}
              value={form.stackOrder}
              onChange={(e) => setForm((f) => ({ ...f, stackOrder: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            />
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
              onClick={() =>
                createOffer.mutate({
                  name: form.name,
                  price: form.price,
                  description: form.description || undefined,
                  tier: form.tier,
                  stackOrder: Number(form.stackOrder),
                })
              }
              disabled={createOffer.isPending || !form.name || !form.price}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Offer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offer list */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Offer Stack</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900 rounded animate-pulse" />
              ))}
            </div>
          ) : sortedOffers && sortedOffers.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {sortedOffers.map((offer) => (
                <div key={offer.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                      {offer.stackOrder}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize ${tierColors[offer.tier] || ""}`}
                        >
                          {offer.tier}
                        </Badge>
                        <p className="text-sm font-medium text-zinc-200">{offer.name}</p>
                      </div>
                      {offer.description && (
                        <p className="text-xs text-zinc-600 mt-0.5">{offer.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {offer.price}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {offer.conversionRate ? `${offer.conversionRate}% conv` : "No data"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-zinc-500 hover:text-zinc-300"
                        onClick={() =>
                          updateOffer.mutate({
                            id: offer.id,
                            stackOrder: offer.stackOrder - 1,
                          })
                        }
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-zinc-500 hover:text-zinc-300"
                        onClick={() =>
                          updateOffer.mutate({
                            id: offer.id,
                            stackOrder: offer.stackOrder + 1,
                          })
                        }
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-zinc-500 hover:text-red-400"
                        onClick={() => deleteOffer.mutate({ id: offer.id })}
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
              <p className="text-sm text-zinc-500">No offers in your stack yet.</p>
              <p className="text-xs text-zinc-600 mt-1">Add your first micro offer to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
