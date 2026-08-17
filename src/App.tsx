/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  User,
  Site,
  Material,
  MaterialTransaction,
  ResaleListing,
  ConstructionTask,
  AttendanceRecord,
  SustainabilityMetrics,
} from "./types";
import { Header } from "./components/Header";
import { Navigation, NavTab } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { MaterialTrackingView } from "./components/MaterialTrackingView";
import { MarketplaceView } from "./components/MarketplaceView";
import { AttendanceView } from "./components/AttendanceView";
import { TaskManagementView } from "./components/TaskManagementView";
import { WorkerView } from "./components/WorkerView";
import { ReportsView } from "./components/ReportsView";
import { AIAdvisorModal } from "./components/AIAdvisorModal";
import { calculateLeftover, triggerConfetti } from "./utils";
import { CheckCircle2, AlertCircle, HardHat } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [transactions, setTransactions] = useState<MaterialTransaction[]>([]);
  const [listings, setListings] = useState<ResaleListing[]>([]);
  const [tasks, setTasks] = useState<ConstructionTask[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [sustainability, setSustainability] = useState<SustainabilityMetrics>({
    totalWasteDivertedKg: 0,
    carbonOffsetKg: 0,
    financialValueRecoveredInr: 0,
    surplusReuseRate: 85,
    materialsSavedCount: 0,
  });

  const [selectedSiteId, setSelectedSiteId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Bootstrap initial state from backend server
  useEffect(() => {
    async function loadBootstrap() {
      try {
        const res = await fetch("/api/bootstrap");
        const data = await res.json();
        setSites(data.sites || []);
        setUsers(data.users || []);
        setCurrentUser(data.users?.[0] || null);
        setMaterials(data.materials || []);
        setTransactions(data.transactions || []);
        setListings(data.listings || []);
        setTasks(data.tasks || []);
        setAttendance(data.attendance || []);
        if (data.sustainability) setSustainability(data.sustainability);
      } catch (err) {
        console.error("Failed to load bootstrap data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBootstrap();
  }, []);

  // Material Actions
  const handleLogPurchase = async (purchaseData: any) => {
    try {
      const res = await fetch("/api/materials/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...purchaseData,
          loggedBy: currentUser?.name || "Site Engineer",
        }),
      });
      const data = await res.json();
      if (data.updatedMaterial) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === data.updatedMaterial.id ? data.updatedMaterial : m))
        );
      }
      if (data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
      }
      showToast("Procurement logged successfully!");
      triggerConfetti();
    } catch (err: any) {
      showToast("Failed to log purchase", "error");
    }
  };

  const handleLogUsage = async (usageData: any) => {
    try {
      const res = await fetch("/api/materials/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...usageData,
          loggedBy: currentUser?.name || "Site Engineer",
        }),
      });
      const data = await res.json();
      if (data.updatedMaterial) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === data.updatedMaterial.id ? data.updatedMaterial : m))
        );
      }
      if (data.transaction) {
        setTransactions((prev) => [data.transaction, ...prev]);
      }
      showToast("Material consumption deducted from site stock!");
    } catch (err: any) {
      showToast("Failed to log usage", "error");
    }
  };

  const handleAddNewMaterial = async (newMatData: any) => {
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMatData,
          loggedBy: currentUser?.name || "Site Engineer",
        }),
      });
      const newMat = await res.json();
      setMaterials((prev) => [newMat, ...prev]);
      showToast(`Added ${newMat.name} to material inventory!`);
      triggerConfetti();
    } catch (err: any) {
      showToast("Failed to create material", "error");
    }
  };

  // Resale Marketplace Actions
  const handleCreateListing = async (listingData: any) => {
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      const newListing = await res.json();
      setListings((prev) => [newListing, ...prev]);
      showToast("Surplus material listed on BuildWise Resale Marketplace!");
    } catch (err: any) {
      showToast("Failed to post listing", "error");
    }
  };

  const handleSubmitInquiry = async (listingId: string, inquiryData: any) => {
    try {
      const res = await fetch(`/api/marketplace/${listingId}/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });
      const data = await res.json();
      if (data.listing) {
        setListings((prev) =>
          prev.map((l) => (l.id === data.listing.id ? data.listing : l))
        );
      }
      showToast("Inquiry sent & surplus lot reserved!");
    } catch (err: any) {
      showToast("Failed to submit inquiry", "error");
    }
  };

  const handleUpdateListingStatus = async (
    listingId: string,
    status: "available" | "reserved" | "sold"
  ) => {
    try {
      const res = await fetch(`/api/marketplace/${listingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      showToast(`Listing marked as ${status}!`);
    } catch (err: any) {
      showToast("Failed to update status", "error");
    }
  };

  const handleAcceptInquiry = async (listingId: string, inquiryId: string) => {
    try {
      await handleUpdateListingStatus(listingId, "reserved");
      showToast("Offer accepted & lot reserved for buyer!");
    } catch (err: any) {
      showToast("Failed to accept offer", "error");
    }
  };

  // Task Actions
  const handleCreateTask = async (taskData: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          createdBy: currentUser?.name || "Site Engineer",
        }),
      });
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      showToast(`Task '${newTask.title}' assigned!`);
    } catch (err: any) {
      showToast("Failed to create task", "error");
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: any,
    actualHours?: number
  ) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, actualHours }),
      });
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      showToast(`Task updated to ${status.replace("_", " ")}!`);
    } catch (err: any) {
      showToast("Failed to update task", "error");
    }
  };

  // Attendance Actions
  const handleCheckIn = async (checkInData: any) => {
    try {
      const res = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkInData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Check-in failed");
      }
      const record = await res.json();
      setAttendance((prev) => [record, ...prev]);
      showToast(`Checked in: ${record.workerName} at ${record.checkInTime}`);
    } catch (err: any) {
      showToast(err.message || "Failed to check in", "error");
      throw err;
    }
  };

  const handleCheckOut = async (checkOutData: any) => {
    try {
      const res = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkOutData),
      });
      const record = await res.json();
      setAttendance((prev) => prev.map((a) => (a.id === record.id ? record : a)));
      showToast(`Checked out: ${record.workerName} (${record.totalHours} hrs)`);
    } catch (err: any) {
      showToast("Failed to check out", "error");
    }
  };

  const handleAddNewWorker = async (workerData: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workerData),
      });
      const newWorker = await res.json();
      setUsers((prev) => [...prev, newWorker]);
      showToast(`Worker ${newWorker.name} enrolled with ID ${newWorker.badgeId}!`);
      triggerConfetti();
    } catch (err: any) {
      showToast("Failed to enroll worker", "error");
    }
  };

  // Quick Resell action from Material table / Dashboard
  const handleQuickResell = (material: Material) => {
    const leftover = calculateLeftover(material);
    setActiveTab("marketplace");
    showToast(`Opening Resale Marketplace for ${leftover} ${material.unit} of ${material.name}`);
  };

  // Handle Role Switch
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    showToast(`Switched active profile to ${user.name} (${user.role.toUpperCase()})`);
    if (user.role === "worker") {
      setActiveTab("worker_portal");
    } else if (user.role === "buyer") {
      setActiveTab("marketplace");
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center animate-bounce shadow-lg">
          <HardHat className="w-7 h-7 text-slate-950" />
        </div>
        <h1 className="text-xl font-bold mt-4 tracking-tight">BuildWise</h1>
        <p className="text-xs text-slate-400 mt-1">
          Loading smart construction material & labor management workspace...
        </p>
      </div>
    );
  }

  const pendingTasksCount = tasks.filter((t) => t.status !== "completed").length;
  const surplusListingCount = listings.filter((l) => l.status === "available").length;
  const today = new Date().toISOString().split("T")[0];
  const checkedInWorkersCount = attendance.filter((a) => a.date === today && !a.checkOutTime).length;

  const totalSurplusValue = materials.reduce((sum, m) => {
    const leftover = calculateLeftover(m);
    return leftover > 0 ? sum + leftover * m.unitCost : sum;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl border flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-top-3 ${
            toastMessage.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-500/50"
              : "bg-rose-900 text-rose-100 border-rose-500/50"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        users={users}
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSelectSite={setSelectedSiteId}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        totalSurplusValue={totalSurplusValue}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={currentUser.role}
        pendingTasksCount={pendingTasksCount}
        surplusListingCount={surplusListingCount}
        checkedInWorkersCount={checkedInWorkersCount}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <DashboardView
            sites={sites}
            materials={materials}
            listings={listings}
            tasks={tasks}
            attendance={attendance}
            sustainability={sustainability}
            selectedSiteId={selectedSiteId}
            onNavigateTab={setActiveTab}
            onQuickResell={handleQuickResell}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          />
        )}

        {activeTab === "materials" && (
          <MaterialTrackingView
            materials={materials}
            transactions={transactions}
            sites={sites}
            tasks={tasks}
            selectedSiteId={selectedSiteId}
            onLogPurchase={handleLogPurchase}
            onLogUsage={handleLogUsage}
            onQuickResell={handleQuickResell}
            onAddNewMaterial={handleAddNewMaterial}
          />
        )}

        {activeTab === "marketplace" && (
          <MarketplaceView
            listings={listings}
            currentUser={currentUser}
            sites={sites}
            onCreateListing={handleCreateListing}
            onSubmitInquiry={handleSubmitInquiry}
            onUpdateListingStatus={handleUpdateListingStatus}
            onAcceptInquiry={handleAcceptInquiry}
          />
        )}

        {activeTab === "attendance" && (
          <AttendanceView
            attendance={attendance}
            users={users}
            sites={sites}
            selectedSiteId={selectedSiteId}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onAddNewWorker={handleAddNewWorker}
          />
        )}

        {activeTab === "tasks" && (
          <TaskManagementView
            tasks={tasks}
            users={users}
            sites={sites}
            materials={materials}
            selectedSiteId={selectedSiteId}
            onCreateTask={handleCreateTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onLogMaterialUsage={handleLogUsage}
          />
        )}

        {activeTab === "worker_portal" && (
          <WorkerView
            currentUser={currentUser}
            tasks={tasks}
            attendance={attendance}
            sites={sites}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === "reports" && (
          <ReportsView
            materials={materials}
            attendance={attendance}
            listings={listings}
            tasks={tasks}
            sites={sites}
            sustainability={sustainability}
            selectedSiteId={selectedSiteId}
          />
        )}
      </main>

      {/* AI Material & Surplus Optimization Modal */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        materials={materials}
        sites={sites}
        selectedSiteId={selectedSiteId}
        onQuickResell={handleQuickResell}
      />
    </div>
  );
}
