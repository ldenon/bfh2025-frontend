import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { Article, ArticleShape } from "@/types/order";

interface ArticlesStepProps {
  articles: Article[];
  totalUnits: number;
  totalWeightKg: number;
  addArticle: (article: Article) => void;
  removeArticle: (index: number) => void;
  updateArticle: (index: number, patch: Partial<Article>) => void;
}

const defaultFormArticle: Article = {
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

export default function ArticlesStep({
  articles,
  totalUnits,
  totalWeightKg,
  addArticle,
  removeArticle,
  updateArticle,
}: ArticlesStepProps) {
  const [formArticle, setFormArticle] = useState<Article>({
    ...defaultFormArticle,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFormChange = (field: keyof Article, value: any) => {
    setFormArticle((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddArticle = () => {
    if (!formArticle.name.trim()) return; // Require name

    if (editingIndex !== null) {
      updateArticle(editingIndex, formArticle);
      setEditingIndex(null);
    } else {
      addArticle({ ...formArticle });
    }

    setFormArticle({ ...defaultFormArticle });
  };

  const handleEditArticle = (index: number) => {
    setFormArticle({ ...articles[index] });
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setFormArticle({ ...defaultFormArticle });
    setEditingIndex(null);
  };

  const isRect = formArticle.shape === "Rechteck";
  const isCyl = formArticle.shape === "Zylinder";

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Articles</h2>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Step 3 of 4</span>
          <span>•</span>
          <span>{articles.length} items</span>
          <span>•</span>
          <span>{totalUnits} units</span>
          <span>•</span>
          <span>{totalWeightKg.toFixed(1)} kg</span>
        </div>
      </div>

      {/* Add/Edit Article Form */}
      <div className="mb-6 rounded-lg border bg-slate-50 p-4">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          {editingIndex !== null ? "Edit Article" : "Add New Article"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="e.g. Schrauben"
              value={formArticle.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              min={1}
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formArticle.amount}
              onChange={(e) =>
                handleFormChange("amount", Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              min={0}
              step="0.1"
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formArticle.weight}
              onChange={(e) =>
                handleFormChange("weight", Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Shape
            </label>
            <select
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={formArticle.shape}
              onChange={(e) =>
                handleFormChange("shape", e.target.value as ArticleShape)
              }
            >
              <option value="">Select shape</option>
              <option value="Rechteck">Rectangle</option>
              <option value="Zylinder">Cylinder</option>
            </select>
          </div>
        </div>

        {/* Dimensions */}
        {(isRect || isCyl) && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-slate-700">
              Dimensions (cm)
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              {isRect && (
                <>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Height"
                    value={formArticle.height ?? ""}
                    onChange={(e) =>
                      handleFormChange("height", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Length"
                    value={formArticle.length ?? ""}
                    onChange={(e) =>
                      handleFormChange("length", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Width"
                    value={formArticle.width ?? ""}
                    onChange={(e) =>
                      handleFormChange("width", Number(e.target.value))
                    }
                  />
                </>
              )}
              {isCyl && (
                <>
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Height"
                    value={formArticle.height ?? ""}
                    onChange={(e) =>
                      handleFormChange("height", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    placeholder="Diameter"
                    value={formArticle.diameter ?? ""}
                    onChange={(e) =>
                      handleFormChange("diameter", Number(e.target.value))
                    }
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Pallet */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={formArticle.usesPallet}
              onChange={(e) => handleFormChange("usesPallet", e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700">
              Use pallet
            </span>
          </label>

          {formArticle.usesPallet && (
            <div className="mt-2 grid gap-4 md:grid-cols-3">
              <input
                type="number"
                min={0}
                step="0.1"
                className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Pallet Height (cm)"
                value={formArticle.palletHeight ?? ""}
                onChange={(e) =>
                  handleFormChange("palletHeight", Number(e.target.value))
                }
              />
              <input
                type="number"
                min={0}
                step="0.1"
                className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Pallet Length (cm)"
                value={formArticle.palletLength ?? ""}
                onChange={(e) =>
                  handleFormChange("palletLength", Number(e.target.value))
                }
              />
              <input
                type="number"
                min={0}
                step="0.1"
                className="rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Pallet Width (cm)"
                value={formArticle.palletWidth ?? ""}
                onChange={(e) =>
                  handleFormChange("palletWidth", Number(e.target.value))
                }
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleAddArticle}
            disabled={!formArticle.name.trim()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingIndex !== null ? "Update Article" : "Add Article"}
          </Button>
          {editingIndex !== null && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Articles List */}
      {articles.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">
            Added Articles ({articles.length})
          </h3>
          <div className="space-y-2">
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded border bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      {article.name || "Unnamed"}
                    </div>
                    <div className="text-slate-600">
                      {article.amount} × {article.weight}kg ={" "}
                      {(article.amount * article.weight).toFixed(1)}kg
                      {article.shape && ` • ${article.shape}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditArticle(index)}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Edit article"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeArticle(index)}
                    className="p-1 text-red-600 hover:text-red-900"
                    title="Remove article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
