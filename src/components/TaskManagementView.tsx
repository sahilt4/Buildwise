import React, { useState } from "react";
import { ConstructionTask, TaskStatus, TaskPriority, User, Site, Material } from "../types";
import { triggerConfetti } from "../utils";
import {
  ClipboardList,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Edit2,
} from "lucide-react";

interface TaskManagementViewProps {
  tasks: ConstructionTask[];
  users: User[];
  sites: Site[];
  materials: Material[];
  selectedSiteId: string;
  onCreateTask: (taskData: any) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus, actualHours?: number) => Promise<void>;
  onLogMaterialUsage: (usageData: any) => Promise<void>;
}

export const TaskManagementView: React.FC<TaskManagementViewProps> = ({
  tasks,
  users,
  sites,
  materials,
  selectedSiteId,
  onCreateTask,
  onUpdateTaskStatus,
  onLogMaterialUsage,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    category: "Civil & Structural",
    priority: "medium" as TaskPriority,
    siteId: selectedSiteId === "all" ? "site-1" : selectedSiteId,
    assignedWorkerIds: [] as string[],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    estimatedHours: 16,
    requiredMaterials: [] as Array<{
      materialId: string;
      materialName: string;
      estimatedQty: number;
      actualUsedQty: number;
      unit: string;
    }>,
  });

  // Selected Material for linking inside task modal
  const [linkingMaterialId, setLinkingMaterialId] = useState<string>("");
  const [linkingEstimatedQty, setLinkingEstimatedQty] = useState<number>(50);

  const workerUsers = users.filter((u) => u.role === "worker");

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedSiteId !== "all" && t.siteId !== selectedSiteId) return false;
    if (selectedPriority !== "all" && t.priority !== selectedPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const columns: { status: TaskStatus; label: string; color: string; bg: string }[] = [
    { status: "todo", label: "To-Do Backlog", color: "text-slate-700", bg: "bg-slate-100" },
    { status: "in_progress", label: "In Progress", color: "text-blue-700", bg: "bg-blue-50" },
    { status: "review", label: "Quality Inspection / Review", color: "text-amber-700", bg: "bg-amber-50" },
    { status: "completed", label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  const handleAddMaterialToTask = () => {
    if (!linkingMaterialId) return;
    const mat = materials.find((m) => m.id === linkingMaterialId);
    if (!mat) return;

    if (taskForm.requiredMaterials.some((rm) => rm.materialId === mat.id)) return;

    setTaskForm({
      ...taskForm,
      requiredMaterials: [
        ...taskForm.requiredMaterials,
        {
          materialId: mat.id,
          materialName: mat.name,
          estimatedQty: linkingEstimatedQty,
          actualUsedQty: 0,
          unit: mat.unit,
        },
      ],
    });
  };

  const handleRemoveMaterialFromTask = (matId: string) => {
    setTaskForm({
      ...taskForm,
      requiredMaterials: taskForm.requiredMaterials.filter((rm) => rm.materialId !== matId),
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateTask(taskForm);
    setIsCreateModalOpen(false);
    triggerConfetti();
  };

  const handleStatusAdvance = async (task: ConstructionTask, nextStatus: TaskStatus) => {
    await onUpdateTaskStatus(task.id, nextStatus);
    if (nextStatus === "completed") {
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6 pb-12" id="task-management-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              <ClipboardList className="w-5 h-5 text-amber-500 mr-2" />
              Construction Task Assignment & Progress Monitoring
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign workers, link material specifications, and track multi-site milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "kanban" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              List View
            </button>
          </div>

          <button
            id="create-task-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          aria-label="Filter tasks by priority"
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer w-full md:w-auto"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High Priority</option>
          <option value="medium">🔵 Medium</option>
          <option value="low">⚪ Low</option>
        </select>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.status === "completed"
                        ? "bg-emerald-500"
                        : col.status === "in_progress"
                        ? "bg-blue-500"
                        : col.status === "review"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`} />
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{col.label}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const site = sites.find((s) => s.id === task.siteId);
                      const assignedUsers = users.filter((u) => task.assignedWorkerIds.includes(u.id));

                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-3"
                        >
                          {/* Top tags */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                task.priority === "urgent"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : task.priority === "high"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[10px] text-slate-400">{site?.name.split(" ")[0]}</span>
                          </div>

                          {/* Title & description */}
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          {/* Linked Materials Badge */}
                          {task.requiredMaterials && task.requiredMaterials.length > 0 && (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                              <div className="text-[10px] font-semibold text-slate-600 flex items-center">
                                <Boxes className="w-3 h-3 text-amber-500 mr-1" />
                                Linked Materials ({task.requiredMaterials.length})
                              </div>
                              {task.requiredMaterials.map((rm) => (
                                <div key={rm.materialId} className="text-[10px] text-slate-500 flex justify-between">
                                  <span className="truncate max-w-[120px]">{rm.materialName}</span>
                                  <span className="font-medium text-slate-700">
                                    {rm.actualUsedQty || 0} / {rm.estimatedQty} {rm.unit.split(" ")[0]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Due Date & Assigned Workers */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center text-slate-500 text-[11px]">
                              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                              <span>{task.dueDate}</span>
                            </div>

                            {/* Assigned Workers Avatars */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {assignedUsers.map((u) => (
                                <img
                                  key={u.id}
                                  src={u.avatar}
                                  alt={u.name}
                                  title={`${u.name} (${u.skillSpecialty})`}
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                />
                              ))}
                            </div>
                          </div>

                          {/* Status Advancement Controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            {task.status === "todo" && (
                              <button
                                onClick={() => handleStatusAdvance(task, "in_progress")}
                                className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition text-center"
                              >
                                Start Task →
                              </button>
                            )}
                            {task.status === "in_progress" && (
                              <div className="grid grid-cols-2 gap-1.5 w-full">
                                <button
                                  onClick={() => handleStatusAdvance(task, "review")}
                                  className="py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] rounded-lg transition"
                                >
                                  Submit Review
                                </button>
                                <button
                                  onClick={() => handleStatusAdvance(task, "completed")}
                                  className="py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition"
                                >
                                  Mark Done ✓
                                </button>
                              </div>
                            )}
                            {task.status === "review" && (
                              <button
                                onClick={() => handleStatusAdvance(task, "completed")}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center space-x-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Complete</span>
                              </button>
                            )}
                            {task.status === "completed" && (
                              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center w-full py-1 bg-emerald-50 rounded-lg">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Completed Milestone
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          {filteredTasks.map((task) => {
            const site = sites.find((s) => s.id === task.siteId);
            const assignedUsers = users.filter((u) => task.assignedWorkerIds.includes(u.id));

            return (
              <div key={task.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        task.priority === "urgent"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : task.priority === "high"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                    <span className="text-xs text-slate-400">• {site?.name}</span>
                  </div>
                  <p className="text-xs text-slate-600">{task.description}</p>
                  <div className="text-xs text-slate-500 flex items-center space-x-3 pt-1">
                    <span>Due: <strong>{task.dueDate}</strong></span>
                    <span>•</span>
                    <span>Est: {task.estimatedHours} hrs</span>
                    {task.requiredMaterials && task.requiredMaterials.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-700 font-medium">
                          {task.requiredMaterials.length} Materials Linked
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="flex -space-x-2">
                    {assignedUsers.map((u) => (
                      <img
                        key={u.id}
                        src={u.avatar}
                        alt={u.name}
                        title={u.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                      />
                    ))}
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      task.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- CREATE TASK MODAL ----------------- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 flex items-center mb-1">
              <Plus className="w-5 h-5 text-amber-500 mr-2" />
              Create & Assign Construction Task
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Specify work scope, assign qualified tradesmen, and allocate material requirements.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5th Floor Slab Formwork & Rebar Binding"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Construction Site
                  </label>
                  <select
                    value={taskForm.siteId}
                    onChange={(e) => setTaskForm({ ...taskForm, siteId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Description & Technical Specs
                </label>
                <textarea
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  placeholder="Details for workers, drawing references, safety standards..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={taskForm.estimatedHours}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, estimatedHours: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Assign Workers Multi-select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Workers / Tradesmen
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {workerUsers.map((w) => {
                    const isSelected = taskForm.assignedWorkerIds.includes(w.id);
                    return (
                      <label
                        key={w.id}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg border text-xs cursor-pointer ${
                          isSelected
                            ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTaskForm({
                                ...taskForm,
                                assignedWorkerIds: [...taskForm.assignedWorkerIds, w.id],
                              });
                            } else {
                              setTaskForm({
                                ...taskForm,
                                assignedWorkerIds: taskForm.assignedWorkerIds.filter(
                                  (id) => id !== w.id
                                ),
                              });
                            }
                          }}
                          className="rounded text-amber-600 focus:ring-0"
                        />
                        <span className="truncate">{w.name} ({w.skillSpecialty?.split(" ")[0]})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Link Required Materials */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link Estimated Construction Materials
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={linkingMaterialId}
                    onChange={(e) => setLinkingMaterialId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="">-- Choose Material from Site Stock --</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    placeholder="Est Qty"
                    value={linkingEstimatedQty}
                    onChange={(e) => setLinkingEstimatedQty(Number(e.target.value))}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterialToTask}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    + Add
                  </button>
                </div>

                {/* Selected materials list */}
                {taskForm.requiredMaterials.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {taskForm.requiredMaterials.map((rm) => (
                      <div
                        key={rm.materialId}
                        className="flex items-center justify-between p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900"
                      >
                        <span>
                          {rm.materialName} ({rm.estimatedQty} {rm.unit})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialFromTask(rm.materialId)}
                          className="text-rose-600 font-bold hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Assign Task & Notify Labor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
