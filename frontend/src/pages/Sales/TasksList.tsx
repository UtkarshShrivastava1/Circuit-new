import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
type  SortingState,
} from "@tanstack/react-table";
import {
  MdSearch,
  MdFilterList,
  MdAdd,
  MdDownload,
  MdRefresh,
  MdViewList,
  MdViewKanban,
  MdCalendarMonth,
  MdMoreVert,
  MdClose,
  MdOutlineCheckCircle,
} from "react-icons/md";

/* ─────────────────────────── Types ─────────────────────────── */
export interface SalesTask {
  id: string;
  title: string;
  customer: string;
  assignedTo: string;
  type: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed" | "On Hold" | "Cancelled";
  dealValue: number;
  stage: string;
  startDate: string;
  dueDate: string;
  followUpDate: string;
  progress: number;
}

/* ─────────────────────────── Mock Data ─────────────────────────── */
const MOCK_TASKS: SalesTask[] = [
  {
    id: "TSK-1001",
    title: "Follow up on ERP Proposal",
    customer: "Zager Digital Services",
    assignedTo: "V VINAY Kumar",
    type: "Proposal Submission",
    priority: "High",
    status: "In Progress",
    dealValue: 45000,
    stage: "Proposal Sent",
    startDate: "2026-05-28",
    dueDate: "2026-06-05",
    followUpDate: "2026-06-02",
    progress: 60,
  },
  {
    id: "TSK-1002",
    title: "Initial Client Meeting",
    customer: "Acme Corp",
    assignedTo: "Riya Sharma",
    type: "Client Meeting",
    priority: "Medium",
    status: "Pending",
    dealValue: 12000,
    stage: "New Lead",
    startDate: "2026-06-01",
    dueDate: "2026-06-10",
    followUpDate: "2026-06-03",
    progress: 10,
  },
  {
    id: "TSK-1003",
    title: "Contract Negotiation Call",
    customer: "Global Tech",
    assignedTo: "Arjun Mehta",
    type: "Contract Negotiation",
    priority: "Urgent",
    status: "On Hold",
    dealValue: 120000,
    stage: "Negotiation",
    startDate: "2026-05-15",
    dueDate: "2026-05-30",
    followUpDate: "2026-06-01",
    progress: 85,
  },
  {
    id: "TSK-1004",
    title: "Payment Collection Q2",
    customer: "Stark Industries",
    assignedTo: "V VINAY Kumar",
    type: "Payment Collection",
    priority: "High",
    status: "Completed",
    dealValue: 8500,
    stage: "Won",
    startDate: "2026-05-10",
    dueDate: "2026-05-20",
    followUpDate: "2026-05-20",
    progress: 100,
  },
];

