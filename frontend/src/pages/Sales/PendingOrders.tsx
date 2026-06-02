import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
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
  MdWarning,
  MdCheckCircle,
  MdLocalShipping,
  MdPayment,
  MdEdit,
} from "react-icons/md";

/* ─────────────────────────── Types ─────────────────────────── */
export interface PendingOrder {
  id: string;
  orderNumber: string;
  customer: string;
  salesOwner: string;
  orderDate: string;
  deliveryDate: string;
  totalItems: number;
  totalQuantity: number;
  orderValue: number;
  paymentStatus: "Unpaid" | "Partially Paid" | "Paid";
  approvalStatus: "Pending" | "Approved" | "Rejected" | "N/A";
  status: "Draft" | "Pending Approval" | "Approved" | "Processing" | "Awaiting Payment" | "Awaiting Dispatch";
  priority: "Low" | "Medium" | "High" | "Urgent";
  daysPending: number;
  // Drawer Details
  products: { name: string; sku: string; price: number; qty: number; tax: number; total: number }[];
  paymentTerms: string;
  shippingAddress: string;
}

/* ─────────────────────────── Mock Data ─────────────────────────── */
const MOCK_ORDERS: PendingOrder[] = [
  {
    id: "PO-001",
    orderNumber: "SO-2026-00105",
    customer: "Zager Digital Services",
    salesOwner: "V VINAY Kumar",
    orderDate: "2026-05-20",
    deliveryDate: "2026-05-25", // Overdue
    totalItems: 3,
    totalQuantity: 15,
    orderValue: 45000,
    paymentStatus: "Unpaid",
    approvalStatus: "Approved",
    status: "Awaiting Payment",
    priority: "High",
    daysPending: 12,
    products: [
      { name: "ERP Suite License", sku: "ERP-ENT-ANNUAL", price: 24999, qty: 1, tax: 18, total: 29498.82 },
      { name: "Support Package", sku: "SUP-PREMIUM", price: 5000, qty: 1, tax: 18, total: 5900 },
    ],
    paymentTerms: "Net 15",
    shippingAddress: "123 Tech Park, Bangalore",
  },
  {
    id: "PO-002",
    orderNumber: "SO-2026-00112",
    customer: "Acme Corp",
    salesOwner: "Riya Sharma",
    orderDate: "2026-05-28",
    deliveryDate: "2026-06-05",
    totalItems: 1,
    totalQuantity: 50,
    orderValue: 125000,
    paymentStatus: "Paid",
    approvalStatus: "Pending",
    status: "Pending Approval",
    priority: "Urgent",
    daysPending: 4,
    products: [
      { name: "Wireless Headphones Pro", sku: "WHP-BLK-01", price: 2500, qty: 50, tax: 18, total: 147500 },
    ],
    paymentTerms: "Immediate",
    shippingAddress: "456 Corporate Blvd, NY",
  },
  {
    id: "PO-003",
    orderNumber: "SO-2026-00118",
    customer: "Global Tech",
    salesOwner: "Arjun Mehta",
    orderDate: "2026-06-01",
    deliveryDate: new Date().toISOString().split("T")[0], // Due Today
    totalItems: 5,
    totalQuantity: 120,
    orderValue: 85500,
    paymentStatus: "Partially Paid",
    approvalStatus: "Approved",
    status: "Awaiting Dispatch",
    priority: "Medium",
    daysPending: 1,
    products: [
      { name: "USB-C Hub 7-in-1", sku: "HUB-7IN1-SLV", price: 1299, qty: 20, tax: 18, total: 30656.4 },
    ],
    paymentTerms: "Net 30",
    shippingAddress: "789 Enterprise Way, London",
  },
  {
    id: "PO-004",
    orderNumber: "SO-2026-00122",
    customer: "Stark Industries",
    salesOwner: "V VINAY Kumar",
    orderDate: "2026-06-01",
    deliveryDate: "2026-06-15",
    totalItems: 2,
    totalQuantity: 10,
    orderValue: 15000,
    paymentStatus: "Unpaid",
    approvalStatus: "N/A",
    status: "Draft",
    priority: "Low",
    daysPending: 1,
    products: [
      { name: "Mechanical Keyboard", sku: "MK-87-RED", price: 3499, qty: 10, tax: 18, total: 41288.2 },
    ],
    paymentTerms: "Net 45",
    shippingAddress: "100 Tower St, LA",
  },
];

