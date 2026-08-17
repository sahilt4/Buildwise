import React from "react";
import {
  Site,
  Material,
  ResaleListing,
  ConstructionTask,
  AttendanceRecord,
  SustainabilityMetrics,
  User,
} from "../types";
import { formatINR, formatNumber, calculateLeftover, getLeftoverStockValue } from "../utils";
import {
  Boxes,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Leaf,
  Layers,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
} from "lucide-react";

interface DashboardViewProps {
  sites: Site[];
  materials: Material[];
  listings: ResaleListing[];
  tasks: ConstructionTask[];
  attendance: AttendanceRecord[];
  sustainability: SustainabilityMetrics;
  selectedSiteId: string;
  onNavigateTab: (tab: any) => void;
  onQuickResell: (material: Material) => void;
  onOpenAIAdvisor: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sites,
  materials,
  listings,
  tasks,
  attendance,
  sustainability,
  selectedSiteId,
  onNavigateTab,
  onQuickResell,
  onOpenAIAdvisor,
}) => {
  // Filter by selected site if not "all"
  const activeMaterials =
    selectedSiteId === "all" ? materials : materials.filter((m) => m.siteId === selectedSiteId);
  const activeTasks = selectedSiteId === "all" ? tasks : tasks.filter((t) => t.siteId === selectedSiteId);
  const activeAttendance =
    selectedSiteId === "all" ? attendance : attendance.filter((a) => a.siteId === selectedSiteId);
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = activeAttendance.filter((a) => a.date === today);

  // Compute stock values
  const totalInventoryValue = activeMaterials.reduce(
    (sum, m) => sum + (m.totalPurchased - m.totalResold) * m.unitCost,
    0
  );

  const totalSurplusValue = activeMaterials.reduce((sum, m) => {
    const leftover = calculateLeftover(m);
    return leftover > 0 ? sum + leftover * m.unitCost : sum;
  }, 0);

  const lowStockCount = activeMaterials.filter((m) => calculateLeftover(m) <= m.minThreshold).length;
  const inProgressTasks = activeTasks.filter((t) => t.status === "in_progress");
  const completedTasks = activeTasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6 pb-12" id="dashboard-view">
      {/* Top Banner / Welcome with Sustainability Highlight */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Leaf className="w-3 h-3 mr-1 text-emerald-400" />
                Zero Material Waste Initiative
              </span>
              <span className="text-xs text-slate-400">
                {selectedSiteId === "all" ? "Multi-Site Construction Hub" : sites.find((s) => s.id === selectedSiteId)?.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Construction Operations & Material Lifecycle Command
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Real-time tracking of procurement, daily task consumption, surplus resale marketplace, and digital QR attendance across Nashik construction sites.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("materials")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center space-x-1.5"
            >
              <Boxes className="w-4 h-4" />
              <span>Log Material</span>
            </button>
            <button
              onClick={() => onNavigateTab("marketplace")}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-xs sm:text-sm transition border border-slate-600 flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Marketplace</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stock Value */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Active Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {formatINR(totalInventoryValue)}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center">
            <span>{activeMaterials.length} cataloged material lines</span>
          </div>
        </div>

        {/* Live Labor on Site */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On-Site Labor Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              {todayAttendance.length} Workers
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              QR Verified
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>{todayAttendance.filter((a) => a.checkOutTime).length} checked out</span>
            <button
              onClick={() => onNavigateTab("attendance")}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center"
            >
              Scan <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Surplus Value for Resale */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surplus Leftover Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-amber-700">
              {formatINR(totalSurplusValue)}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>{listings.filter((l) => l.status === "available").length} active resale lots</span>
            <button
              onClick={() => onNavigateTab("marketplace")}
              className="text-amber-700 hover:text-amber-800 font-medium text-xs flex items-center"
            >
              Resell <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Environmental & Waste Savings */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Waste Diverted
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-teal-700">
              {formatNumber(sustainability.totalWasteDivertedKg)} kg
            </span>
            <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
              ~{(sustainability.totalWasteDivertedKg / 1000).toFixed(1)} T
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center">
            <span>{formatNumber(sustainability.carbonOffsetKg)} kg CO₂ offset</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Material Stock Lifecycle & Live Labor/Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Material Lifecycle Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Material Stock Tracker Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center">
                  <Boxes className="w-4 h-4 text-amber-500 mr-2" />
                  Material Lifecycle Stock Breakdown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Purchased vs. Consumed vs. Leftover Surplus (Formula: Leftover = Purchased - Used - Resold)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("materials")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              >
                View Full Inventory <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* List of Materials with Progress Bars */}
            <div className="divide-y divide-slate-100 mt-3">
              {activeMaterials.slice(0, 5).map((mat) => {
                const leftover = calculateLeftover(mat);
                const usedPercent = Math.min(100, Math.round((mat.totalUsed / mat.totalPurchased) * 100)) || 0;
                const resoldPercent = Math.min(100, Math.round(((mat.totalResold || 0) / mat.totalPurchased) * 100)) || 0;
                const leftoverPercent = Math.max(0, 100 - usedPercent - resoldPercent);
                const isLow = leftover <= mat.minThreshold;
                const isSurplusHigh = leftover > mat.minThreshold * 2;

                return (
                  <div key={mat.id} className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900">{mat.name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {mat.category}
                          </span>
                          {isLow && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center">
                              <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Low Stock
                            </span>
                          )}
                          {isSurplusHigh && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Surplus Available
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-3">
                          <span>
                            Purchased: <strong>{mat.totalPurchased}</strong> {mat.unit}
                          </span>
                          <span>•</span>
                          <span>
                            Used: <strong>{mat.totalUsed}</strong> {mat.unit}
                          </span>
                          <span>•</span>
                          <span className="text-amber-800 font-semibold">
                            Leftover: <strong>{leftover}</strong> {mat.unit}
                          </span>
                        </div>
                      </div>

                      {/* Action: Resell surplus button */}
                      {leftover > 0 && (
                        <button
                          onClick={() => onQuickResell(mat)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition shrink-0 flex items-center space-x-1"
                          title="List surplus stock on Resale Marketplace"
                        >
                          <ShoppingBag className="w-3 h-3 text-amber-600" />
                          <span>Resell</span>
                        </button>
                      )}
                    </div>

                    {/* Stacked Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                      {/* Used portion */}
                      <div
                        style={{ width: `${usedPercent}%` }}
                        className="bg-blue-600 h-full"
                        title={`Used: ${mat.totalUsed} ${mat.unit} (${usedPercent}%)`}
                      />
                      {/* Resold portion */}
                      <div
                        style={{ width: `${resoldPercent}%` }}
                        className="bg-purple-500 h-full"
                        title={`Resold: ${mat.totalResold || 0} ${mat.unit} (${resoldPercent}%)`}
                      />
                      {/* Leftover surplus portion */}
                      <div
                        style={{ width: `${leftoverPercent}%` }}
                        className="bg-amber-400 h-full"
                        title={`Leftover Surplus: ${leftover} ${mat.unit} (${leftoverPercent}%)`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mr-1" /> Used ({usedPercent}%)
                        </span>
                        {mat.totalResold > 0 && (
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-1" /> Resold ({resoldPercent}%)
                          </span>
                        )}
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-amber-400 mr-1" /> Leftover ({leftoverPercent}%)
                        </span>
                      </div>
                      <span className="font-medium text-slate-700">
                        Leftover Value: {formatINR(getLeftoverStockValue(mat))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Tasks & Site Workflows */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center">
                  <Clock className="w-4 h-4 text-blue-500 mr-2" />
                  Active Construction Tasks & Assigned Workforce
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tasks linked to materials and verified labor assignments
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("tasks")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
              >
                All Tasks ({activeTasks.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {activeTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          task.priority === "urgent"
                            ? "bg-rose-500 animate-ping"
                            : task.priority === "high"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {task.title}
                      </span>
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                        {task.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center space-x-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-400" /> Due: {task.dueDate}
                      </span>
                      <span>•</span>
                      <span>
                        {task.assignedWorkerIds.length} worker(s) assigned
                      </span>
                      {task.requiredMaterials && task.requiredMaterials.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">
                            {task.requiredMaterials.length} material(s) linked
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        task.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : task.status === "in_progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Live Attendance & Resale Highlights */}
        <div className="space-y-6">
          {/* Live Labor Presence Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">Today's Site Attendance</h2>
              </div>
              <button
                onClick={() => onNavigateTab("attendance")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                QR Roster
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {todayAttendance.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No workers checked in yet today.
                </div>
              ) : (
                todayAttendance.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {rec.workerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {rec.workerName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {rec.workerRole} • In: {rec.checkInTime}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {rec.checkOutTime ? `Out: ${rec.checkOutTime}` : "Active On-Site"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Daily Labor Rate Avg: <strong>₹900/day</strong></span>
              <button
                onClick={() => onNavigateTab("attendance")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Check In / Out →
              </button>
            </div>
          </div>

          {/* Featured Resale Marketplace Items */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white rounded-xl border border-amber-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">Surplus Resale Hub</h2>
              </div>
              <button
                onClick={() => onNavigateTab("marketplace")}
                className="text-xs text-amber-800 hover:text-amber-900 font-bold"
              >
                Explore Market →
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2.5">
              Available leftover construction materials from verified Nashik project sites:
            </p>

            <div className="mt-3 space-y-3">
              {listings.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab("marketplace")}
                  className="p-3 bg-white rounded-xl border border-amber-100 hover:border-amber-300 shadow-2xs cursor-pointer transition flex items-center space-x-3"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{item.title}</h3>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1.5">
                      <span className="font-semibold text-emerald-700">
                        {formatINR(item.pricePerUnit)} / {item.unit.split(" ")[0]}
                      </span>
                      <span>•</span>
                      <span className="truncate">{item.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60">
              <button
                onClick={() => onNavigateTab("marketplace")}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse All Surplus Listings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
