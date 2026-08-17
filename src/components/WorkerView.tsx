import React, { useState, useEffect } from "react";
import { User, ConstructionTask, AttendanceRecord, Site } from "../types";
import { formatINR, generateWorkerQRCode, triggerConfetti } from "../utils";
import {
  UserCheck,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface WorkerViewProps {
  currentUser: User;
  tasks: ConstructionTask[];
  attendance: AttendanceRecord[];
  sites: Site[];
  onCheckIn: (data: any) => Promise<void>;
  onCheckOut: (data: any) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: any) => Promise<void>;
}

export const WorkerView: React.FC<WorkerViewProps> = ({
  currentUser,
  tasks,
  attendance,
  sites,
  onCheckIn,
  onCheckOut,
  onUpdateTaskStatus,
}) => {
  const [workerQR, setWorkerQR] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];

  const myTasks = tasks.filter((t) => t.assignedWorkerIds.includes(currentUser.id));
  const myTodayAttendance = attendance.find(
    (a) => a.workerId === currentUser.id && a.date === today
  );
  const myMonthlyAttendance = attendance.filter((a) => a.workerId === currentUser.id);

  const totalMonthlyEarnings = myMonthlyAttendance.reduce(
    (sum, a) => sum + (a.dailyWageEarned || currentUser.dailyRate || 850),
    0
  );
  const totalDaysWorked = myMonthlyAttendance.length;

  useEffect(() => {
    async function loadQR() {
      const url = await generateWorkerQRCode(
        currentUser.badgeId,
        currentUser.name,
        currentUser.siteIds[0] || "site-1"
      );
      setWorkerQR(url);
    }
    loadQR();
  }, [currentUser]);

  const handleSelfCheckIn = async () => {
    await onCheckIn({
      workerId: currentUser.id,
      siteId: currentUser.siteIds[0] || "site-1",
      method: "digital_badge",
      verifiedBy: "Self Gate Check-In",
    });
    triggerConfetti();
  };

  const handleSelfCheckOut = async () => {
    if (!myTodayAttendance) return;
    await onCheckOut({
      id: myTodayAttendance.id,
      totalHours: 8.5,
      notes: "Completed daily assigned site duties",
    });
    triggerConfetti();
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto" id="worker-portal-view">
      {/* Worker Greeting & Quick Attendance Bar */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-emerald-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-white">{currentUser.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  {currentUser.badgeId}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5 font-medium">
                {currentUser.skillSpecialty || "Master Tradesman"} • Wage Rate: ₹{currentUser.dailyRate}/day
              </p>
            </div>
          </div>

          {/* Quick Check-in/out button */}
          <div className="shrink-0">
            {!myTodayAttendance ? (
              <button
                id="worker-checkin-btn"
                onClick={handleSelfCheckIn}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Mark Today's Check-In</span>
              </button>
            ) : !myTodayAttendance.checkOutTime ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-emerald-300">Checked in at: {myTodayAttendance.checkInTime}</div>
                  <div className="text-[10px] text-slate-300">Shift Active</div>
                </div>
                <button
                  id="worker-checkout-btn"
                  onClick={handleSelfCheckOut}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-md"
                >
                  Mark Shift Check-Out
                </button>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 bg-emerald-900/80 border border-emerald-500/50 rounded-xl text-xs font-semibold text-emerald-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Shift Completed ({myTodayAttendance.totalHours} hrs)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Worker Badge with QR & My Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Digital QR Badge */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Digital Gate Pass
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified ID
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {workerQR ? (
              <img src={workerQR} alt="Worker QR Code" className="w-48 h-48 mx-auto" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Loading QR Badge...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-800">
              Show this QR code at construction site entry kiosk
            </div>
            <p className="text-[11px] text-slate-400">
              Auto-registers check-in timestamp and ensures error-free wage credit.
            </p>
          </div>
        </div>

        {/* My Earnings & Attendance Stats */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Month Work & Pay Record
              </h2>
              <span className="text-xs font-semibold text-slate-500">August 2026</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-800">Total Wage Accrued</div>
                <div className="text-xl font-bold text-emerald-900 mt-1">
                  {formatINR(totalMonthlyEarnings)}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Calculated automatically</div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                <div className="text-[11px] font-semibold text-blue-800">Shifts Logged</div>
                <div className="text-xl font-bold text-blue-900 mt-1">
                  {totalDaysWorked} Days
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5">100% QR Verified</div>
              </div>
            </div>

            {/* Recent Shift logs */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-bold text-slate-700">Recent Attendance Logs</div>
              {myMonthlyAttendance.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-800">{rec.date} ({rec.siteName.split(" ")[0]})</div>
                    <div className="text-[10px] text-slate-500">
                      In: {rec.checkInTime} • Out: {rec.checkOutTime || "Active"}
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">
                    +{formatINR(rec.dailyWageEarned || currentUser.dailyRate || 850)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-100">
            For payment questions, contact Site Engineer or Builder Office.
          </div>
        </div>
      </div>

      {/* My Assigned Tasks Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              My Assigned Construction Tasks ({myTasks.length})
            </h2>
          </div>
        </div>

        {myTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            You currently have no assigned tasks. Check with your site manager.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myTasks.map((task) => (
              <div key={task.id} className="py-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          task.priority === "urgent"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{task.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                  </div>

                  {/* Task Status */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {task.status !== "completed" ? (
                      <button
                        onClick={() => {
                          onUpdateTaskStatus(task.id, "completed");
                          triggerConfetti();
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Task ✓</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Linked Materials for this task */}
                {task.requiredMaterials && task.requiredMaterials.length > 0 && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-500 font-medium flex items-center">
                      <Layers className="w-3 h-3 text-amber-500 mr-1" />
                      Required Materials:
                    </span>
                    {task.requiredMaterials.map((rm) => (
                      <span
                        key={rm.materialId}
                        className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700"
                      >
                        {rm.materialName} ({rm.estimatedQty} {rm.unit})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
