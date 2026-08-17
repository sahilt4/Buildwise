import React from "react";
import { User, UserRole, Site } from "../types";
import {
  HardHat,
  Building2,
  Users,
  ShoppingBag,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Shield,
  Layers,
} from "lucide-react";

interface HeaderProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  users: User[];
  sites: Site[];
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
  onOpenAIAdvisor: () => void;
  totalSurplusValue: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  users,
  sites,
  selectedSiteId,
  onSelectSite,
  onOpenAIAdvisor,
  totalSurplusValue,
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "builder":
        return <Building2 className="w-4 h-4 text-amber-500" />;
      case "engineer":
        return <HardHat className="w-4 h-4 text-blue-500" />;
      case "worker":
        return <Users className="w-4 h-4 text-emerald-500" />;
      case "buyer":
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "builder":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "engineer":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "worker":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "buyer":
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <HardHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">BuildWise</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Project 14
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Smart Material Tracking, Resale Marketplace & Labor Management
              </p>
            </div>
          </div>

          {/* Site Selector & AI Advisor */}
          <div className="flex items-center space-x-3">
            {/* Site Switcher */}
            <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <select
                id="site-selector"
                value={selectedSiteId}
                onChange={(e) => onSelectSite(e.target.value)}
                aria-label="Filter by Construction Site"
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-4 text-xs"
              >
                <option value="all" className="bg-slate-800 text-white">
                  🌐 All Sites (Nashik Region)
                </option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-800 text-white">
                    📍 {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>

            {/* AI Advisor Button */}
            <button
              id="ai-advisor-btn"
              onClick={onOpenAIAdvisor}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-medium transition shadow-sm"
              title="Material Stock Optimization & Surplus Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden md:inline">Stock Optimizer</span>
            </button>

            {/* Role / User Switcher */}
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer transition">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {currentUser.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center space-x-1">
                    <span>{currentUser.role}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Menu to Switch Roles / Demo Users */}
              <div className="absolute right-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 hidden group-hover:block hover:block z-50">
                <div className="px-3 py-1.5 border-b border-slate-700 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role & Persona
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/50">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSelectUser(u)}
                      className={`w-full px-3 py-2 text-left flex items-center space-x-2.5 hover:bg-slate-700/70 transition ${
                        currentUser.id === u.id ? "bg-slate-700" : ""
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate flex items-center justify-between">
                          <span>{u.name}</span>
                          {currentUser.id === u.id && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold ${getRoleBadgeStyle(
                              u.role
                            )}`}
                          >
                            {u.role}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {u.skillSpecialty || u.badgeId}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
