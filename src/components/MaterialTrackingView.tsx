import React, { useState } from "react";
import { Material, MaterialCategory, MaterialTransaction, Site, ConstructionTask } from "../types";
import { formatINR, calculateLeftover, getLeftoverStockValue } from "../utils";
import {
  Boxes,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  History,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface MaterialTrackingViewProps {
  materials: Material[];
  transactions: MaterialTransaction[];
  sites: Site[];
  tasks: ConstructionTask[];
  selectedSiteId: string;
  onLogPurchase: (data: any) => Promise<void>;
  onLogUsage: (data: any) => Promise<void>;
  onQuickResell: (material: Material) => void;
  onAddNewMaterial: (data: any) => Promise<void>;
}

export const MaterialTrackingView: React.FC<MaterialTrackingViewProps> = ({
  materials,
  transactions,
  sites,
  tasks,
  selectedSiteId,
  onLogPurchase,
  onLogUsage,
  onQuickResell,
  onAddNewMaterial,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Modals state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isNewMaterialModalOpen, setIsNewMaterialModalOpen] = useState(false);
  const [selectedMaterialForAction, setSelectedMaterialForAction] = useState<Material | null>(null);
  const [viewHistoryMaterial, setViewHistoryMaterial] = useState<Material | null>(null);

  // Form states
  const [purchaseForm, setPurchaseForm] = useState({
    materialId: "",
    siteId: selectedSiteId === "all" ? "site-1" : selectedSiteId,
    quantity: 100,
    unitPrice: 0,
    invoiceNumber: "",
    supplier: "",
    notes: "",
  });

  const [usageForm, setUsageForm] = useState({
    materialId: "",
    siteId: selectedSiteId === "all" ? "site-1" : selectedSiteId,
    quantity: 10,
    taskId: "",
    notes: "",
  });

  const [newMatForm, setNewMatForm] = useState({
    name: "",
    category: "cement" as MaterialCategory,
    brand: "",
    unit: "Bags (50kg)",
    initialQuantity: 100,
    unitCost: 380,
    minThreshold: 20,
    siteId: selectedSiteId === "all" ? "site-1" : selectedSiteId,
    invoiceNumber: "",
  });

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    if (selectedSiteId !== "all" && m.siteId !== selectedSiteId) return false;
    if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStatusFilter === "low_stock") {
      return calculateLeftover(m) <= m.minThreshold;
    }
    if (selectedStatusFilter === "surplus") {
      return calculateLeftover(m) > m.minThreshold * 2;
    }
    return true;
  });

  // Handle open purchase modal
  const openPurchaseModal = (mat?: Material) => {
    const targetMat = mat || materials[0];
    if (targetMat) {
      setSelectedMaterialForAction(targetMat);
      setPurchaseForm({
        materialId: targetMat.id,
        siteId: targetMat.siteId,
        quantity: 50,
        unitPrice: targetMat.unitCost,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: "Authorized Regional Distributor",
        notes: `Procurement replenishment for ${targetMat.name}`,
      });
    }
    setIsPurchaseModalOpen(true);
  };

  // Handle open usage modal
  const openUsageModal = (mat?: Material) => {
    const targetMat = mat || materials[0];
    if (targetMat) {
      setSelectedMaterialForAction(targetMat);
      setUsageForm({
        materialId: targetMat.id,
        siteId: targetMat.siteId,
        quantity: 10,
        taskId: tasks[0]?.id || "",
        notes: `Daily site allocation for ${targetMat.name}`,
      });
    }
    setIsUsageModalOpen(true);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogPurchase({
      ...purchaseForm,
      type: "purchase",
    });
    setIsPurchaseModalOpen(false);
  };

  const handleUsageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogUsage({
      ...usageForm,
      type: "usage",
    });
    setIsUsageModalOpen(false);
  };

  const handleCreateNewMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddNewMaterial(newMatForm);
    setIsNewMaterialModalOpen(false);
  };

  const materialHistory = transactions.filter(
    (t) => !viewHistoryMaterial || t.materialId === viewHistoryMaterial.id
  );

  return (
    <div className="space-y-6 pb-12" id="material-tracking-view">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <Boxes className="w-5 h-5 text-amber-500 mr-2" />
              Construction Material Lifecycle & Stock Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track Purchase → Task Consumption → Leftover Calculation → Resale Surplus deduction.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="log-purchase-btn"
            onClick={() => openPurchaseModal()}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Log Purchase</span>
          </button>
          <button
            id="log-usage-btn"
            onClick={() => openUsageModal()}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>- Log Usage</span>
          </button>
          <button
            id="add-material-btn"
            onClick={() => setIsNewMaterialModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material by name, brand (UltraTech, Tata Tiscon, Kajaria)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by material category"
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="cement">Cement & Concrete</option>
            <option value="steel">Steel & TMT Rebars</option>
            <option value="bricks">Bricks & Masonry</option>
            <option value="tiles">Tiles & Ceramics</option>
            <option value="sand_aggregates">Sand & Aggregates</option>
            <option value="paint">Paint & Primers</option>
            <option value="plumbing">Plumbing & CPVC</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            aria-label="Filter by stock status"
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
          >
            <option value="all">All Stock Status</option>
            <option value="surplus">✨ High Surplus (Ready for Resale)</option>
            <option value="low_stock">⚠️ Low Stock Alert</option>
          </select>
        </div>
      </div>

      {/* Material Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Material Details</th>
                <th className="py-3.5 px-4">Site Location</th>
                <th className="py-3.5 px-4 text-center">Purchased</th>
                <th className="py-3.5 px-4 text-center">Used (Tasks)</th>
                <th className="py-3.5 px-4 text-center">Resold</th>
                <th className="py-3.5 px-4 text-center bg-amber-50/60 text-amber-900 font-bold">
                  Leftover Stock
                </th>
                <th className="py-3.5 px-4 text-right">Leftover Value</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((mat) => {
                const leftover = calculateLeftover(mat);
                const isLow = leftover <= mat.minThreshold;
                const isSurplusHigh = leftover > mat.minThreshold * 2;
                const site = sites.find((s) => s.id === mat.siteId);

                return (
                  <tr key={mat.id} className="hover:bg-slate-50/80 transition">
                    {/* Material Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{mat.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="font-medium text-slate-700">{mat.brand}</span>
                        <span>•</span>
                        <span className="capitalize">{mat.category.replace("_", " ")}</span>
                        <span>•</span>
                        <span>{formatINR(mat.unitCost)} / {mat.unit.split(" ")[0]}</span>
                      </div>
                      {isLow && (
                        <div className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-1">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Stock below threshold ({mat.minThreshold})
                        </div>
                      )}
                      {isSurplusHigh && (
                        <div className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-1">
                          ✨ Surplus Available for Marketplace
                        </div>
                      )}
                    </td>

                    {/* Site */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="font-medium text-slate-800">{site?.name || "Nashik Site"}</div>
                      <div className="text-[11px] text-slate-400">{site?.location}</div>
                    </td>

                    {/* Purchased */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      {mat.totalPurchased} <span className="text-[10px] text-slate-400">{mat.unit}</span>
                    </td>

                    {/* Used */}
                    <td className="py-3.5 px-4 text-center font-medium text-blue-700">
                      {mat.totalUsed} <span className="text-[10px] text-slate-400">{mat.unit}</span>
                    </td>

                    {/* Resold */}
                    <td className="py-3.5 px-4 text-center font-medium text-purple-700">
                      {mat.totalResold || 0} <span className="text-[10px] text-slate-400">{mat.unit}</span>
                    </td>

                    {/* Leftover Surplus */}
                    <td className="py-3.5 px-4 text-center bg-amber-50/40 font-bold text-amber-900 text-sm">
                      {leftover} <span className="text-[10px] font-normal text-amber-700">{mat.unit}</span>
                    </td>

                    {/* Leftover Value */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatINR(getLeftoverStockValue(mat))}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openPurchaseModal(mat)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="Log additional purchase"
                        >
                          <ArrowDownLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openUsageModal(mat)}
                          className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition"
                          title="Log task usage"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        {leftover > 0 && (
                          <button
                            onClick={() => onQuickResell(mat)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-bold transition flex items-center space-x-1"
                            title="List surplus stock on Resale Marketplace"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Resell</span>
                          </button>
                        )}
                        <button
                          onClick={() => setViewHistoryMaterial(mat)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-lg transition"
                          title="View Material Audit History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Lifecycle Audit History Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <History className="w-4 h-4 text-slate-600 mr-2" />
              Material Lifecycle Transaction Log (Audit Trail)
              {viewHistoryMaterial && (
                <span className="ml-2 text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Filtered for: {viewHistoryMaterial.name}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only immutable record of every procurement, construction task allocation, and resale transfer
            </p>
          </div>
          {viewHistoryMaterial && (
            <button
              onClick={() => setViewHistoryMaterial(null)}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 mt-2 max-h-96 overflow-y-auto">
          {materialHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No transactions recorded for this material yet.
            </div>
          ) : (
            materialHistory.map((tx) => {
              const mat = materials.find((m) => m.id === tx.materialId);
              return (
                <div key={tx.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        tx.type === "purchase"
                          ? "bg-blue-100 text-blue-700"
                          : tx.type === "usage"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {tx.type === "purchase" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : tx.type === "usage" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900">
                        {tx.type === "purchase"
                          ? `Procured +${tx.quantity} ${mat?.unit || "units"} of ${mat?.name || "Material"}`
                          : tx.type === "usage"
                          ? `Consumed -${tx.quantity} ${mat?.unit || "units"} on Site`
                          : `Surplus Resale Deduction -${tx.quantity} ${mat?.unit || "units"}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span>Logged by: <strong>{tx.loggedBy}</strong></span>
                        {tx.invoiceNumber && <span>• Inv: {tx.invoiceNumber}</span>}
                        {tx.taskTitle && <span>• Task: <strong>{tx.taskTitle}</strong></span>}
                      </div>
                      {tx.notes && <p className="text-[11px] text-slate-600 mt-1 italic">"{tx.notes}"</p>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">
                      {tx.totalCost ? formatINR(tx.totalCost) : ""}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(tx.date).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ----------------- MODAL: LOG PURCHASE ----------------- */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <ArrowDownLeft className="w-5 h-5 text-blue-600 mr-2" />
              Log Material Procurement / Purchase
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Add inbound construction material deliveries to the project stock register.
            </p>

            <form onSubmit={handlePurchaseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Material
                </label>
                <select
                  value={purchaseForm.materialId}
                  onChange={(e) => {
                    const m = materials.find((item) => item.id === e.target.value);
                    setPurchaseForm({
                      ...purchaseForm,
                      materialId: e.target.value,
                      unitPrice: m ? m.unitCost : purchaseForm.unitPrice,
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.brand}) - {m.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Delivered
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseForm.quantity}
                    onChange={(e) =>
                      setPurchaseForm({ ...purchaseForm, quantity: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate per Unit (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseForm.unitPrice}
                    onChange={(e) =>
                      setPurchaseForm({ ...purchaseForm, unitPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice / Challan Reference #
                </label>
                <input
                  type="text"
                  placeholder="e.g. UT-NSK-2026-09"
                  value={purchaseForm.invoiceNumber}
                  onChange={(e) =>
                    setPurchaseForm({ ...purchaseForm, invoiceNumber: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Delivery Inspection
                </label>
                <input
                  type="text"
                  placeholder="Batch #, moisture inspection passed, stored in shed"
                  value={purchaseForm.notes}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Record Procurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: LOG USAGE ----------------- */}
      {isUsageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <ArrowUpRight className="w-5 h-5 text-amber-600 mr-2" />
              Log Material Usage on Site
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Deducts stock against assigned construction tasks and recalculates leftover surplus.
            </p>

            <form onSubmit={handleUsageSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Material
                </label>
                <select
                  value={usageForm.materialId}
                  onChange={(e) => setUsageForm({ ...usageForm, materialId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Available Leftover: {calculateLeftover(m)} {m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity Consumed
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={usageForm.quantity}
                  onChange={(e) =>
                    setUsageForm({ ...usageForm, quantity: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Linked Construction Task
                </label>
                <select
                  value={usageForm.taskId}
                  onChange={(e) => setUsageForm({ ...usageForm, taskId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  <option value="">-- General Site Consumption --</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Usage Location / Activity Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3rd Floor column casting, Beam Grid C2-C6"
                  value={usageForm.notes}
                  onChange={(e) => setUsageForm({ ...usageForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUsageModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Confirm Usage Deduction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ADD NEW MATERIAL LINE ----------------- */}
      {isNewMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <Plus className="w-5 h-5 text-emerald-600 mr-2" />
              Add New Material to Site Inventory
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Catalog a new construction material type for inventory lifecycle tracking.
            </p>

            <form onSubmit={handleCreateNewMaterial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Material Name & Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACC Gold Water Shield Cement"
                  value={newMatForm.name}
                  onChange={(e) => setNewMatForm({ ...newMatForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newMatForm.category}
                    onChange={(e) =>
                      setNewMatForm({
                        ...newMatForm,
                        category: e.target.value as MaterialCategory,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="cement">Cement</option>
                    <option value="steel">Steel / TMT</option>
                    <option value="bricks">Bricks / AAC Blocks</option>
                    <option value="tiles">Tiles / Marbles</option>
                    <option value="sand_aggregates">Sand / Aggregates</option>
                    <option value="paint">Paint / Primers</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="wood_timber">Wood & Timber</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UltraTech, Tata Steel"
                    value={newMatForm.brand}
                    onChange={(e) => setNewMatForm({ ...newMatForm, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="Bags (50kg), MT, Sqft"
                    value={newMatForm.unit}
                    onChange={(e) => setNewMatForm({ ...newMatForm, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMatForm.initialQuantity}
                    onChange={(e) =>
                      setNewMatForm({ ...newMatForm, initialQuantity: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMatForm.unitCost}
                    onChange={(e) =>
                      setNewMatForm({ ...newMatForm, unitCost: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewMaterialModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Create Material Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
