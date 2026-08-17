import React, { useState, useEffect } from "react";
import { AttendanceRecord, User, Site } from "../types";
import { formatINR, generateWorkerQRCode, triggerConfetti } from "../utils";
import {
  QrCode,
  UserCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Camera,
  ScanLine,
  ArrowRight,
  Printer,
  DollarSign,
  UserPlus,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  users: User[];
  sites: Site[];
  selectedSiteId: string;
  onCheckIn: (data: any) => Promise<void>;
  onCheckOut: (data: any) => Promise<void>;
  onAddNewWorker: (workerData: any) => Promise<void>;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  users,
  sites,
  selectedSiteId,
  onCheckIn,
  onCheckOut,
  onAddNewWorker,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<"daily_roster" | "scanner_terminal" | "payroll_calc">("daily_roster");

  // Scanner Simulator / Check-In Modal
  const [selectedWorkerForScan, setSelectedWorkerForScan] = useState<string>(
    users.find((u) => u.role === "worker")?.id || ""
  );
  const [selectedSiteForScan, setSelectedSiteForScan] = useState<string>(
    selectedSiteId === "all" ? "site-1" : selectedSiteId
  );
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string>("");

  // Check-Out Modal
  const [checkOutRecord, setCheckOutRecord] = useState<AttendanceRecord | null>(null);
  const [checkOutHours, setCheckOutHours] = useState<number>(8.5);
  const [checkOutNotes, setCheckOutNotes] = useState<string>("Regular daily site shift completed");

  // Worker QR Preview State
  const [workerQRCodes, setWorkerQRCodes] = useState<Record<string, string>>({});
  const [selectedWorkerForBadge, setSelectedWorkerForBadge] = useState<User | null>(
    users.find((u) => u.role === "worker") || null
  );

  // New Worker Modal
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({
    name: "",
    skillSpecialty: "Mason & Plasterer",
    dailyRate: 900,
    hourlyRate: 115,
    phone: "+91 ",
    siteIds: [selectedSiteId === "all" ? "site-1" : selectedSiteId],
  });

  const workerUsers = users.filter((u) => u.role === "worker");

  // Generate QR codes for all workers
  useEffect(() => {
    async function loadQRs() {
      const qrs: Record<string, string> = {};
      for (const w of workerUsers) {
        const url = await generateWorkerQRCode(w.badgeId, w.name, w.siteIds[0] || "site-1");
        qrs[w.id] = url;
      }
      setWorkerQRCodes(qrs);
    }
    loadQRs();
  }, [users]);

  // Daily records filtered
  const dailyAttendance = attendance.filter((a) => {
    if (a.date !== selectedDate) return false;
    if (selectedSiteId !== "all" && a.siteId !== selectedSiteId) return false;
    return true;
  });

  // Calculate Payroll across workers
  const payrollSummary = workerUsers.map((w) => {
    const records = attendance.filter((a) => a.workerId === w.id);
    const totalDays = records.length;
    const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 8), 0);
    const totalOvertime = records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
    const totalEarnings = records.reduce((sum, r) => sum + (r.dailyWageEarned || w.dailyRate || 850), 0);

    return {
      worker: w,
      totalDays,
      totalHours,
      totalOvertime,
      totalEarnings,
      records,
    };
  });

  // Handle QR Check-In Simulation
  const handlePerformQRScan = async () => {
    if (!selectedWorkerForScan) return;
    setIsScanningActive(true);
    setScanSuccessMessage("");

    setTimeout(async () => {
      try {
        await onCheckIn({
          workerId: selectedWorkerForScan,
          siteId: selectedSiteForScan,
          method: "qr_scan",
          verifiedBy: "Site Gate QR Scanner Kiosk #1",
        });
        const w = users.find((u) => u.id === selectedWorkerForScan);
        setScanSuccessMessage(`Verified! ${w?.name} successfully checked in.`);
        triggerConfetti();
      } catch (err: any) {
        setScanSuccessMessage("Check-in error or worker already checked in today.");
      } finally {
        setIsScanningActive(false);
      }
    }, 900);
  };

  // Handle Check-Out Submission
  const handleConfirmCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkOutRecord) return;
    await onCheckOut({
      id: checkOutRecord.id,
      totalHours: checkOutHours,
      notes: checkOutNotes,
    });
    setCheckOutRecord(null);
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddNewWorker(newWorkerForm);
    setIsAddWorkerOpen(false);
  };

  return (
    <div className="space-y-6 pb-12" id="attendance-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <QrCode className="w-5 h-5 text-blue-600 mr-2" />
              Digital QR Attendance & Multi-Site Labor Payroll
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Contactless QR code badge check-in/out, biometric verification simulation, and transparent wage computation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("scanner_terminal")}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </button>
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Worker</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("daily_roster")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === "daily_roster"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          📅 Daily Attendance Roster ({dailyAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab("scanner_terminal")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
            activeTab === "scanner_terminal"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ScanLine className="w-4 h-4 text-amber-400" />
          <span>Live QR Scanner & Badges</span>
        </button>
        <button
          onClick={() => setActiveTab("payroll_calc")}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
            activeTab === "payroll_calc"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Automated Payroll & Wage Slip</span>
        </button>
      </div>

      {/* TAB 1: DAILY ATTENDANCE ROSTER */}
      {activeTab === "daily_roster" && (
        <div className="space-y-4">
          {/* Date Selector & Site Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-600">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              />
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Today
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center space-x-4">
              <span>Present Today: <strong>{dailyAttendance.length}</strong></span>
              <span>•</span>
              <span>Checked Out: <strong>{dailyAttendance.filter((a) => a.checkOutTime).length}</strong></span>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Worker Profile</th>
                    <th className="py-3.5 px-4">Site Location</th>
                    <th className="py-3.5 px-4 text-center">Check-In</th>
                    <th className="py-3.5 px-4 text-center">Check-Out</th>
                    <th className="py-3.5 px-4 text-center">Total Hours</th>
                    <th className="py-3.5 px-4 text-center">Verification Method</th>
                    <th className="py-3.5 px-4 text-right">Day Wage (₹)</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No worker attendance logged for {selectedDate}. Use the QR Scanner to check in workers.
                      </td>
                    </tr>
                  ) : (
                    dailyAttendance.map((rec) => {
                      const worker = users.find((u) => u.id === rec.workerId);
                      return (
                        <tr key={rec.id} className="hover:bg-slate-50 transition">
                          {/* Worker */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={worker?.avatar}
                                alt={rec.workerName}
                                className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{rec.workerName}</div>
                                <div className="text-[11px] text-slate-500">
                                  {rec.workerRole} • ID: {worker?.badgeId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Site */}
                          <td className="py-3.5 px-4 text-slate-700 text-xs">
                            <div className="font-medium">{rec.siteName}</div>
                          </td>

                          {/* Check In */}
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                            {rec.checkInTime}
                          </td>

                          {/* Check Out */}
                          <td className="py-3.5 px-4 text-center">
                            {rec.checkOutTime ? (
                              <span className="font-semibold text-slate-800">{rec.checkOutTime}</span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                                Active On Shift
                              </span>
                            )}
                          </td>

                          {/* Total Hours */}
                          <td className="py-3.5 px-4 text-center">
                            {rec.totalHours ? (
                              <span className="font-medium text-slate-900">
                                {rec.totalHours} hrs
                                {rec.overtimeHours && rec.overtimeHours > 0 ? (
                                  <span className="text-[10px] font-bold text-amber-700 ml-1">
                                    (+{rec.overtimeHours}h OT)
                                  </span>
                                ) : null}
                              </span>
                            ) : (
                              <span className="text-slate-400">In Progress</span>
                            )}
                          </td>

                          {/* Verification Method */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              {rec.method === "qr_scan" ? "QR Scanned" : "Digital Badge"}
                            </span>
                            {rec.verifiedBy && (
                              <div className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[120px] mx-auto">
                                {rec.verifiedBy}
                              </div>
                            )}
                          </td>

                          {/* Wage Earned */}
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                            {formatINR(rec.dailyWageEarned || 850)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            {!rec.checkOutTime ? (
                              <button
                                onClick={() => {
                                  setCheckOutRecord(rec);
                                  setCheckOutHours(8.5);
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-2xs"
                              >
                                Check Out
                              </button>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400">Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE QR SCANNER TERMINAL & WORKER DIGITAL BADGES */}
      {activeTab === "scanner_terminal" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Simulation Kiosk */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base font-bold text-white">
                    Site Gate Digital QR Scanner Kiosk
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Online & Active
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Checkpoint Site Location
                  </label>
                  <select
                    value={selectedSiteForScan}
                    onChange={(e) => setSelectedSiteForScan(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Worker Badge to Scan
                  </label>
                  <select
                    value={selectedWorkerForScan}
                    onChange={(e) => setSelectedWorkerForScan(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    {workerUsers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.skillSpecialty}) - {w.badgeId}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Simulated Camera Viewfinder */}
                <div className="relative h-56 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-4">
                  {/* Viewfinder Reticle */}
                  <div className="w-40 h-40 border-2 border-dashed border-amber-400/80 rounded-2xl flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

                    {isScanningActive ? (
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                        <span className="text-[11px] text-amber-300 font-medium">Scanning Badge QR...</span>
                      </div>
                    ) : (
                      <div className="text-center p-2">
                        <QrCode className="w-10 h-10 text-slate-600 mx-auto" />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Point worker QR card to site camera
                        </span>
                      </div>
                    )}
                  </div>

                  {scanSuccessMessage && (
                    <div className="absolute bottom-3 inset-x-4 bg-emerald-900/90 text-emerald-200 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/50 flex items-center justify-center space-x-1.5 text-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{scanSuccessMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                id="perform-qr-scan-btn"
                onClick={handlePerformQRScan}
                disabled={isScanningActive}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <ScanLine className="w-4 h-4" />
                <span>Simulate Instant QR Scan & Check-In</span>
              </button>
            </div>
          </div>

          {/* Worker Digital Badge Viewer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Official Worker Digital ID Badge (Print Ready)
                  </h2>
                </div>
              </div>

              {/* Worker selector for badge */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preview Badge For:
                </label>
                <select
                  value={selectedWorkerForBadge?.id}
                  onChange={(e) => {
                    const w = users.find((u) => u.id === e.target.value);
                    if (w) setSelectedWorkerForBadge(w);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                >
                  {workerUsers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} - {w.skillSpecialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rendered Badge Card */}
              {selectedWorkerForBadge && (
                <div className="mt-4 p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-2xl shadow-lg border border-slate-700 max-w-sm mx-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs tracking-wider uppercase">BuildWise Worker Pass</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                      ID: {selectedWorkerForBadge.badgeId}
                    </span>
                  </div>

                  <div className="py-4 flex items-center space-x-4">
                    <img
                      src={selectedWorkerForBadge.avatar}
                      alt={selectedWorkerForBadge.name}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{selectedWorkerForBadge.name}</h3>
                      <p className="text-xs text-amber-400 mt-0.5">{selectedWorkerForBadge.skillSpecialty}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Ph: {selectedWorkerForBadge.phone}</p>
                      <p className="text-[10px] text-slate-400">Rate: ₹{selectedWorkerForBadge.dailyRate}/day</p>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="bg-white p-3 rounded-xl flex items-center justify-center">
                    {workerQRCodes[selectedWorkerForBadge.id] ? (
                      <img
                        src={workerQRCodes[selectedWorkerForBadge.id]}
                        alt="Worker QR Code"
                        className="w-36 h-36"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                        Generating QR...
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-2.5 text-[10px] text-slate-400">
                    Scan for instant gate verification & daily shift log
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition inline-flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ID Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATED PAYROLL CALCULATOR */}
      {activeTab === "payroll_calc" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <DollarSign className="w-4 h-4 text-emerald-600 mr-1.5" />
                Automated Workforce Payroll & Daily Wage Disbursal Slip
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated directly from digital QR timestamps and verified shift hours without manual excel errors
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Payroll Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Worker Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4 text-center">Daily Base Rate</th>
                  <th className="py-3 px-4 text-center">Days Worked</th>
                  <th className="py-3 px-4 text-center">Total Hours</th>
                  <th className="py-3 px-4 text-center">Overtime Hours</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900">Total Payout Due (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollSummary.map((item) => (
                  <tr key={item.worker.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.worker.name}</td>
                    <td className="py-3 px-4 text-slate-600">{item.worker.skillSpecialty}</td>
                    <td className="py-3 px-4 text-center font-medium text-slate-700">
                      {formatINR(item.worker.dailyRate || 850)}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-800">
                      {item.totalDays} days
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-800">
                      {item.totalHours} hrs
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-amber-700">
                      {item.totalOvertime > 0 ? `${item.totalOvertime} hrs OT` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-700 text-sm">
                      {formatINR(item.totalEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/70 font-bold text-slate-900 border-t border-slate-200 text-xs sm:text-sm">
                  <td colSpan={6} className="py-3 px-4 text-right">
                    Total Wage Liability:
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-800 font-extrabold text-base">
                    {formatINR(payrollSummary.reduce((sum, p) => sum + p.totalEarnings, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CHECK OUT RECORD ----------------- */}
      {checkOutRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <Clock className="w-5 h-5 text-amber-600 mr-2" />
              Complete Worker Shift & Check-Out
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Recording check-out for <strong>{checkOutRecord.workerName}</strong> (In at {checkOutRecord.checkInTime}).
            </p>

            <form onSubmit={handleConfirmCheckOut} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Shift Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="16"
                  value={checkOutHours}
                  onChange={(e) => setCheckOutHours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
                {checkOutHours > 8 && (
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    ✨ {(checkOutHours - 8).toFixed(1)} hrs overtime will be computed at 1.5x hourly wage.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supervisor Notes / Performance
                </label>
                <input
                  type="text"
                  value={checkOutNotes}
                  onChange={(e) => setCheckOutNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCheckOutRecord(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-xs"
                >
                  Confirm Check-Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: ENROLL NEW WORKER ----------------- */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <UserPlus className="w-5 h-5 text-blue-600 mr-2" />
              Enroll New Construction Worker
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Registers worker profile and auto-generates digital QR badge pass.
            </p>

            <form onSubmit={handleCreateWorker} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Worker Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vitthal S. More"
                  value={newWorkerForm.name}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trade / Skill Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mason, Electrician, Bar Bender"
                    value={newWorkerForm.skillSpecialty}
                    onChange={(e) =>
                      setNewWorkerForm({ ...newWorkerForm, skillSpecialty: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily Wage Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={newWorkerForm.dailyRate}
                    onChange={(e) =>
                      setNewWorkerForm({ ...newWorkerForm, dailyRate: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={newWorkerForm.phone}
                  onChange={(e) => setNewWorkerForm({ ...newWorkerForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-xs"
                >
                  Enroll & Generate QR Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
