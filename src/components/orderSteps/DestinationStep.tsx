import React from "react";

interface DestinationStepProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  regions: Array<{ Region: string; Port?: string }>;
  containerweights: Record<
    string,
    Array<{ Region: string; Port?: string; note?: string }>
  >;
}

export default function DestinationStep({
  selectedCountry,
  setSelectedCountry,
  selectedRegion,
  setSelectedRegion,
  regions,
  containerweights,
}: DestinationStepProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Destination</h2>
        <span className="text-xs text-slate-500">Step 1 of 4</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Country</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedRegion("");
            }}
          >
            <option value="">Select a country</option>
            {Object.keys(containerweights).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Region</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Select a region</option>
            {regions.map((r) => (
              <option key={r.Region} value={r.Region}>
                {r.Region}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
