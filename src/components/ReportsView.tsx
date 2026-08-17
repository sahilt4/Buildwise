import React, { useState } from "react";
import { Material, AttendanceRecord, ResaleListing, ConstructionTask, Site, SustainabilityMetrics } from "../types";
import { formatINR, formatNumber, calculateLeftover, getLeftoverStockValue } from "../utils";
import {
  BarChart3,
  Printer,
  Download,
  FileSpreadsheet,
  Leaf,
  Boxes,
  Users,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Building,
} from "lucide-react";

interface ReportsViewProps {
  materials: Material[];
  attendance: AttendanceRecord[];
  listings: ResaleListing[];
  tasks: ConstructionTask[];
  sites: Site[];
  sustainability: SustainabilityMetrics;
  selectedSiteId: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  materials,
  attendance,
  listings,
  tasks,
  sites,
  sustainability,
  selectedSiteId,
}) => {
  const [reportType, setReportType] = useState<
    "material_audit" | "attendance_payroll" | "resale_impact" | "task_progress"
  >("material_audit");

  const activeMaterials =
    selectedSiteId === "all" ? materials : materials.filter((m) => m.siteId === selectedSiteId);
  const activeAttendance =
    selectedSiteId === "all" ? attendance : attendance.filter((a) => a.siteId === selectedSiteId);
  const activeTasks =
    selectedSiteId === "all" ? tasks : tasks.filter((t) => t.siteId === selectedSiteId);

  // CSV Export utility
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === "material_audit") {
      csvContent += "Material Name,Category,Brand,Purchased,Used,Resold,Leftover Surplus,Unit,Unit Cost (INR),Leftover Stock Value (INR)\n";
      activeMaterials.forEach((m) => {
        const leftover = calculateLeftover(m);
        const val = getLeftoverStockValue(m);
        csvContent += `"${m.name}","${m.category}","${m.brand}",${m.totalPurchased},${m.totalUsed},${m.totalResold || 0},${leftover},"${m.unit}",${m.unitCost},${val}\n`;
      });
    } else if (reportType === "attendance_payroll") {
      csvContent += "Worker Name,Role,Site,Date,Check In,Check Out,Total Hours,Overtime Hours,Wage Earned (INR)\n";
      activeAttendance.forEach((a) => {
        csvContent += `"${a.workerName}","${a.workerRole}","${a.siteName}","${a.date}","${a.checkInTime}","${a.checkOutTime || 'Active'}",${a.totalHours || 8},${a.overtimeHours || 0},${a.dailyWageEarned || 850}\n`;
      });
    } else if (reportType === "resale_impact") {
      csvContent += "Listing Title,Category,Quantity,Unit,Resale Price (INR),Original Price (INR),Status,Location,Inquiries\n";
      listings.forEach((l) => {
        csvContent += `"${l.title}","${l.category}",${l.quantity},"${l.unit}",${l.pricePerUnit},${l.originalCostPerUnit},"${l.status}","${l.location}",${l.buyerInquiries.length}\n`;
      });
    } else {
      csvContent += "Task Title,Category,Priority,Status,Due Date,Est Hours,Actual Hours\n";
      activeTasks.forEach((t) => {
        csvContent += `"${t.title}","${t.category}","${t.priority}","${t.status}","${t.dueDate}",${t.estimatedHours},${t.actualHours}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BuildWise_${reportType}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12" id="reports-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 text-amber-500 mr-2" />
              Real-Time Construction Analytics & Audit Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with Academic Design Thinking Project 14 (BuildWise) deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType("material_audit")}
          className={`p-3.5 rounded-xl border text-left transition ${
            reportType === "material_audit"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Boxes className={`w-4 h-4 mb-2 ${reportType === "material_audit" ? "text-amber-400" : "text-slate-400"}`} />
          <div className="font-bold text-xs sm:text-sm">Material Lifecycle & Wastage</div>
          <div className={`text-[10px] mt-0.5 ${reportType === "material_audit" ? "text-slate-300" : "text-slate-500"}`}>
            Procurement vs task consumption
          </div>
        </button>

        <button
          onClick={() => setReportType("attendance_payroll")}
          className={`p-3.5 rounded-xl border text-left transition ${
            reportType === "attendance_payroll"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className={`w-4 h-4 mb-2 ${reportType === "attendance_payroll" ? "text-amber-400" : "text-slate-400"}`} />
          <div className="font-bold text-xs sm:text-sm">Workforce QR & Payroll</div>
          <div className={`text-[10px] mt-0.5 ${reportType === "attendance_payroll" ? "text-slate-300" : "text-slate-500"}`}>
            Hours, overtime & disbursements
          </div>
        </button>

        <button
          onClick={() => setReportType("resale_impact")}
          className={`p-3.5 rounded-xl border text-left transition ${
            reportType === "resale_impact"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Leaf className={`w-4 h-4 mb-2 ${reportType === "resale_impact" ? "text-amber-400" : "text-slate-400"}`} />
          <div className="font-bold text-xs sm:text-sm">Surplus Resale & Carbon Offset</div>
          <div className={`text-[10px] mt-0.5 ${reportType === "resale_impact" ? "text-slate-300" : "text-slate-500"}`}>
            Waste diverted & financial return
          </div>
        </button>

        <button
          onClick={() => setReportType("task_progress")}
          className={`p-3.5 rounded-xl border text-left transition ${
            reportType === "task_progress"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 mb-2 ${reportType === "task_progress" ? "text-amber-400" : "text-slate-400"}`} />
          <div className="font-bold text-xs sm:text-sm">Task Progress & Milestones</div>
          <div className={`text-[10px] mt-0.5 ${reportType === "task_progress" ? "text-slate-300" : "text-slate-500"}`}>
            Site productivity metrics
          </div>
        </button>
      </div>

      {/* RENDERED REPORT CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 print:shadow-none print:border-none">
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-200 gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              BuildWise Official Report • {new Date().toLocaleDateString()}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {reportType === "material_audit" && "Material Inventory & Surplus Stock Audit Report"}
              {reportType === "attendance_payroll" && "Labor Attendance Roster & Payroll Disbursal Summary"}
              {reportType === "resale_impact" && "Surplus Marketplace Resale & Environmental Impact Statement"}
              {reportType === "task_progress" && "Construction Milestones & Task Completion Report"}
            </h2>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Scope: {selectedSiteId === "all" ? "All Regional Sites" : sites.find((s) => s.id === selectedSiteId)?.name}</div>
            <div>Generated by: BuildWise Platform</div>
          </div>
        </div>

        {/* 1. Material Audit Table */}
        {reportType === "material_audit" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Material & Brand</th>
                  <th className="py-2.5 px-3 text-center">Purchased</th>
                  <th className="py-2.5 px-3 text-center">Used</th>
                  <th className="py-2.5 px-3 text-center">Resold</th>
                  <th className="py-2.5 px-3 text-center bg-amber-50/60 font-bold">Leftover Surplus</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Leftover Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeMaterials.map((m) => {
                  const leftover = calculateLeftover(m);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {m.name} <span className="text-[10px] text-slate-500">({m.brand})</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">{m.totalPurchased} {m.unit.split(" ")[0]}</td>
                      <td className="py-2.5 px-3 text-center">{m.totalUsed} {m.unit.split(" ")[0]}</td>
                      <td className="py-2.5 px-3 text-center">{m.totalResold || 0}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-900 bg-amber-50/40">
                        {leftover} {m.unit.split(" ")[0]}
                      </td>
                      <td className="py-2.5 px-3 text-right">{formatINR(m.unitCost)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatINR(getLeftoverStockValue(m))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Attendance & Payroll Table */}
        {reportType === "attendance_payroll" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Worker</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Site</th>
                  <th className="py-2.5 px-3 text-center">In / Out</th>
                  <th className="py-2.5 px-3 text-center">Hours</th>
                  <th className="py-2.5 px-3 text-right">Wage (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeAttendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">{a.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{a.workerName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{a.workerRole}</td>
                    <td className="py-2.5 px-3">{a.siteName.split(" ")[0]}</td>
                    <td className="py-2.5 px-3 text-center">
                      {a.checkInTime} - {a.checkOutTime || "Active"}
                    </td>
                    <td className="py-2.5 px-3 text-center">{a.totalHours || 8} hrs</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {formatINR(a.dailyWageEarned || 850)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Resale & Sustainability Report */}
        {reportType === "resale_impact" && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-800">Total Waste Prevented</div>
                <div className="text-2xl font-bold text-emerald-900 mt-1">
                  {formatNumber(sustainability.totalWasteDivertedKg)} kg
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">~{(sustainability.totalWasteDivertedKg/1000).toFixed(1)} Metric Tonnes</div>
              </div>

              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                <div className="text-xs font-semibold text-teal-800">CO₂ Emission Reduction</div>
                <div className="text-2xl font-bold text-teal-900 mt-1">
                  {formatNumber(sustainability.carbonOffsetKg)} kg CO₂
                </div>
                <div className="text-[11px] text-teal-700 mt-0.5">Calculated for regional cement/steel reuse</div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-xs font-semibold text-amber-800">Resale Value Generated</div>
                <div className="text-2xl font-bold text-amber-900 mt-1">
                  {formatINR(sustainability.financialValueRecoveredInr)}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">Monetized from surplus leftover stock</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Surplus Lot Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Resale Price</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Inquiries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{l.title}</td>
                      <td className="py-2.5 px-3 capitalize">{l.category}</td>
                      <td className="py-2.5 px-3 text-center">{l.quantity} {l.unit}</td>
                      <td className="py-2.5 px-3 text-right font-bold">{formatINR(l.pricePerUnit)}</td>
                      <td className="py-2.5 px-3 text-center capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-700">{l.buyerInquiries.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Task Progress Report */}
        {reportType === "task_progress" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Task Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Due Date</th>
                  <th className="py-2.5 px-3 text-center">Hours (Est / Actual)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{t.category}</td>
                    <td className="py-2.5 px-3 text-center uppercase font-bold text-[10px]">{t.priority}</td>
                    <td className="py-2.5 px-3 text-center capitalize">{t.status.replace("_", " ")}</td>
                    <td className="py-2.5 px-3 text-center">{t.dueDate}</td>
                    <td className="py-2.5 px-3 text-center">{t.estimatedHours}h / {t.actualHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