/* ─────────────────────────── Component ─────────────────────────── */
export default function SalesTasksList() {
  const navigate = useNavigate();
  
  // State
  const [tasks, setTasks] = useState<SalesTask[]>(MOCK_TASKS);
  const [view, setView] = useState<"table" | "kanban" | "calendar">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState<SalesTask | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Stats Calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "Pending").length,
      inProgress: tasks.filter(t => t.status === "In Progress").length,
      completed: tasks.filter(t => t.status === "Completed").length,
      overdue: tasks.filter(t => t.dueDate < today && t.status !== "Completed").length,
      todayFollowUps: tasks.filter(t => t.followUpDate === today).length,
      dealValue: tasks.reduce((sum, t) => sum + t.dealValue, 0),
      highPriority: tasks.filter(t => t.priority === "High" || t.priority === "Urgent").length,
    };
  }, [tasks]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<SalesTask>();
  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="checkbox checkbox-sm checkbox-primary"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: "Task ID",
      cell: (info) => <span className="text-xs font-mono font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("title", {
      header: "Task Title",
      cell: (info) => (
        <span className="font-semibold text-primary hover:underline cursor-pointer">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("customer", {
      header: "Customer",
    }),
    columnHelper.accessor("assignedTo", {
      header: "Assigned To",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-6">
              <span className="text-[10px]">{info.getValue().charAt(0)}</span>
            </div>
          </div>
          <span className="text-sm">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => {
        const val = info.getValue();
        const badgeClass =
          val === "Urgent" ? "badge-error" : val === "High" ? "badge-warning" : val === "Medium" ? "badge-info" : "badge-neutral";
        return <span className={`badge badge-sm font-semibold ${badgeClass}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();
        const badgeClass =
          val === "Completed" ? "badge-success" : val === "In Progress" ? "badge-primary" : val === "On Hold" ? "badge-warning" : "badge-ghost";
        return <span className={`badge badge-sm badge-outline ${badgeClass}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: (info) => {
        const date = info.getValue();
        const isOverdue = date < new Date().toISOString().split("T")[0] && info.row.original.status !== "Completed";
        return <span className={isOverdue ? "text-error font-bold" : ""}>{date}</span>;
      },
    }),
    columnHelper.accessor("progress", {
      header: "Progress",
      cell: (info) => (
        <div className="flex items-center gap-2 w-24">
          <progress className="progress progress-success w-full" value={info.getValue()} max="100"></progress>
          <span className="text-xs text-base-content/70">{info.getValue()}%</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: () => (
        <button className="btn btn-ghost btn-xs btn-square" onClick={(e) => e.stopPropagation()}>
          <MdMoreVert size={16} />
        </button>
      ),
    }),
  ], []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      t.customer.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Kanban Handlers
  const handleDrop = (e: React.DragEvent, status: SalesTask["status"]) => {
    const taskId = e.dataTransfer.getData("taskId");
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans flex flex-col h-full overflow-hidden relative">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-base-content tracking-tight">Sales Tasks</h1>
          <div className="text-sm text-base-content/60 breadcrumbs mt-1">
            <ul>
              <li>Dashboard</li>
              <li>Sales</li>
              <li className="font-semibold text-primary">Tasks</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <MdDownload size={16} /> Export
          </button>
          <button className="btn btn-outline btn-sm btn-square">
            <MdRefresh size={16} />
          </button>
          <button onClick={() => navigate("/sales/tasks/new")} className="btn btn-primary btn-sm gap-2">
            <MdAdd size={16} /> Add Task
          </button>
        </div>
      </div>

      {/* ── Stats Dashboard ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {[
          { label: "Total Tasks", value: stats.total, color: "text-base-content" },
          { label: "Pending", value: stats.pending, color: "text-base-content" },
          { label: "In Progress", value: stats.inProgress, color: "text-primary" },
          { label: "Completed", value: stats.completed, color: "text-success" },
          { label: "Overdue", value: stats.overdue, color: "text-error" },
          { label: "Today's Follow-ups", value: stats.todayFollowUps, color: "text-warning" },
          { label: "High Priority", value: stats.highPriority, color: "text-error" },
          { label: "Deal Value", value: `$${stats.dealValue.toLocaleString()}`, color: "text-success" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow">
            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-base-content/60 mt-1 text-center font-medium uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-base-100 p-3 rounded-xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Search tasks, customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input input-sm input-bordered w-full pl-9 focus:outline-none focus:border-primary"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn btn-sm ${showFilters ? "btn-primary" : "btn-outline"} gap-2`}>
            <MdFilterList size={16} /> Filters
          </button>
        </div>

        <div className="flex bg-base-200 p-1 rounded-lg border border-base-300">
          <button onClick={() => setView("table")} className={`btn btn-sm btn-ghost px-3 ${view === "table" ? "bg-base-100 shadow-sm" : ""}`}>
            <MdViewList size={18} /> Table
          </button>
          <button onClick={() => setView("kanban")} className={`btn btn-sm btn-ghost px-3 ${view === "kanban" ? "bg-base-100 shadow-sm" : ""}`}>
            <MdViewKanban size={18} /> Kanban
          </button>
          <button onClick={() => setView("calendar")} className={`btn btn-sm btn-ghost px-3 ${view === "calendar" ? "bg-base-100 shadow-sm" : ""}`}>
            <MdCalendarMonth size={18} /> Calendar
          </button>
        </div>
      </div>

      {/* ── Filters Panel ── */}
      {showFilters && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm animate-fade-in-down">
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Task Type</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Proposal</option><option>Meeting</option></select>
          </div>
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Status</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Pending</option><option>Completed</option></select>
          </div>
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Assigned To</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>V VINAY Kumar</option></select>
          </div>
          <div className="flex items-end gap-2">
            <button className="btn btn-sm btn-primary flex-1">Apply Filters</button>
            <button className="btn btn-sm btn-ghost flex-1">Reset</button>
          </div>
        </div>
      )}

      {/* ── Bulk Actions (Visible when rows selected) ── */}
      {Object.keys(rowSelection).length > 0 && view === "table" && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm animate-fade-in-up">
          <span className="text-sm font-semibold text-primary">{Object.keys(rowSelection).length} tasks selected</span>
          <div className="flex gap-2">
            <button className="btn btn-xs btn-primary">Assign Employee</button>
            <button className="btn btn-xs btn-outline">Change Status</button>
            <button className="btn btn-xs btn-error btn-outline">Delete</button>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        
        {/* View 1: Table */}
        {view === "table" && (
          <div className="flex-1 overflow-auto">
            <table className="table table-pin-rows table-pin-cols w-full text-sm">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-base-200/50 text-base-content/70">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="font-semibold py-3 cursor-pointer select-none" onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-base-200/50 transition-colors cursor-pointer border-b border-base-200"
                    onClick={() => setSelectedTask(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-base-content/50">
                      No tasks found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View 2: Kanban */}
        {view === "kanban" && (
          <div className="flex-1 flex overflow-x-auto p-4 gap-4 bg-base-200/30">
            {(["Pending", "In Progress", "On Hold", "Completed"] as const).map(status => (
              <div 
                key={status} 
                className="flex-1 min-w-[280px] bg-base-100 rounded-xl border border-base-300 flex flex-col shadow-sm"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="p-3 border-b border-base-200 font-bold flex justify-between items-center bg-base-200/50 rounded-t-xl">
                  {status}
                  <span className="badge badge-sm">{tasks.filter(t => t.status === status).length}</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {filteredTasks.filter(t => t.status === status).map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-base-100 border border-base-300 p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-base-content/50">{task.id}</span>
                        <span className={`badge badge-xs ${task.priority === 'Urgent' ? 'badge-error' : task.priority === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1 leading-tight">{task.title}</h4>
                      <p className="text-xs text-base-content/70 mb-3">{task.customer}</p>
                      <div className="flex justify-between items-center mt-2 border-t border-base-200 pt-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-6">
                            <span className="text-[10px]">{task.assignedTo.charAt(0)}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold ${task.dueDate < new Date().toISOString().split("T")[0] ? 'text-error' : 'text-base-content/60'}`}>
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 3: Calendar (Mock Implementation) */}
        {view === "calendar" && (
          <div className="flex-1 p-6 flex items-center justify-center bg-base-200/30">
            <div className="text-center space-y-4">
              <MdCalendarMonth size={48} className="mx-auto text-base-content/20" />
              <h3 className="text-lg font-bold text-base-content/50">Calendar View</h3>
              <p className="text-sm text-base-content/40 max-w-sm">Full calendar integration requires a library like react-big-calendar. Tasks are mapped to due dates here.</p>
            </div>
          </div>
        )}

        {/* Table Pagination Footer */}
        {view === "table" && (
          <div className="border-t border-base-300 p-3 bg-base-100 flex items-center justify-between text-sm">
            <span className="text-base-content/60">
              Showing {table.getRowModel().rows.length} of {filteredTasks.length} tasks
            </span>
            <div className="flex items-center gap-2">
              <select 
                className="select select-sm select-bordered"
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>Show {pageSize}</option>
                ))}
              </select>
              <div className="join">
                <button className="join-item btn btn-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>«</button>
                <button className="join-item btn btn-sm">Page {table.getState().pagination.pageIndex + 1}</button>
                <button className="join-item btn btn-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>»</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Task Details Drawer ── */}
      <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${selectedTask ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute right-0 top-0 h-full w-full md:w-[600px] bg-base-100 shadow-2xl transition-transform duration-300 transform ${selectedTask ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-base-300 flex justify-between items-center bg-base-200/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-xs font-bold text-base-content/50">{selectedTask?.id}</span>
                <span className={`badge badge-sm badge-outline ${selectedTask?.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>
                  {selectedTask?.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-base-content leading-tight">{selectedTask?.title}</h2>
            </div>
            <button onClick={() => setSelectedTask(null)} className="btn btn-ghost btn-circle btn-sm">
              <MdClose size={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-base-100">
            
            {/* Quick Actions */}
            <div className="flex gap-2 pb-6 border-b border-base-200">
              <button className="btn btn-sm btn-success text-white flex-1 gap-2"><MdOutlineCheckCircle /> Mark Complete</button>
              <button className="btn btn-sm btn-outline flex-1">Reassign</button>
              <button className="btn btn-sm btn-outline flex-1">Follow-up</button>
            </div>

            {/* Basic Info */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-base-content/50 mb-1">Customer</p><p className="font-semibold">{selectedTask?.customer}</p></div>
                <div><p className="text-base-content/50 mb-1">Task Type</p><p className="font-semibold">{selectedTask?.type}</p></div>
                <div><p className="text-base-content/50 mb-1">Assigned To</p><p className="font-semibold">{selectedTask?.assignedTo}</p></div>
                <div><p className="text-base-content/50 mb-1">Priority</p>
                  <span className={`badge badge-sm font-semibold ${selectedTask?.priority === 'Urgent' ? 'badge-error' : 'badge-warning'}`}>{selectedTask?.priority}</span>
                </div>
              </div>
            </section>

            {/* Sales & Schedule */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Sales & Schedule</h3>
              <div className="bg-base-200/50 p-4 rounded-xl border border-base-200 grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-base-content/50 mb-1">Deal Value</p><p className="font-bold text-success text-lg">${selectedTask?.dealValue.toLocaleString()}</p></div>
                <div><p className="text-base-content/50 mb-1">Stage</p><p className="font-semibold">{selectedTask?.stage}</p></div>
                <div className="col-span-2 divider my-0"></div>
                <div><p className="text-base-content/50 mb-1">Start Date</p><p className="font-medium">{selectedTask?.startDate}</p></div>
                <div><p className="text-base-content/50 mb-1">Due Date</p><p className="font-medium">{selectedTask?.dueDate}</p></div>
                <div><p className="text-base-content/50 mb-1">Follow-up Date</p><p className="font-medium text-primary">{selectedTask?.followUpDate}</p></div>
                <div>
                  <p className="text-base-content/50 mb-1">Progress</p>
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-primary w-full" value={selectedTask?.progress} max="100"></progress>
                    <span className="text-xs font-bold">{selectedTask?.progress}%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Comments & Activity Timeline */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Activity & Comments</h3>
              <ul className="timeline timeline-vertical timeline-compact">
                <li>
                  <hr className="bg-primary" />
                  <div className="timeline-middle text-primary"><MdOutlineCheckCircle /></div>
                  <div className="timeline-end timeline-box border-none shadow-none bg-transparent px-2 py-1">
                    <div className="text-xs text-base-content/50">Today 10:30 AM</div>
                    <div className="text-sm font-medium">Task Assigned to {selectedTask?.assignedTo}</div>
                  </div>
                  <hr className="bg-base-300" />
                </li>
                <li>
                  <hr className="bg-base-300" />
                  <div className="timeline-middle text-base-300"><MdOutlineCheckCircle /></div>
                  <div className="timeline-end timeline-box border-none shadow-none bg-transparent px-2 py-1">
                    <div className="text-xs text-base-content/50">Yesterday 02:15 PM</div>
                    <div className="text-sm font-medium">Task Created by Admin</div>
                  </div>
                </li>
              </ul>
              
              <div className="mt-4 flex gap-2">
                <input type="text" className="input input-sm input-bordered w-full" placeholder="Add a comment..." />
                <button className="btn btn-sm btn-primary">Post</button>
              </div>
            </section>

          </div>
        </div>
      </div>

    </div>
  );
}