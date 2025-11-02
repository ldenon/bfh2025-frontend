import React from "react";

interface ContainerStepProps {
  c20: boolean;
  setC20: (checked: boolean) => void;
  c40: boolean;
  setC40: (checked: boolean) => void;
  c40hc: boolean;
  setC40hc: (checked: boolean) => void;
  c40hw: boolean;
  setC40hw: (checked: boolean) => void;
}

export default function ContainerStep({
  c20,
  setC20,
  c40,
  setC40,
  c40hc,
  setC40hc,
  c40hw,
  setC40hw,
}: ContainerStepProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Container Types</h2>
        <span className="text-xs text-slate-500">Step 2 of 4</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Container 20"', checked: c20, onChange: setC20 },
          { label: 'Container 40"', checked: c40, onChange: setC40 },
          {
            label: 'Container 40" High Cube',
            checked: c40hc,
            onChange: setC40hc,
          },
          {
            label: 'Container 40" Heavy Weight',
            checked: c40hw,
            onChange: setC40hw,
          },
        ].map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => opt.onChange(!opt.checked)}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all hover:shadow-sm ${
              opt.checked
                ? "border-slate-900 bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                opt.checked ? "bg-green-400" : "bg-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
