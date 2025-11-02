import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DestinationStep from "./orderSteps/DestinationStep";
import ContainerStep from "./orderSteps/ContainerStep";
import ArticlesStep from "./orderSteps/ArticlesStep";
import SummaryStep from "./orderSteps/Summary";

// Minimal container weights data. Replace with real data when available.
const containerweights: Record<
  string,
  Array<{ Region: string; Port?: string; note?: string }>
> = {
  Germany: [
    { Region: "Hamburg", Port: "Hamburg" },
    { Region: "Bremerhaven", Port: "Bremerhaven" },
  ],
  USA: [
    { Region: "East Coast", Port: "New York" },
    { Region: "West Coast", Port: "Los Angeles" },
  ],
};

type ArticleShape = "Rechteck" | "Zylinder" | "";

type Article = {
  name: string;
  amount: number;
  weight: number; // kg per unit
  shape: ArticleShape;
  // rectangle
  height?: number; // cm
  length?: number; // cm
  width?: number; // cm
  // cylinder
  diameter?: number; // cm
  // pallet
  usesPallet: boolean;
  palletHeight?: number;
  palletLength?: number;
  palletWidth?: number;
};

const defaultArticle: Article = {
  name: "",
  amount: 1,
  weight: 0,
  shape: "",
  height: undefined,
  length: undefined,
  width: undefined,
  diameter: undefined,
  usesPallet: false,
  palletHeight: undefined,
  palletLength: undefined,
  palletWidth: undefined,
};

export default function OrderForm() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const [c20, setC20] = useState(false);
  const [c40, setC40] = useState(false);
  const [c40hc, setC40hc] = useState(false);
  const [c40hw, setC40hw] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [jsonPreview, setJsonPreview] = useState<string>("");

  // Navigation steps
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps = [
    { id: "destination", title: "Destination" },
    { id: "containers", title: "Containers" },
    { id: "articles", title: "Articles" },
    { id: "summary", title: "Summary" },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const regions = useMemo(() => {
    if (!selectedCountry) return [] as Array<{ Region: string; Port?: string }>;
    return containerweights[selectedCountry] || [];
  }, [selectedCountry]);

  const totalUnits = useMemo(
    () => articles.reduce((sum, a) => sum + (a.amount || 0), 0),
    [articles]
  );
  const totalWeightKg = useMemo(
    () =>
      articles.reduce((sum, a) => sum + (a.amount || 0) * (a.weight || 0), 0),
    [articles]
  );

  const addArticle = (article: Article) => {
    setArticles((prev) => [...prev, article]);
  };

  const removeArticle = (index: number) => {
    setArticles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArticle = (index: number, patch: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a))
    );
  };

  const exportJSON = () => {
    const payload = {
      country: selectedCountry || null,
      region: selectedRegion || null,
      containers: {
        c20,
        c40,
        c40hc,
        c40hw,
      },
      articles: articles.map((a) => ({
        name: a.name,
        amount: a.amount,
        weight: a.weight,
        shape: a.shape,
        dimensions:
          a.shape === "Rechteck"
            ? {
                height: a.height ?? 0,
                length: a.length ?? 0,
                width: a.width ?? 0,
              }
            : a.shape === "Zylinder"
            ? { height: a.height ?? 0, diameter: a.diameter ?? 0 }
            : {},
        pallet: a.usesPallet
          ? {
              height: a.palletHeight ?? 0,
              length: a.palletLength ?? 0,
              width: a.palletWidth ?? 0,
            }
          : null,
      })),
      meta: {
        generatedAt: new Date().toISOString(),
      },
    };

    const json = JSON.stringify(payload, null, 2);
    setJsonPreview(json);

    // Trigger download
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-6 py-10 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create Order
          </h1>
          <p className="text-sm/6 text-slate-300">
            Follow the steps to specify destination, pick container types, add
            articles, and review your order.
          </p>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-2xl" />
      </header>

      {/* Step progress bar */}
      <div className="mt-6 flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  index <= currentStep
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-1 w-16 transition-colors ${
                  index < currentStep ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Main form */}
        <div className="space-y-8 lg:col-span-2">
          {/* Destination */}
          {currentStep === 0 && (
            <DestinationStep
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              regions={regions}
              containerweights={containerweights}
            />
          )}

          {/* Containers */}
          {currentStep === 1 && (
            <ContainerStep
              c20={c20}
              setC20={setC20}
              c40={c40}
              setC40={setC40}
              c40hc={c40hc}
              setC40hc={setC40hc}
              c40hw={c40hw}
              setC40hw={setC40hw}
            />
          )}

          {/* Articles */}
          {currentStep === 2 && (
            <ArticlesStep
              articles={articles}
              totalUnits={totalUnits}
              totalWeightKg={totalWeightKg}
              addArticle={addArticle}
              removeArticle={removeArticle}
              updateArticle={updateArticle}
            />
          )}

          {/* Summary */}
          {currentStep === 3 && (
            <SummaryStep
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              c20={c20}
              c40={c40}
              c40hc={c40hc}
              c40hw={c40hw}
              articles={articles}
              totalUnits={totalUnits}
              totalWeightKg={totalWeightKg}
              onCreateOrder={exportJSON}
            />
          )}

          {/* Step navigation */}
          <div className="flex justify-between">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button onClick={nextStep} className="ml-auto">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