/* ─────────────────────────── Component ─────────────────────────── */
export default function PendingOrders() {
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState<PendingOrder[]>(MOCK_ORDERS);
  const [view, setView] = useState<"table" | "kanban" | "calendar">("table");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Stats & Alerts Calculation
  const today = new Date().toISOString().split("T")[0];
  const stats = useMemo(() => {
    return {
      total: orders.length,
      value: orders.reduce((sum, o) => sum + o.orderValue, 0),
      dueToday: orders.filter(o => o.deliveryDate === today).length,
      overdue: orders.filter(o => o.deliveryDate < today).length,
      awaitingApproval: orders.filter(o => o.status === "Pending Approval").length,
      awaitingPayment: orders.filter(o => o.status === "Awaiting Payment").length,
      awaitingDispatch: orders.filter(o => o.status === "Awaiting Dispatch").length,
      highPriority: orders.filter(o => o.priority === "High" || o.priority === "Urgent").length,
    };
  }, [orders, today]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<PendingOrder>();
  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />
      ),
      cell: ({ row }) => (
        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} onClick={(e) => e.stopPropagation()} />
      ),
    }),
    columnHelper.accessor("orderNumber", {
      header: "Order Number",
      cell: (info) => (
        <span className="font-mono font-bold text-primary hover:underline cursor-pointer">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("customer", {
      header: "Customer",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("salesOwner", {
      header: "Sales Owner",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-6">
              <span className="text-[10px]">{info.getValue().charAt(0)}</span>
            </div>
          </div>
          <span className="text-xs">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("orderDate", {
      header: "Order Date",
      cell: (info) => <span className="text-base-content/70">{info.getValue()}</span>,
    }),
    columnHelper.accessor("deliveryDate", {
      header: "Delivery Date",
      cell: (info) => {
        const date = info.getValue();
        const isOverdue = date < today;
        const isToday = date === today;
        return (
          <span className={`font-semibold ${isOverdue ? 'text-error' : isToday ? 'text-warning' : ''}`}>
            {date}
            {isOverdue && <MdWarning className="inline ml-1 mb-0.5" size={14} />}
          </span>
        );
      },
    }),
    columnHelper.accessor("orderValue", {
      header: "Order Value",
      cell: (info) => <span className="font-bold text-success">₹{info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor("paymentStatus", {
      header: "Payment",
      cell: (info) => {
        const val = info.getValue();
        const color = val === "Paid" ? "badge-success text-white" : val === "Partially Paid" ? "badge-warning" : "badge-error text-white";
        return <span className={`badge badge-sm border-none ${color}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("approvalStatus", {
      header: "Approval",
      cell: (info) => {
        const val = info.getValue();
        const color = val === "Approved" ? "text-success" : val === "Rejected" ? "text-error" : val === "Pending" ? "text-warning" : "text-base-content/40";
        return <span className={`font-medium text-xs uppercase ${color}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Order Status",
      cell: (info) => {
        const val = info.getValue();
        const colors: Record<string, string> = {
          "Draft": "badge-ghost",
          "Pending Approval": "badge-warning",
          "Approved": "badge-success",
          "Processing": "badge-info",
          "Awaiting Payment": "badge-error text-white",
          "Awaiting Dispatch": "badge-secondary",
        };
        return <span className={`badge badge-sm ${colors[val] || 'badge-neutral'}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => {
        const val = info.getValue();
        const colors: Record<string, string> = { "Low": "text-base-content/50", "Medium": "text-info", "High": "text-warning", "Urgent": "text-error font-bold" };
        return <span className={`text-xs uppercase ${colors[val]}`}>{val}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
          <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
            <MdMoreVert size={16} />
          </button>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-48 border border-base-200">
            <li><a onClick={() => setSelectedOrder(row.original)}><MdViewList /> View Details</a></li>
            <li><a><MdEdit /> Edit Order</a></li>
            <div className="divider my-1"></div>
            {row.original.status === "Pending Approval" && <li><a className="text-success"><MdCheckCircle /> Approve Order</a></li>}
            {row.original.status === "Awaiting Dispatch" && <li><a className="text-primary"><MdLocalShipping /> Mark Dispatched</a></li>}
            <li><a className="text-error">Cancel Order</a></li>
          </ul>
        </div>
      ),
    }),
  ], [today]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.salesOwner.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Kanban Handlers
  const handleDrop = (e: React.DragEvent, status: PendingOrder["status"]) => {
    const orderId = e.dataTransfer.getData("orderId");
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans flex flex-col h-full overflow-hidden relative">
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-base-content tracking-tight">Pending Orders</h1>
          <div className="text-sm text-base-content/60 breadcrumbs mt-1">
            <ul>
              <li>Dashboard</li>
              <li>Sales</li>
              <li>Orders</li>
              <li className="font-semibold text-primary">Pending Orders</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <MdDownload size={16} /> Export
          </button>
          <button className="btn btn-outline btn-sm btn-square">
            <MdRefresh size={16} />
          </button>
          <button onClick={() => navigate("/sales/orders")} className="btn btn-primary btn-sm gap-2">
            <MdAdd size={16} /> Create New Order
          </button>
        </div>
      </div>

      {/* ── Active Alerts ── */}
      <div className="flex flex-col gap-2 mb-4">
        {stats.overdue > 0 && (
          <div className="alert alert-error shadow-sm py-2">
            <MdWarning size={20} />
            <span className="text-sm font-medium">You have {stats.overdue} overdue order(s) requiring immediate attention!</span>
            <button className="btn btn-sm btn-ghost">Review Overdue</button>
          </div>
        )}
        {stats.awaitingApproval > 0 && (
          <div className="alert alert-warning shadow-sm py-2">
            <MdWarning size={20} />
            <span className="text-sm font-medium">{stats.awaitingApproval} order(s) are waiting for management approval.</span>
            <button className="btn btn-sm btn-ghost">Review Approvals</button>
          </div>
        )}
      </div>

      {/* ── Stats Dashboard ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {[
          { label: "Total Pending", value: stats.total, color: "text-base-content" },
          { label: "Pending Value", value: `₹${(stats.value/1000).toFixed(1)}k`, color: "text-primary" },
          { label: "Due Today", value: stats.dueToday, color: "text-warning" },
          { label: "Overdue", value: stats.overdue, color: "text-error" },
          { label: "Needs Approval", value: stats.awaitingApproval, color: "text-warning" },
          { label: "Needs Payment", value: stats.awaitingPayment, color: "text-error" },
          { label: "To Dispatch", value: stats.awaitingDispatch, color: "text-secondary" },
          { label: "High Priority", value: stats.highPriority, color: "text-error" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-shadow">
            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] text-base-content/60 mt-1 text-center font-medium uppercase tracking-wider leading-tight">{stat.label}</span>
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
              placeholder="Search orders, customers..."
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

      {/* ── Advanced Filters Panel ── */}
      {showFilters && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 shadow-sm animate-fade-in-down">
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Order Status</label>
            <select className="select select-sm select-bordered w-full"><option>All Statuses</option><option>Pending Approval</option><option>Awaiting Payment</option></select>
          </div>
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Sales Owner</label>
            <select className="select select-sm select-bordered w-full"><option>All Reps</option><option>V VINAY Kumar</option></select>
          </div>
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Priority</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Urgent</option><option>High</option></select>
          </div>
          <div>
            <label className="text-xs font-semibold text-base-content/70 mb-1 block">Quick Toggles</label>
            <div className="flex gap-4 items-center h-8">
              <label className="cursor-pointer label gap-2 p-0"><input type="checkbox" className="checkbox checkbox-xs" /><span className="label-text text-xs">Overdue</span></label>
              <label className="cursor-pointer label gap-2 p-0"><input type="checkbox" className="checkbox checkbox-xs" /><span className="label-text text-xs">Due Today</span></label>
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 lg:col-span-4 flex justify-end gap-2 mt-2 border-t border-base-200 pt-4">
            <button className="btn btn-sm btn-ghost">Reset Filters</button>
            <button className="btn btn-sm btn-primary">Apply Filters</button>
          </div>
        </div>
      )}

      {/* ── Bulk Actions (Visible when rows selected) ── */}
      {Object.keys(rowSelection).length > 0 && view === "table" && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm animate-fade-in-up">
          <span className="text-sm font-semibold text-primary">{Object.keys(rowSelection).length} order(s) selected</span>
          <div className="flex gap-2">
            <button className="btn btn-xs btn-primary">Approve Selected</button>
            <button className="btn btn-xs btn-outline">Update Status</button>
            <button className="btn btn-xs btn-error btn-outline">Delete</button>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        
        {/* View 1: Table */}
        {view === "table" && (
          <div className="flex-1 overflow-auto">
            {filteredOrders.length > 0 ? (
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
                      onClick={() => setSelectedOrder(row.original)}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center text-base-content/50">
                <MdLocalShipping size={64} className="mb-4 text-base-content/20" />
                <h3 className="text-lg font-bold">No Pending Orders Found</h3>
                <p className="text-sm mt-1 mb-4">All orders are up to date or do not match your filters.</p>
                <button onClick={() => navigate("/sales/orders")} className="btn btn-primary btn-sm">Create New Order</button>
              </div>
            )}
          </div>
        )}

        {/* View 2: Kanban Board */}
        {view === "kanban" && (
          <div className="flex-1 flex overflow-x-auto p-4 gap-4 bg-base-200/30">
            {(["Draft", "Pending Approval", "Approved", "Processing", "Awaiting Payment", "Awaiting Dispatch"] as const).map(status => (
              <div 
                key={status} 
                className="flex-1 min-w-[280px] bg-base-100 rounded-xl border border-base-300 flex flex-col shadow-sm"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="p-3 border-b border-base-200 font-bold text-sm flex justify-between items-center bg-base-200/50 rounded-t-xl">
                  {status}
                  <span className="badge badge-sm">{orders.filter(o => o.status === status).length}</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {filteredOrders.filter(o => o.status === status).map(order => {
                    const isOverdue = order.deliveryDate < today;
                    return (
                      <div 
                        key={order.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, order.id)}
                        onClick={() => setSelectedOrder(order)}
                        className={`bg-base-100 border p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-colors hover:border-primary ${isOverdue ? 'border-error/50 bg-error/5' : 'border-base-300'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono font-bold text-primary">{order.orderNumber}</span>
                          <span className={`badge badge-xs ${order.priority === 'Urgent' ? 'badge-error' : order.priority === 'High' ? 'badge-warning' : 'badge-ghost'}`}>
                            {order.priority}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1 leading-tight">{order.customer}</h4>
                        <p className="text-xs font-bold text-success mt-2 mb-3">₹{order.orderValue.toLocaleString()}</p>
                        <div className="flex justify-between items-center mt-2 border-t border-base-200 pt-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-6">
                              <span className="text-[10px]">{order.salesOwner.charAt(0)}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold ${isOverdue ? 'text-error' : 'text-base-content/60'}`}>
                            Due: {order.deliveryDate}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 3: Calendar */}
        {view === "calendar" && (
          <div className="flex-1 p-6 flex items-center justify-center bg-base-200/30">
            <div className="text-center space-y-4">
              <MdCalendarMonth size={48} className="mx-auto text-base-content/20" />
              <h3 className="text-lg font-bold text-base-content/50">Calendar View</h3>
              <p className="text-sm text-base-content/40 max-w-sm">Full calendar integration maps pending orders to their Delivery Dates here.</p>
            </div>
          </div>
        )}

        {/* Table Pagination Footer */}
        {view === "table" && filteredOrders.length > 0 && (
          <div className="border-t border-base-300 p-3 bg-base-100 flex items-center justify-between text-sm">
            <span className="text-base-content/60">
              Showing {table.getRowModel().rows.length} of {filteredOrders.length} pending orders
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

      {/* ── Order Details Drawer ── */}
      <div className={`fixed inset-0 bg-black/40 z-[100] transition-opacity ${selectedOrder ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute right-0 top-0 h-full w-full md:w-[700px] bg-base-100 shadow-2xl transition-transform duration-300 transform ${selectedOrder ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-base-300 flex justify-between items-center bg-base-200/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-sm font-bold text-primary">{selectedOrder?.orderNumber}</span>
                <span className={`badge badge-sm badge-outline ${selectedOrder?.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedOrder?.status}
                </span>
              </div>
              <h2 className="text-xl font-bold text-base-content leading-tight">{selectedOrder?.customer}</h2>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm gap-2"><MdDownload /> PDF</button>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-ghost btn-circle btn-sm">
                <MdClose size={20} />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-base-100">
            
            {/* Quick Actions Toolbar */}
            <div className="flex flex-wrap gap-2 pb-6 border-b border-base-200">
              {selectedOrder?.status === "Pending Approval" && (
                <>
                  <button className="btn btn-sm btn-success text-white gap-2"><MdCheckCircle /> Approve</button>
                  <button className="btn btn-sm btn-error text-white gap-2"><MdClose /> Reject</button>
                </>
              )}
              {selectedOrder?.status === "Approved" && (
                <button className="btn btn-sm btn-info text-white gap-2">Mark Processing</button>
              )}
              {selectedOrder?.status === "Awaiting Dispatch" && (
                <button className="btn btn-sm btn-primary gap-2"><MdLocalShipping /> Mark Dispatched</button>
              )}
              {selectedOrder?.status === "Awaiting Payment" && (
                <button className="btn btn-sm btn-outline btn-warning gap-2"><MdPayment /> Send Reminder</button>
              )}
              <button className="btn btn-sm btn-outline"><MdEdit /> Edit Order</button>
            </div>

            {/* Basic Info */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Order Information</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-base-content/50 mb-1">Sales Owner</p><p className="font-semibold">{selectedOrder?.salesOwner}</p></div>
                <div><p className="text-base-content/50 mb-1">Priority</p>
                  <span className={`badge badge-sm ${selectedOrder?.priority === 'Urgent' ? 'badge-error' : 'badge-ghost'}`}>{selectedOrder?.priority}</span>
                </div>
                <div><p className="text-base-content/50 mb-1">Order Date</p><p className="font-medium">{selectedOrder?.orderDate}</p></div>
                <div>
                  <p className="text-base-content/50 mb-1">Delivery Date</p>
                  <p className={`font-bold ${selectedOrder && selectedOrder.deliveryDate < today ? 'text-error' : 'text-base-content'}`}>
                    {selectedOrder?.deliveryDate} {selectedOrder && selectedOrder.deliveryDate < today && '(Overdue)'}
                  </p>
                </div>
              </div>
            </section>

            {/* Products Table */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Order Items ({selectedOrder?.totalItems})</h3>
              <div className="overflow-x-auto border border-base-200 rounded-lg">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder?.products.map((p, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-[10px] font-mono text-base-content/60">{p.sku}</div>
                        </td>
                        <td>{p.qty}</td>
                        <td>₹{p.price.toLocaleString()}</td>
                        <td className="text-right font-bold text-success">₹{p.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-base-100 font-bold text-base">
                      <td colSpan={3} className="text-right">Grand Total:</td>
                      <td className="text-right text-success">₹{selectedOrder?.orderValue.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Payment & Delivery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Payment Info</h3>
                <div className="space-y-3 text-sm p-4 bg-base-200/40 rounded-xl border border-base-200">
                  <div className="flex justify-between"><span className="text-base-content/60">Status</span><span className="font-bold">{selectedOrder?.paymentStatus}</span></div>
                  <div className="flex justify-between"><span className="text-base-content/60">Terms</span><span className="font-medium">{selectedOrder?.paymentTerms}</span></div>
                </div>
              </section>
              
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Delivery Info</h3>
                <div className="space-y-3 text-sm p-4 bg-base-200/40 rounded-xl border border-base-200">
                  <div className="flex flex-col"><span className="text-base-content/60 mb-1">Shipping Address</span><span className="font-medium leading-relaxed">{selectedOrder?.shippingAddress}</span></div>
                </div>
              </section>
            </div>

            {/* Activity Timeline */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-4">Activity Timeline</h3>
              <ul className="timeline timeline-vertical timeline-compact">
                <li>
                  <hr className="bg-primary" />
                  <div className="timeline-middle text-primary"><MdCheckCircle /></div>
                  <div className="timeline-end timeline-box border-none shadow-none bg-transparent px-2 py-1">
                    <div className="text-xs text-base-content/50">Today 10:30 AM</div>
                    <div className="text-sm font-medium">Status changed to {selectedOrder?.status}</div>
                  </div>
                  <hr className="bg-base-300" />
                </li>
                <li>
                  <hr className="bg-base-300" />
                  <div className="timeline-middle text-base-300"><MdCheckCircle /></div>
                  <div className="timeline-end timeline-box border-none shadow-none bg-transparent px-2 py-1">
                    <div className="text-xs text-base-content/50">{selectedOrder?.orderDate}</div>
                    <div className="text-sm font-medium">Order Created by {selectedOrder?.salesOwner}</div>
                  </div>
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>

    </div>
  );
}
