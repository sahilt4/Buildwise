import React, { useState, useEffect } from "react";
import { Material, Site } from "../types";
import { formatINR, calculateLeftover } from "../utils";
import {
  Sparkles,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Leaf,
  CheckCircle2,
  X,
  Boxes,
} from "lucide-react";

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  sites: Site[];
  selectedSiteId: string;
  onQuickResell: (material: Material) => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  materials,
  sites,
  selectedSiteId,
  onQuickResell,
}) => {
  const [activeSite, setActiveSite] = useState<string>(
    selectedSiteId === "all" ? "site-1" : selectedSiteId
  );
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    async function fetchOptimization() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ai/surplus-optimizer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId: activeSite }),
        });
        const data = await res.json();
        setAnalysisData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOptimization();
  }, [isOpen, activeSite]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                BuildWise Stock & Surplus AI Advisor
              </h2>
              <p className="text-xs text-slate-500">
                Automated surplus reuse detection & waste minimization recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Site Switcher */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Select Site:</span>
          <select
            value={activeSite}
            onChange={(e) => setActiveSite(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.location})
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              Analyzing material consumption patterns & calculating surplus recovery opportunities...
            </p>
          </div>
        ) : analysisData ? (
          <div className="mt-5 space-y-5">
            {/* Value recovery banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent rounded-xl border border-amber-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Recoverable Surplus Capital
                </span>
                <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
                  {formatINR(analysisData.totalSurplusValueRecoverable || 0)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600">Site Recommendation:</span>
                <div className="text-xs font-bold text-emerald-800">
                  Ready for Resale Listing
                </div>
              </div>
            </div>

            {/* Actionable Insights */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Actionable Recommendations
              </h3>
              <div className="space-y-2">
                {analysisData.actionableInsights?.map((insight: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start space-x-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Analysis Items */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stock Optimization Breakdown
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {analysisData.materialsAnalysis?.map((item: any) => (
                  <div key={item.materialId} className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{item.materialName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === "critical_low"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : item.status === "surplus_excess"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status === "surplus_excess" ? "Surplus Excess" : item.status === "critical_low" ? "Critical Low" : "Optimal"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{item.recommendation}</p>

                    {item.status === "surplus_excess" && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-amber-800">
                          Surplus Value: {formatINR(item.leftoverValue)}
                        </span>
                        <button
                          onClick={() => {
                            const m = materials.find((mat) => mat.id === item.materialId);
                            if (m) {
                              onClose();
                              onQuickResell(m);
                            }
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>List on Marketplace</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Close Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
