import React from "react";
import { UserRole } from "../types";
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  QrCode,
  ClipboardList,
  UserCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "materials"
  | "marketplace"
  | "attendance"
  | "tasks"
  | "worker_portal"
  | "reports";

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  pendingTasksCount: number;
  surplusListingCount: number;
  checkedInWorkersCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  pendingTasksCount,
  surplusListingCount,
  checkedInWorkersCount,
}) => {
  const tabs = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["builder", "engineer", "buyer", "worker"],
    },
    {
      id: "materials" as NavTab,
      label: "Material Tracking",
      icon: Boxes,
      roles: ["builder", "engineer"],
      badge: "Stock & Surplus",
    },
    {
      id: "marketplace" as NavTab,
      label: "Resale Marketplace",
      icon: ShoppingBag,
      roles: ["builder", "engineer", "buyer", "worker"],
      count: surplusListingCount,
      badgeColor: "bg-emerald-500 text-white",
    },
    {
      id: "attendance" as NavTab,
      label: "QR Attendance & Payroll",
      icon: QrCode,
      roles: ["builder", "engineer"],
      count: checkedInWorkersCount,
      badgeColor: "bg-blue-500 text-white",
    },
    {
      id: "tasks" as NavTab,
      label: "Task Management",
      icon: ClipboardList,
      roles: ["builder", "engineer", "worker"],
      count: pendingTasksCount,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "worker_portal" as NavTab,
      label: "Worker QR Badge",
      icon: UserCheck,
      roles: ["worker", "builder", "engineer"],
      highlight: userRole === "worker",
    },
    {
      id: "reports" as NavTab,
      label: "Reports & Audit",
      icon: BarChart3,
      roles: ["builder", "engineer"],
    },
  ];

  const visibleTabs = tabs.filter((t) => t.roles.includes(userRole));

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs" id="nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                } ${tab.highlight && !isActive ? "ring-2 ring-emerald-500/30 bg-emerald-50 text-emerald-800" : ""}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-amber-400" : tab.highlight ? "text-emerald-600" : "text-slate-400"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-amber-400 text-slate-950" : tab.badgeColor || "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && !isActive && (
                  <span className="hidden lg:inline text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
