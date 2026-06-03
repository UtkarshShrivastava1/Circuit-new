import { useState, useMemo } from "react";
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
  MdAdd,
  MdMoreVert,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdBusiness,
  MdEdit,
  MdDelete,
  MdAssignmentInd,
  MdPeople,
} from "react-icons/md";

/* ─────────────────────────── types ─────────────────────────── */
export interface Account {
  id: string;
  accountOwner: string;
  accountName: string;
  industry: string;
  accountType: "Individual" | "Business" | "Enterprise" | "Partner";
  status: "Active" | "Inactive" | "Prospect" | "Customer" | "VIP" | "Blocked";
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  territory: string;
  revenue: number;
  lastActivity: string;
  createdDate: string;
}

/* ─────────────────────────── mock data ──────────────────────── */
const SAMPLE: Account[] = [
  {
    id: "ACC-1001",
    accountName: "Zager Digital Services",
    accountOwner: "V VINAY Kumar",
    industry: "Technology",
    accountType: "Enterprise",
    status: "VIP",
    contactName: "Alice Johnson",
    contactEmail: "alice@zager.com",
    contactNumber: "+91 9876543210",
    territory: "APAC",
    revenue: 1250000,
    lastActivity: "2026-06-02",
    createdDate: "2024-01-15",
  },
  {
    id: "ACC-1002",
    accountName: "Acme Corp",
    accountOwner: "Riya Sharma",
    industry: "Manufacturing",
    accountType: "Business",
    status: "Customer",
    contactName: "Bob Smith",
    contactEmail: "bob@acme.com",
    contactNumber: "+1 555-0198",
    territory: "North America",
    revenue: 450000,
    lastActivity: "2026-05-28",
    createdDate: "2025-11-20",
  },
  {
    id: "ACC-1003",
    accountName: "Stark Industries",
    accountOwner: "Arjun Mehta",
    industry: "Defense",
    accountType: "Enterprise",
    status: "Active",
    contactName: "Tony Stark",
    contactEmail: "tony@stark.com",
    contactNumber: "+1 555-0200",
    territory: "North America",
    revenue: 5500000,
    lastActivity: "2026-06-01",
    createdDate: "2023-08-10",
  },
  {
    id: "ACC-1004",
    accountName: "Global Retailers",
    accountOwner: "V VINAY Kumar",
    industry: "Retail",
    accountType: "Partner",
    status: "Prospect",
    contactName: "Sarah Connor",
    contactEmail: "sarah.c@global.com",
    contactNumber: "+44 20 7123 4567",
    territory: "EMEA",
    revenue: 0,
    lastActivity: "2026-05-30",
    createdDate: "2026-05-01",
  },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AccountsDashboard() {
  const navigate = useNavigate();

  // State
  const [accounts, setAccounts] = useState<Account[]>(SAMPLE);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === "Active" || a.status === "VIP" || a.status === "Customer").length,
      prospects: accounts.filter(a => a.status === "Prospect").length,
      revenue: accounts.reduce((sum, a) => sum + a.revenue, 0),
    };
  }, [accounts]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<Account>();
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
    columnHelper.accessor("accountName", {
      header: "Account Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary/10 text-primary rounded-xl w-10 h-10 border border-primary/20 flex items-center justify-center font-bold">
              <span>{info.getValue().charAt(0)}</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-base-content hover:text-primary cursor-pointer hover:underline transition-colors">{info.getValue()}</div>
            <div className="text-xs text-base-content/60">{info.row.original.accountType} • {info.row.original.industry}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("contactName", {
      header: "Primary Contact",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium text-base-content/90">{info.getValue()}</span>
          <span className="text-xs text-base-content/60">{info.row.original.contactEmail}</span>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();
        const colors: Record<string, string> = {
          "Active": "badge-success text-white",
          "Customer": "badge-primary text-white",
          "VIP": "badge-warning text-warning-content font-bold",
          "Prospect": "badge-info text-info-content",
          "Inactive": "badge-ghost",
          "Blocked": "badge-error text-white",
        };
        return <span className={`badge badge-sm border-none shadow-sm ${colors[val]}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("revenue", {
      header: "Revenue Generated",
      cell: (info) => <span className="font-bold text-success text-sm">${info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor("accountOwner", {
      header: "Account Owner",
      cell: (info) => <span className="text-sm font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("lastActivity", {
      header: "Last Activity",
      cell: (info) => <span className="text-xs text-base-content/70">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
          <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
            <MdMoreVert size={18} />
          </button>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-200">
            <li><a onClick={() => navigate(`/sales/accounts/${row.original.id}`)}><MdBusiness size={16} /> View Dashboard</a></li>
            <li><a onClick={() => navigate(`/sales/accounts/edit/${row.original.id}`)}><MdEdit size={16} /> Edit Account</a></li>
            <li><a><MdAssignmentInd size={16} /> Assign Rep</a></li>
            <div className="divider my-1"></div>
            <li><a className="text-error hover:bg-error/10"><MdDelete size={16} /> Delete</a></li>
          </ul>
        </div>
      ),
    }),
  ], [navigate]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(a => 
      a.accountName.toLowerCase().includes(search.toLowerCase()) || 
      a.contactName.toLowerCase().includes(search.toLowerCase()) ||
      a.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
      a.accountOwner.toLowerCase().includes(search.toLowerCase())
    );
  }, [accounts, search]);

  const table = useReactTable({
    data: filteredAccounts,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans flex flex-col h-full overflow-hidden relative">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-base-content tracking-tight">Accounts Management</h1>
          <div className="text-sm text-base-content/60 breadcrumbs mt-1 font-medium">
            <ul>
              <li>Dashboard</li>
              <li>Sales</li>
              <li className="text-primary">Accounts</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-outline btn-sm gap-2 bg-base-100">
            <MdDownload size={16} /> Export CSV
          </button>
          <button className="btn btn-outline btn-sm btn-square bg-base-100">
            <MdRefresh size={16} />
          </button>
          <button onClick={() => navigate("/sales/accounts/new")} className="btn btn-primary btn-sm gap-2 shadow-sm">
            <MdAdd size={16} /> Add Account
          </button>
        </div>
      </div>

      {/* ── Dashboard Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Accounts", value: stats.total, color: "text-base-content" },
          { label: "Active & VIP", value: stats.active, color: "text-primary" },
          { label: "New Prospects", value: stats.prospects, color: "text-info" },
          { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-success" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-base-100 border border-base-300 rounded-xl p-5 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-base-300"></div>
            <span className="text-xs text-base-content/60 font-bold uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-base-100 p-3 rounded-xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
            <input
              type="text"
              placeholder="Search accounts, contacts, emails..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input input-sm input-bordered w-full pl-9 focus:outline-none focus:border-primary"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn btn-sm ${showFilters ? "btn-primary" : "btn-outline bg-base-100"} gap-2`}>
            <MdFilterList size={16} /> Filters
          </button>
        </div>
      </div>

      {/* ── Filters Panel ── */}
      {showFilters && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 shadow-sm animate-fade-in-down">
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Status</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Active</option><option>VIP</option><option>Prospect</option></select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Account Type</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Enterprise</option><option>Business</option><option>Partner</option></select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Industry</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Technology</option><option>Manufacturing</option></select>
          </div>
          <div className="flex items-end gap-2">
            <button className="btn btn-sm btn-primary flex-1">Apply</button>
            <button className="btn btn-sm btn-ghost flex-1">Reset</button>
          </div>
        </div>
      )}

      {/* ── Bulk Actions ── */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm animate-fade-in-up">
          <span className="text-sm font-semibold text-primary">{Object.keys(rowSelection).length} accounts selected</span>
          <div className="flex gap-2">
            <button className="btn btn-xs btn-primary">Assign Owner</button>
            <button className="btn btn-xs btn-outline bg-base-100">Update Status</button>
            <button className="btn btn-xs btn-error text-white">Delete</button>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        <div className="flex-1 overflow-auto">
          <table className="table table-pin-rows w-full text-sm">
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
                  onClick={() => navigate(`/sales/accounts/${row.original.id}`)}
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
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <MdBusiness size={48} className="text-base-content/20" />
                      <p className="text-base-content/50 font-medium">No accounts found matching your criteria.</p>
                      <button onClick={() => navigate("/sales/accounts/new")} className="btn btn-outline btn-sm mt-2">Create New Account</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="border-t border-base-300 p-3 bg-base-100 flex items-center justify-between text-sm">
          <span className="text-base-content/60 font-medium">
            Showing {table.getRowModel().rows.length} of {filteredAccounts.length} accounts
          </span>
          <div className="flex items-center gap-3">
            <select 
              className="select select-sm select-bordered bg-base-200"
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>Show {pageSize}</option>
              ))}
            </select>
            <div className="join">
              <button className="join-item btn btn-sm bg-base-200" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>«</button>
              <button className="join-item btn btn-sm bg-base-200">Page {table.getState().pagination.pageIndex + 1}</button>
              <button className="join-item btn btn-sm bg-base-200" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>»</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}