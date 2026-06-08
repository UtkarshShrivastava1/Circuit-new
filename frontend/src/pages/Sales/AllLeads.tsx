import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  MdMoreVert,
  MdDownload,
  MdRefresh,
  MdClose,
  MdEdit,
  MdDelete,
  MdPhone,
  MdEmail,
  MdBusiness,
  MdTimeline,
  MdNotes,
  MdPerson,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useAuth } from "@/auth/AuthContext"; 
import { getLeads, updateLead, deleteLead, createLead, type Lead } from "@/services/leadServices";
import ImportExportActions from "@/components/import-export/ImportExportActions";
import type { ColumnConfig } from "@/type/importExport.types";

const leadColumns: ColumnConfig[] = [
  { key: "firstName", label: "First Name", required: true, type: "string" },
  { key: "lastName", label: "Last Name", required: true, type: "string" },
  { key: "email", label: "Email", required: true, type: "email" },
  { key: "phoneNumber", label: "Phone", type: "string" },
  { key: "companyName", label: "Company", required: true, type: "string" },
  { key: "status", label: "Status", type: "string" },
  { key: "priority", label: "Priority", type: "string" },
  { key: "source", label: "Lead Source", type: "string" },
  { key: "industry", label: "Industry", type: "string" },
  { key: "leadOwner", label: "Lead Owner", type: "string" },
  { key: "value", label: "Estimated Value", type: "number" },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllLeads() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "notes">("overview");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkStatusModalOpen, setBulkStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Lead["status"]>("New");

  // Data Fetching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leads", auth.slug],
    queryFn: () => getLeads(auth.slug || "default-tenant"),
  });

  const leads = data?.data || [];

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; payload: Partial<Lead> }) => updateLead(vars.id, vars.payload, auth.slug || "default-tenant"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id, auth.slug || "default-tenant"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  // Actions
  const initiateDelete = useCallback((id: string) => {
    setLeadToDelete(id);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await deleteMutation.mutateAsync(leadToDelete);
      setDeleteModalOpen(false);
      setLeadToDelete(null);
      if (selectedLead?.id === leadToDelete) setSelectedLead(null);
      toast.success("Lead deleted successfully!");
    } catch (error: unknown) {
      toast.error("Failed to delete lead.");
    }
  };

  const getSelectedLeads = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => filteredLeads[index]);
  };

  const handleBulkStatusUpdate = async () => {
    const selected = getSelectedLeads();
    try {
      await Promise.all(selected.map(l => updateMutation.mutateAsync({ id: l.id, payload: { status: newStatus } })));
      setBulkStatusModalOpen(false);
      setRowSelection({});
      toast.success(`Status updated to ${newStatus} for selected leads!`);
    } catch (error: unknown) {
      toast.error("Failed to update status for some leads.");
    }
  };

  const handleImportSubmit = async (validRows: any[]) => {
    await Promise.all(validRows.map(row => createLead(auth.slug || "default-tenant", row as Partial<Lead>)));
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter(l => l.status === "New").length,
      qualified: leads.filter(l => l.status === "Qualified").length,
      won: leads.filter(l => l.status === "Won").length,
      totalValue: leads.filter(l => l.status !== "Lost").reduce((sum, l) => sum + (l.value || 0), 0),
    };
  }, [leads]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<Lead>();
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
    columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
      id: "name",
      header: "Lead Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-8 h-8">
              <span className="text-xs">{info.row.original.firstName?.[0]}{info.row.original.lastName?.[0]}</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-base-content hover:text-primary cursor-pointer hover:underline transition-colors">{info.getValue()}</div>
            <div className="text-xs text-base-content/60">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("companyName", {
      header: "Company",
      cell: (info) => <span className="font-medium text-base-content/80">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const val = info.getValue();
        const colors: Record<string, string> = {
          "New": "badge-info text-info-content",
          "Contacted": "badge-primary text-primary-content",
          "Qualified": "badge-secondary text-secondary-content",
          "Proposal Sent": "badge-accent text-accent-content",
          "Negotiation": "badge-warning text-warning-content",
          "Won": "badge-success text-success-content",
          "Lost": "badge-error text-error-content",
        };
        return <span className={`badge badge-sm font-medium border-none shadow-sm ${colors[val] || 'badge-neutral'}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => {
        const val = info.getValue();
        const colors: Record<string, string> = { "Low": "text-base-content/50", "Medium": "text-info", "High": "text-warning", "Urgent": "text-error font-bold" };
        return <span className={`text-xs uppercase font-semibold ${colors[val]}`}>{val}</span>;
      },
    }),
    columnHelper.accessor("leadOwner", {
      header: "Owner",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("createdDate", {
      header: "Created",
      cell: (info) => <span className="text-sm text-base-content/70">{info.getValue() ? new Date(info.getValue()).toLocaleDateString() : ""}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
          <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
            <MdMoreVert size={18} />
          </button>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-200">
            <li><a onClick={() => setSelectedLead(row.original)}><MdPerson size={16} /> View Details</a></li>
            <li><a onClick={() => navigate(`/sales/leads/edit/${row.original.id}`)}><MdEdit size={16} /> Edit Lead</a></li>
            <div className="divider my-1"></div>
            <li><a className="text-error hover:bg-error/10" onClick={() => initiateDelete(row.original.id)}><MdDelete size={16} /> Delete</a></li>
          </ul>
        </div>
      ),
    }),
  ], [navigate, initiateDelete]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.firstName?.toLowerCase().includes(search.toLowerCase()) || 
      l.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  const table = useReactTable({
    data: filteredLeads,
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
          <h1 className="text-2xl font-bold text-base-content tracking-tight">Leads Management</h1>
          <div className="text-sm text-base-content/60 breadcrumbs mt-1 font-medium">
            <ul>
              <li>Dashboard</li>
              <li>Sales</li>
              <li className="text-primary">Leads</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportExportActions
            moduleName="Leads"
            columns={leadColumns}
            data={filteredLeads}
            selectedData={getSelectedLeads()}
            onImportSubmit={handleImportSubmit}
          />
          <button onClick={() => refetch()} className="btn btn-outline btn-sm btn-square bg-base-100">
            <MdRefresh size={16} />
          </button>
          <button onClick={() => navigate("/sales/leads/new")} className="btn btn-primary btn-sm gap-2 shadow-sm">
            <MdAdd size={16} /> Create Lead
          </button>
        </div>
      </div>

      {/* ── Dashboard Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Leads", value: stats.total, color: "text-base-content" },
          { label: "New Leads", value: stats.new, color: "text-info" },
          { label: "Qualified", value: stats.qualified, color: "text-secondary" },
          { label: "Pipeline Value", value: `₹${stats.totalValue.toLocaleString()}`, color: "text-success" },
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
              placeholder="Search leads by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Lead Status</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>New</option><option>Qualified</option></select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Lead Source</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>Website</option><option>Referral</option></select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">Lead Owner</label>
            <select className="select select-sm select-bordered w-full"><option>All</option><option>V VINAY Kumar</option></select>
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
          <span className="text-sm font-semibold text-primary">{Object.keys(rowSelection).length} leads selected</span>
          <div className="flex gap-2">
            <button className="btn btn-xs btn-primary" onClick={() => setBulkStatusModalOpen(true)}>Update Status</button>
            <button className="btn btn-xs btn-outline bg-base-100">Assign Owner</button>
            <button className="btn btn-xs btn-error text-white" onClick={() => {toast.info("Bulk delete not fully implemented");}}>Delete</button>
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      {isLoading ? (
        <div className="flex-1 flex flex-col justify-center items-center h-full space-y-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p>Loading Leads...</p>
        </div>
      ) : (
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
                  onClick={() => setSelectedLead(row.original)}
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
                      <MdPerson size={48} className="text-base-content/20" />
                      <p className="text-base-content/50 font-medium">No leads found matching your criteria.</p>
                      <button onClick={() => navigate("/sales/leads/new")} className="btn btn-outline btn-sm mt-2">Create New Lead</button>
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
            Showing {table.getRowModel().rows.length} of {filteredLeads.length} leads
          </span>
          <div className="flex items-center gap-3">
            <select 
              className="select select-sm select-bordered bg-base-200"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
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
      )}

      {/* ── Lead Details Drawer ── */}
      <div className={`fixed inset-0 bg-black/40 z-[100] transition-opacity ${selectedLead ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setSelectedLead(null)}>
        <div className={`absolute right-0 top-0 h-full w-full md:w-[600px] bg-base-100 shadow-2xl transition-transform duration-300 transform ${selectedLead ? "translate-x-0" : "translate-x-full"} flex flex-col`} onClick={(e) => e.stopPropagation()}>
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-base-300 bg-base-200/50 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-14 h-14 text-xl font-bold shadow-sm">
                    <span>{selectedLead?.firstName?.[0]}{selectedLead?.lastName?.[0]}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content leading-tight">{selectedLead?.firstName} {selectedLead?.lastName}</h2>
                  <p className="text-sm font-medium text-base-content/60 mt-0.5">{selectedLead?.companyName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="btn btn-ghost btn-circle btn-sm bg-base-200">
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex-1"><MdPhone /> Call</button>
              <button className="btn btn-outline btn-sm flex-1 bg-base-100"><MdEmail /> Email</button>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-outline btn-sm btn-square bg-base-100"><MdMoreVert size={18}/></button>
                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-40 mt-1 border border-base-200">
                  <li><a onClick={() => navigate(`/sales/leads/edit/${selectedLead?.id}`)}>Edit Lead</a></li>
                  <li><a>Convert to Customer</a></li>
                  <div className="divider my-1"></div>
                  <li><a className="text-error" onClick={() => { if(selectedLead) initiateDelete(selectedLead.id); }}>Delete Lead</a></li>
                </ul>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="tabs tabs-bordered w-full border-b border-base-300 mt-2">
              <a className={`tab font-medium ${activeTab === 'overview' ? 'tab-active text-primary' : ''}`} onClick={() => setActiveTab("overview")}>Overview</a>
              <a className={`tab font-medium ${activeTab === 'timeline' ? 'tab-active text-primary' : ''}`} onClick={() => setActiveTab("timeline")}>Timeline</a>
              <a className={`tab font-medium ${activeTab === 'notes' ? 'tab-active text-primary' : ''}`} onClick={() => setActiveTab("notes")}>Notes</a>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-100">
            
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4 flex items-center gap-2"><MdPerson /> Lead Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div><p className="text-base-content/50 mb-1">Status</p><span className="badge badge-sm badge-info font-medium">{selectedLead?.status}</span></div>
                    <div><p className="text-base-content/50 mb-1">Priority</p><span className="font-semibold text-warning">{selectedLead?.priority}</span></div>
                    <div><p className="text-base-content/50 mb-1">Lead Owner</p><p className="font-medium">{selectedLead?.leadOwner}</p></div>
                    <div><p className="text-base-content/50 mb-1">Lead Source</p><p className="font-medium">{selectedLead?.source}</p></div>
                    <div><p className="text-base-content/50 mb-1">Estimated Value</p><p className="font-bold text-success">${selectedLead?.value?.toLocaleString()}</p></div>
                    <div><p className="text-base-content/50 mb-1">Industry</p><p className="font-medium">{selectedLead?.industry}</p></div>
                  </div>
                </section>
                
                <div className="divider my-0"></div>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4 flex items-center gap-2"><MdBusiness /> Contact Details</h3>
                  <div className="grid grid-cols-1 gap-y-4 text-sm bg-base-200/50 p-4 rounded-xl border border-base-200">
                    <div className="flex items-center gap-3"><MdEmail className="text-base-content/40" size={18}/> <a href={`mailto:${selectedLead?.email}`} className="text-primary hover:underline">{selectedLead?.email}</a></div>
                    <div className="flex items-center gap-3"><MdPhone className="text-base-content/40" size={18}/> <a href={`tel:${selectedLead?.phoneNumber}`} className="text-primary hover:underline">{selectedLead?.phoneNumber}</a></div>
                  </div>
                </section>

                <section className="bg-base-200/30 p-4 rounded-xl border border-base-200 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-base-content/60">
                    <p>Created: {selectedLead?.createdDate ? new Date(selectedLead.createdDate).toLocaleDateString() : ""}</p>
                    <p>Last Contact: {selectedLead?.lastContacted ? new Date(selectedLead.lastContacted).toLocaleDateString() : "Never"}</p>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="animate-fade-in">
                <ul className="timeline timeline-vertical timeline-compact">
                  <li>
                    <hr className="bg-primary" />
                    <div className="timeline-middle text-primary"><MdTimeline /></div>
                    <div className="timeline-end timeline-box border-none shadow-none bg-transparent py-2">
                      <div className="text-xs text-base-content/50">{selectedLead?.lastContacted ? new Date(selectedLead.lastContacted).toLocaleDateString() : "N/A"}</div>
                      <div className="text-sm font-medium">Status changed to {selectedLead?.status}</div>
                    </div>
                    <hr className="bg-base-300" />
                  </li>
                  <li>
                    <hr className="bg-base-300" />
                    <div className="timeline-middle text-base-300"><MdTimeline /></div>
                    <div className="timeline-end timeline-box border-none shadow-none bg-transparent py-2">
                      <div className="text-xs text-base-content/50">{selectedLead?.createdDate ? new Date(selectedLead.createdDate).toLocaleDateString() : ""}</div>
                      <div className="text-sm font-medium">Lead Created by System</div>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="animate-fade-in flex flex-col h-full">
                <textarea className="textarea textarea-bordered w-full flex-1 min-h-[200px]" placeholder="Add a note about this lead..."></textarea>
                <button className="btn btn-primary mt-4 self-end gap-2"><MdNotes /> Save Note</button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <dialog className={`modal ${deleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Delete Lead</h3>
          <p className="py-4 text-base-content/80">Are you sure you want to delete this lead? This action cannot be undone.</p>
          <div className="modal-action mt-6">
            <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-error text-white" onClick={confirmDelete}>Yes, Delete</button>
          </div>
        </div>
      </dialog>

      {/* ── Bulk Status Update Modal ── */}
      <dialog className={`modal ${bulkStatusModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Status for Selected Leads</h3>
          <select className="select select-bordered w-full" value={newStatus} onChange={(e) => setNewStatus(e.target.value as Lead["status"])}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
          <div className="modal-action mt-6">
            <button className="btn btn-ghost" onClick={() => setBulkStatusModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBulkStatusUpdate}>Update Status</button>
          </div>
        </div>
      </dialog>

    </div>
  );
}