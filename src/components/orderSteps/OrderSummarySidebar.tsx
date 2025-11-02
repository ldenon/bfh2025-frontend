import React from "react";
import { Button } from "@/components/ui/button";

interface OrderSummarySidebarProps {
  selectedCountry: string;
  selectedRegion: string;
  c20: boolean;
  c40: boolean;
  c40hc: boolean;
  c40hw: boolean;
  articles: Array<{
    name: string;
    amount: number;
    weight: number;
    shape: string;
    height?: number;
    length?: number;
    width?: number;
    diameter?: number;
    usesPallet: boolean;
    palletHeight?: number;
    palletLength?: number;
    palletWidth?: number;
  }>;
  totalUnits: number;
  totalWeightKg: number;
  exportJSON: () => void;
}

export default function OrderSummarySidebar({
  selectedCountry,
  selectedRegion,
  c20,
  c40,
  c40hc,
  c40hw,
  articles,
  totalUnits,
  totalWeightKg,
  exportJSON,
}: OrderSummarySidebarProps) {
  return (
    <aside className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Order Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Country</span>
            <span className="font-medium text-slate-800">
              {selectedCountry || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Region</span>
            <span className="font-medium text-slate-800">
              {selectedRegion || "—"}
            </span>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Container Types</span>
            <div className="flex flex-wrap justify-end gap-1">
              {c20 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  20"
                </span>
              )}
              {c40 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  40"
                </span>
              )}
              {c40hc && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  40" HC
                </span>
              )}
              {c40hw && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                  40" HW
                </span>
              )}
              {!c20 && !c40 && !c40hc && !c40hw && (
                <span className="text-slate-400">—</span>
              )}
            </div>
          </div>
          <div className="h-px w-full bg-slate-100" />
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Articles</span>
            <span className="font-medium text-slate-800">
              {articles.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Units</span>
            <span className="font-medium text-slate-800">{totalUnits}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total weight</span>
            <span className="font-medium text-slate-800">
              {totalWeightKg.toFixed(1)} kg
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button className="w-full" onClick={exportJSON}>
            Create order
          </Button>
        </div>
      </section>
    </aside>
  );
}
