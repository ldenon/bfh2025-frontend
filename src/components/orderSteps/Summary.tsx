import type { Article } from "@/types/order";
import { Button } from "@/components/ui/button";

interface SummaryStepProps {
  selectedCountry: string;
  selectedRegion: string;
  c20: boolean;
  c40: boolean;
  c40hc: boolean;
  c40hw: boolean;
  articles: Article[];
  totalUnits: number;
  totalWeightKg: number;
  onCreateOrder: () => void;
}

export default function SummaryStep({
  selectedCountry,
  selectedRegion,
  c20,
  c40,
  c40hc,
  c40hw,
  articles,
  totalUnits,
  totalWeightKg,
  onCreateOrder,
}: SummaryStepProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-3">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <span className="text-xs text-slate-500">Step 4 of 4</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Destination */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Destination</h3>
          <div className="text-sm">
            <div>Country: {selectedCountry || "—"}</div>
            <div>Region: {selectedRegion || "—"}</div>
          </div>
        </div>

        {/* Containers */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">
            Container Types
          </h3>
          <div className="flex flex-wrap gap-1">
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

        {/* Articles summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-800">Articles</h3>
          <div className="text-sm">
            <div>{articles.length} articles</div>
            <div>{totalUnits} units</div>
            <div>{totalWeightKg.toFixed(1)} kg total weight</div>
          </div>
        </div>
      </div>

      {/* Articles details */}
      <div className="mt-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Article Details
        </h3>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={index} className="rounded-lg border p-4 bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <span className="font-medium">{article.name || "Unnamed"}</span>
              </div>
              <div className="text-sm text-slate-600">
                Amount: {article.amount}, Weight: {article.weight} kg, Shape:{" "}
                {article.shape || "—"}
                {article.shape === "Rechteck" &&
                  `, Dimensions: ${article.length}x${article.width}x${article.height} cm`}
                {article.shape === "Zylinder" &&
                  `, Height: ${article.height} cm, Diameter: ${article.diameter} cm`}
                {article.usesPallet &&
                  `, Pallet: ${article.palletLength}x${article.palletWidth}x${article.palletHeight} cm`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Order Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onCreateOrder}
          className="bg-slate-900 hover:bg-slate-800"
        >
          Create Order
        </Button>
      </div>
    </section>
  );
}
