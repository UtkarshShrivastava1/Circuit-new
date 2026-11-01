import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
 // apne actual service path ke according
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
  MdMoreVert,
  MdClose,
  MdEdit,
  MdDelete,
  MdPhone,
  MdEmail,
  MdBusiness,
  MdTimeline,
  MdNotes,
  MdPerson,
  MdAdd,
  MdDownload,
} from "react-icons/md";
import { deleteLead, getLeads, updateLead, convertLeadToCustomer, bulkDeleteLeads } from "@/services/leadServices";
import { useAuth } from "@/auth/useAuth";
import { toast } from "react-toastify";
import {PageHeader ,StatsGrid,} from "@/components/common";
import { getSalesReps } from "@/services/salesRepServices";

/* ─────────────────────────── types ─────────────────────────── */
// export interface Lead {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   email: string;
//   phoneNumber: string;
//   leadOwner:
//     | string
//     | {
//         _id: string;
//         name: string;
//         email: string;
//       };
//   leadSource: string;
//   industry: string;
//   leadStatus:
//     | "New"
//     | "Contacted"
//     | "Qualified"
//     | "Proposal Sent"
//     | "Negotiation"
//     | "Won"
//     | "Lost";
//   priority: "Low" | "Medium" | "High" | "Urgent";
//   createdAt: string;
//   lastContacted: string;
//   value?: number;
// }

export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phoneNumber: string;

  leadOwner:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };

  leadSource: string;
  customLeadSource?: string;

  industry: string;
  customIndustry?: string;

  leadStatus:
    | "New"
    | "Contacted"
    | "Qualified"
    | "Proposal Sent"
    | "Negotiation"
    | "Won"
    | "Lost";

  priority: "Low" | "Medium" | "High" | "Urgent";

  gender?: string;
  countryCode?: string;
  customCountryCode?: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  customCountry?: string;

  description?: string;
  createdAt: string;
  lastContacted: string;
  value?: number;
}
const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Cold Call",
  "Trade Show",
  "Other",
];

const INDUSTRIES = [
  "IT",
  "Healthcare",
  "Education",
  "Finance",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Telecom",
  "Construction",
  "Other",
];

const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const PHONE_CODES = [
  "+91",
  "+1",
  "+44",
  "+61",
  "+971",
  "+65",
  "+49",
  "+33",
  "+81",
  "+86",
  "Other",
];
const COUNTRIES = [
  "India",
  "USA/Canada",
  "UK",
  "Australia",
  "Canada",
  "Singapore",
  "Germany",
  "France",
  "UAE",
  "Other",
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllLeads() {
  const navigate = useNavigate();
const [isLeadMenuOpen, setIsLeadMenuOpen] = useState(false);
  // State
  const [statusFilter, setStatusFilter] = useState("All");
const [sourceFilter, setSourceFilter] = useState("All");
const [ownerFilter, setOwnerFilter] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Lead>>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  // const [showSearch, setShowSearch] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "notes">(
    "overview",
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { auth } = useAuth();
  const slug = auth?.slug;
   const { data: repsData } = useQuery({
  queryKey: ["salesReps", auth.slug],
  queryFn: () => getSalesReps(auth.slug || "default-tenant"),
});

const salesReps = useMemo(() => {
  return repsData?.data || [];
}, [repsData]);

console.log("Sales Reps:", salesReps);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await getLeads(slug || "");
        
        setLeads(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      fetchLeads();
    }
  }, [slug]);
  console.log(leads);
  // useEffect(() => {
  //   if (selectedLead) {
  //     setEditData(selectedLead);
  //   }
  // }, [selectedLead]);


  const handleDelete = async (leadId: string) => {
    try {
      await deleteLead(leadId, slug || "");

      toast.success("Lead deleted successfully");

      // UI update
      setLeads((prev) => prev.filter((lead) => lead._id !== leadId));
    } catch (error) {
      toast.error("Failed to delete lead");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const idsToDelete = selectedRows.map((r) => r.original._id);

    if (idsToDelete.length === 0) return;

    setIsBulkDeleting(true);
    try {
      await bulkDeleteLeads(idsToDelete, slug || "");

      toast.success(`${idsToDelete.length} lead(s) deleted successfully`);

      setLeads((prev) => prev.filter((lead) => !idsToDelete.includes(lead._id)));
      setRowSelection({});
      setBulkDeleteModalOpen(false);
    } catch (error: any) {
      console.error("Bulk delete error:", error);
      toast.error(error.message || "Failed to delete selected leads");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // const handleUpdateLead = async () => {
  //   try {
  //     if (!selectedLead?._id) return;

  //     const res = await updateLead(selectedLead._id, editData as any, slug || "");

  //     const updatedLead = res.data as unknown as Lead;

  //     setLeads((prev) =>
  //       prev.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead)),
  //     );

  //     setSelectedLead(updatedLead);
  //     setIsEditing(false);

  //     toast.success("Lead updated successfully");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to update lead");
  //   }
  // };
  
  
  const handleUpdateLead = async () => {
  try {
    if (!selectedLead?._id) return;

    if (editData.industry === "Other" && !editData.customIndustry?.trim()) {
      toast.error("Please enter custom industry");
      return;
    }

    if (editData.leadSource === "Other" && !editData.customLeadSource?.trim()) {
      toast.error("Please enter custom lead source");
      return;
    }

    if (editData.countryCode === "Other" && !editData.customCountryCode?.trim()) {
      toast.error("Please enter custom country code");
      return;
    }

    if (editData.country === "Other" && !editData.customCountry?.trim()) {
      toast.error("Please enter custom country");
      return;
    }

    const payload = {
      ...editData,

      leadSource: editData.leadSource,
      customLeadSource:
        editData.leadSource === "Other"
          ? editData.customLeadSource?.trim()
          : "",

      industry: editData.industry,
      customIndustry:
        editData.industry === "Other"
          ? editData.customIndustry?.trim()
          : "",

      countryCode: editData.countryCode || "+91",
      customCountryCode:
        editData.countryCode === "Other"
          ? editData.customCountryCode?.trim()
          : "",

      country: editData.country || "India",
      customCountry:
        editData.country === "Other"
          ? editData.customCountry?.trim()
          : "",
    };

    const res = await updateLead(
      selectedLead._id,
      payload as any,
      slug || ""
    );

    const updatedLead = (res.data?.data || res.data) as Lead;

    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );

    setSelectedLead(updatedLead);
    setEditData(updatedLead);
    setIsEditing(false);

    toast.success("Lead updated successfully");
  } catch (error: any) {
    console.error("Update lead error:", error);
    toast.error(
      error.response?.data?.message || "Failed to update lead"
    );
  }
};
const startEditingLead = (lead: Lead) => {
  setEditData({
    ...lead,

    leadSource: lead.leadSource || "Website",
    customLeadSource: lead.customLeadSource || "",

    industry: lead.industry || "IT",
    customIndustry: lead.customIndustry || "",

    countryCode: lead.countryCode || "+91",
    customCountryCode: lead.customCountryCode || "",

    country: lead.country || "India",
    customCountry: lead.customCountry || "",

    leadOwner:
      typeof lead.leadOwner === "object"
        ? lead.leadOwner._id
        : lead.leadOwner,
  });

  setIsEditing(true);
};
  const handleConvertToCustomer = async (leadToConvert: Lead | null) => {
    if (!leadToConvert?._id) return;
    try {
      const data = await convertLeadToCustomer(slug || ""  ,leadToConvert._id );
      if (!data?.success) {
        throw new Error(data.message || "Failed to convert lead");
      }

      setLeads((prev) =>
        prev.map((lead) => (lead._id === leadToConvert._id ? { ...lead, leadStatus: "Won" } : lead))
      );
      
      toast.success("Lead successfully converted to Customer!");
      setSelectedLead(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to convert lead");
    }
  };

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      total: leads.length || 0,
      new: leads.filter((l) => l.leadStatus === "New").length,
      qualified: leads.filter((l) => l.leadStatus === "Qualified").length,
      won: leads.filter((l) => l.leadStatus === "Won").length,
      totalValue: leads
        .filter((l) => l.leadStatus !== "Lost")
        .reduce((sum, l) => sum + (l.value || 0), 0),
    };
  }, [leads]);

  // TanStack Table Setup
  const columnHelper = createColumnHelper<Lead>();
  const columns = useMemo(
    () => [
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
      columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: "name",
        header: "Lead Name",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                <span className="text-xs items-center flex justify-center p-1.5">
                  {info.row.original.firstName[0]}
                  {info.row.original.lastName[0]}
                </span>
              </div>
            </div>
            <div>
              <div className="font-bold text-base-content hover:text-primary cursor-pointer hover:underline transition-colors">
                {info.getValue()}
              </div>
              <div className="text-xs text-base-content/60">
                {info.row.original.email}
              </div>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("companyName", {
        header: "Company",
        cell: (info) => (
          <span className="font-medium text-base-content/80">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("leadStatus", {
        header: "Status",
        cell: (info) => {
          const val = info.getValue();

          const colors: Record<string, string> = {
            New: "badge-info text-info-content",
            Contacted: "badge-primary text-primary-content",
            Qualified: "badge-secondary text-secondary-content",
            "Proposal Sent": "badge-accent text-accent-content",
            Negotiation: "badge-warning text-warning-content",
            Won: "badge-success text-success-content",
            Lost: "badge-error text-error-content",
          };
          return (
            <span
              className={`badge badge-sm font-medium border-none shadow-sm ${colors[val] || "badge-neutral"}`}
            >
              {val}
            </span>
          );
        },
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => {
          const val = info.getValue();
          const colors: Record<string, string> = {
            Low: "text-base-content/50",
            Medium: "text-info",
            High: "text-warning",
            Urgent: "text-error font-bold",
          };
          return (
            <span className={`text-xs uppercase font-semibold ${colors[val]}`}>
              {val}
            </span>
          );
        },
      }),
    
      
//       columnHelper.accessor("leadOwner", {
//   header: "Owner",
//   cell: (info) => {
//     const owner = info.getValue();

//     return (
//       <span className="text-xs">
//         {typeof owner === "string" ? owner : owner?.name || "N/A"}
//       </span>
//     );
//   },
// }),
columnHelper.accessor("leadOwner", {
  header: "Owner",
  cell: (info) => {
    const owner = info.getValue();

    const ownerId =
      typeof owner === "string" ? owner : owner?._id;

    const ownerName =
      typeof owner === "object" && owner?.name
        ? owner.name
        : salesReps.find(
            (rep: any) => rep.memberId?._id === ownerId
          )?.memberId?.name;

    return (
      <span className="text-xs">
        {ownerName || "N/A"}
      </span>
    );
  },
}),
      
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => (
          <span className="text-xs text-base-content/70">
            {" "}
            {new Date(info.getValue() as string).toLocaleDateString("en-GH")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div
            className="dropdown dropdown-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button tabIndex={0} className="btn btn-ghost btn-xs btn-square">
              <MdMoreVert size={18} />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-200"
            >
              <li>
                <a onClick={() => setSelectedLead(row.original)}>
                  <MdPerson size={16} /> View Details
                </a>
              </li>
              <li>
                <a
  onClick={() => {
    setSelectedLead(row.original);
    setEditData(row.original);
    setIsEditing(true);
     startEditingLead(row.original);
  }}
>
  <MdEdit size={16} /> Edit Lead
</a>
              </li>
              <div className="divider my-1"></div>
              <li>
                <a
                  className="text-error hover:bg-error/10"
                  onClick={() => {
                    setSelectedLead(row.original);
                    setDeleteModalOpen(true);
                  }}
                >
                  <MdDelete size={16} /> Delete
                </a>
              </li>
            </ul>
          </div>
        ),
      }),
    ],
    [navigate],
  );

  const filteredLeads = useMemo(() => {
  const searchValue = search.toLowerCase();

  return leads.filter((lead) => {
    // Search filter
    const matchesSearch =
      lead.firstName?.toLowerCase().includes(searchValue) ||
      lead.lastName?.toLowerCase().includes(searchValue) ||
      lead.companyName?.toLowerCase().includes(searchValue) ||
      lead.email?.toLowerCase().includes(searchValue);

    // Status filter
    const matchesStatus =
      statusFilter === "All" || lead.leadStatus === statusFilter;

    // Source filter
    const matchesSource =
      sourceFilter === "All" || lead.leadSource === sourceFilter;

    // Owner filter
    const ownerId =
      typeof lead.leadOwner === "string"
        ? lead.leadOwner
        : lead.leadOwner?._id;

    const matchesOwner =
      ownerFilter === "All" || ownerId === ownerFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesOwner
    );
  });
}, [leads, search, statusFilter, sourceFilter, ownerFilter]);

  const table = useReactTable({
    data: filteredLeads,
    columns,
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });



  // ─────────────────────────────────────────────
  // Export CSV
  // ─────────────────────────────────────────────
  const handleExport = () => {
    console.log("Exporting Leads CSV...");

    // Add your actual CSV export logic here.
  };
  const handleImport = () => {
    console.log("Importing Leads CSV...");

    // Add your actual CSV export logic here.
  };


  const handleRefresh = () => {
    window.location.reload();
  };



  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans flex flex-col h-full overflow-hidden relative">
      {/* ── Header ── */}
    

      <PageHeader
      title="All Leads"
      breadcrumbs={[
        { label: "Dashboard" },
        { label: "Sales" },
        { label: "Leads", active: true },
      ]}
      showExport
      showImport
      onImport={handleImport}
      onExport={handleExport}
      showRefresh
      onRefresh={handleRefresh}
      actions={[
        {
          label: "Add Leadas",
          icon: <MdAdd size={16} />,
          variant: "primary",
          onClick: () => navigate("/sales/leads/new"),
        },
      ]}
    />


    <StatsGrid 
    stats={[
          {
            label: "Total Leads",
            value: stats.total,
            color: "text-base-content",
          },
          { label: "New Leads", value: stats.new, color: "text-info" },
          {
            label: "Qualified",
            value: stats.qualified,
            color: "text-secondary",
          },
          {
            label: "Pipeline Value",
            value: `₹${stats.totalValue.toLocaleString()}`,
            color: "text-success",
          },
        ]}
    />
      

      

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-base-100 p-3 rounded-xl border border-base-300 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
              size={18}
            />
            <input
              type="text"
              placeholder="Search leads by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-sm input-bordered w-full pl-9 focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-sm ${showFilters ? "btn-primary" : "btn-outline bg-base-100"} gap-2`}
          >
            <MdFilterList size={16} /> Filters
          </button>
        </div>
      </div>

      {/* ── Filters Panel ── */}
      {showFilters && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 shadow-sm animate-fade-in-down">
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">
              Lead Status
            </label>
                        <select
                  className="select select-sm select-bordered w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
          </div>
          <div>
            <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">
              Lead Source
            </label>
           <select
                    className="select select-sm select-bordered w-full"
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Trade Show">Trade Show</option>
                  </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-base-content/70 mb-1 block uppercase">
                                Lead Owner
                              </label>
                            {/* <select
                    className="select select-sm select-bordered w-full"
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                  >
                    <option value="All">All</option>

                    {Array.from(
                      new Map(
                        leads
                          .filter(
                            (lead) =>
                              typeof lead.leadOwner !== "string" && lead.leadOwner?._id
                          )
                          .map((lead) => [
                            lead.leadOwner._id,
                            lead.leadOwner.name,
                          ])
                      ).entries()
                    ).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                           </select> */}
                          <select
  className="select select-sm select-bordered w-full"
  value={ownerFilter}
  onChange={(e) => setOwnerFilter(e.target.value)}
>
  <option value="All">All</option>

  {salesReps.map((rep: any) => (
    <option key={rep.memberId?._id} value={rep.memberId?._id || ""}>
      {rep.memberId?.name || "Unknown"}
    </option>
  ))}
</select>
                            </div>
                            <div className="flex items-end gap-2">
                            
                            <button
                    className="btn btn-sm flex-1 "
                    onClick={() => {
                      setStatusFilter("All");
                      setSourceFilter("All");
                      setOwnerFilter("All");
                      setSearch("");
                    }}
                  >
                    Reset
                  </button>
                            </div>
                          </div>
                        )}

                {/* ── Bulk Actions ── */}
                {Object.keys(rowSelection).length > 0 && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm animate-fade-in-up">
                    <span className="text-xs font-semibold text-primary">
                      {Object.keys(rowSelection).length} lead(s) selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-xs btn-error text-white flex items-center gap-1"
                        onClick={() => setBulkDeleteModalOpen(true)}
                      >
                        <MdDelete size={14} /> Delete Selected
                      </button>
                    </div>
                  </div>
                )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm flex flex-col relative">
        <div className="flex-1 overflow-auto">
          <table className="table table-pin-rows w-full text-xs">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-base-100 text-base-content/70"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="font-semibold py-3 cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{ asc: " 🔼", desc: " 🔽" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-base-200/50 transition-colors cursor-pointer border-b border-base-200"
                  onClick={() => setSelectedLead(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <MdPerson size={48} className="text-base-content/20" />
                      <p className="text-base-content/50 font-medium">
                        No leads found matching your criteria.
                      </p>
                      <button
                        onClick={() => navigate("/sales/leads/new")}
                        className="btn btn-outline btn-sm mt-2"
                      >
                        Create New Lead
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="border-t border-base-300 p-3 bg-base-100 flex items-center justify-between text-xs">
          <span className="text-base-content/60 font-medium">
            Showing {table.getRowModel().rows.length} of {filteredLeads.length}{" "}
            leads
          </span>
          <div className="flex items-center gap-3">
            <select
              className="select select-sm select-bordered bg-base-200"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <div className="join">
              <button
                className="join-item btn btn-sm bg-base-200"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                «
              </button>
              <button className="join-item btn btn-sm bg-base-200">
                Page {table.getState().pagination.pageIndex + 1}
              </button>
              <button
                className="join-item btn btn-sm bg-base-200"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead Details Drawer ── */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity ${selectedLead ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSelectedLead(null)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full md:w-[600px] bg-base-100 shadow-2xl transition-transform duration-300 transform ${selectedLead ? "translate-x-0" : "translate-x-full"} flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-base-300 bg-base-200/50 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-14 h-14 text-xl font-bold shadow-sm">
                    <span className="flex items-center justify-center p-3.5">
                      {selectedLead?.firstName[0]}
                      {selectedLead?.lastName[0]}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content leading-tight">
                    {selectedLead?.firstName} {selectedLead?.lastName}
                  </h2>
                  <p className="text-xs font-medium text-base-content/60 mt-0.5">
                    {selectedLead?.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="btn btn-ghost btn-circle btn-sm bg-base-200"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="flex gap-2 justify-end">
              {/* <button className="btn btn-primary btn-sm flex-1">
                <MdPhone /> Call
              </button>
              <button className="btn btn-outline btn-sm flex-1 bg-base-100">
                <MdEmail /> Email
              </button> */}
              {/* <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-outline btn-sm btn-square bg-base-100"
                >
                  <MdMoreVert size={18} />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-40 mt-1 border border-base-200"
                >
                 <li>
  <a
    onClick={(e) => {
      (e.currentTarget as HTMLElement).blur();
      startEditingLead(selectedLead!);
    }}
  >
    Edit Lead
  </a>
</li>
                  <li>
                <a onClick={() => handleConvertToCustomer(selectedLead)}>
                  Convert to Customer
                </a>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <a
                      className="text-error"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete Lead
                    </a>
                  </li>
                </ul>
              </div> */}
              <div className={`dropdown dropdown-end ${isLeadMenuOpen ? "dropdown-open" : ""}`}>
  <button
    type="button"
    className="btn btn-outline btn-sm btn-square bg-base-100"
    onClick={() => setIsLeadMenuOpen((prev) => !prev)}
  >
    <MdMoreVert size={18} />
  </button>

  <ul className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-40 mt-1 border border-base-200">
    <li>
      <a
        onClick={() => {
          setIsLeadMenuOpen(false);
          if (selectedLead) startEditingLead(selectedLead);
        }}
      >
        Edit Lead
      </a>
    </li>

    <li>
      <a
        onClick={() => {
          setIsLeadMenuOpen(false);
          handleConvertToCustomer(selectedLead);
        }}
      >
        Convert to Customer
      </a>
    </li>

    <div className="divider my-1"></div>

    <li>
      <a
        className="text-error"
        onClick={() => {
          setIsLeadMenuOpen(false);
          setDeleteModalOpen(true);
        }}
      >
        Delete Lead
      </a>
    </li>
  </ul>
</div>
            </div>

            {/* Drawer Tabs */}
            <div className="tabs tabs-bordered w-full border-b border-base-300 mt-2">
              <a
                className={`tab font-medium ${activeTab === "overview" ? "tab-active text-primary" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </a>
              <a
                className={`tab font-medium ${activeTab === "timeline" ? "tab-active text-primary" : ""}`}
                onClick={() => setActiveTab("timeline")}
              >
                Timeline
              </a>
              {/* <a
                className={`tab font-medium ${activeTab === "notes" ? "tab-active text-primary" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                Notes
              </a> */}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-base-100">
          {activeTab === "overview" && (
  <div className="space-y-6 animate-fade-in">

    {/* LEAD DETAILS */}
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4">
        Lead Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Lead Owner */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Lead Owner</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={
                typeof editData.leadOwner === "string"
                  ? editData.leadOwner
                  : editData.leadOwner?._id || ""
              }
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  leadOwner: e.target.value,
                }))
              }
            >
              <option value="">Select Lead Owner</option>
              {salesReps.map((rep: any) => (
                <option key={rep.memberId?._id} value={rep.memberId?._id || ""}>
                  {rep.memberId?.name || "Unknown"}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">
              {typeof selectedLead?.leadOwner === "object"
                ? selectedLead.leadOwner?.name
                : salesReps.find(
                    (rep: any) =>
                      rep.memberId?._id === selectedLead?.leadOwner
                  )?.memberId?.name || "N/A"}
            </p>
          )}
        </div>

        {/* Lead Source */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Lead Source</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.leadSource || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  leadSource: e.target.value,
                  customLeadSource: "",
                }))
              }
            >
              {LEAD_SOURCES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">
              {selectedLead?.leadSource === "Other"
                ? selectedLead?.customLeadSource || "Other"
                : selectedLead?.leadSource || "N/A"}
            </p>
          )}
        </div>

        {isEditing && editData.leadSource === "Other" && (
          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Custom Lead Source
            </label>
            <input
              className="input input-bordered input-sm w-full"
              value={editData.customLeadSource || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  customLeadSource: e.target.value,
                }))
              }
              placeholder="Enter lead source"
            />
          </div>
        )}

        {/* Industry */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Industry</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.industry || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  industry: e.target.value,
                  customIndustry: "",
                }))
              }
            >
              {INDUSTRIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">
              {selectedLead?.industry === "Other"
                ? selectedLead?.customIndustry || "Other"
                : selectedLead?.industry || "N/A"}
            </p>
          )}
        </div>

        {isEditing && editData.industry === "Other" && (
          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Custom Industry
            </label>
            <input
              className="input input-bordered input-sm w-full"
              value={editData.customIndustry || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  customIndustry: e.target.value,
                }))
              }
              placeholder="Enter industry"
            />
          </div>
        )}

        {/* Status */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Lead Status</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.leadStatus || "New"}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  leadStatus: e.target.value as Lead["leadStatus"],
                }))
              }
            >
              {LEAD_STATUSES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">{selectedLead?.leadStatus || "N/A"}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Priority</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.priority || "Medium"}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  priority: e.target.value as Lead["priority"],
                }))
              }
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">{selectedLead?.priority || "N/A"}</p>
          )}
        </div>
      </div>
    </section>

    <div className="divider my-0" />

    {/* PERSONAL / CONTACT INFORMATION */}
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* First Name */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">First Name</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.firstName || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, firstName: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.firstName || "N/A"}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Last Name</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.lastName || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.lastName || "N/A"}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Email</label>
          {isEditing ? (
            <input
              type="email"
              className="input input-bordered input-sm w-full"
              value={editData.email || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium break-all">{selectedLead?.email || "N/A"}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Gender</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.gender || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-sm font-medium">{selectedLead?.gender || "N/A"}</p>
          )}
        </div>

        {/* Country Code */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Country Code</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.countryCode || "+91"}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  countryCode: e.target.value,
                  customCountryCode: "",
                }))
              }
            >
              {PHONE_CODES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">
              {selectedLead?.countryCode || "N/A"}
            </p>
          )}
        </div>

        {isEditing && editData.countryCode === "Other" && (
          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Custom Country Code
            </label>
            <input
              className="input input-bordered input-sm w-full"
              value={editData.customCountryCode || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  customCountryCode: e.target.value,
                }))
              }
              placeholder="Enter country code"
            />
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              maxLength={15}
              inputMode="numeric"
              className="input input-bordered input-sm w-full"
              value={editData.phoneNumber || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value.replace(/[^0-9]/g, ""),
                }))
              }
            />
          ) : (
            <p className="text-sm font-medium">
              {selectedLead?.phoneNumber || "N/A"}
            </p>
          )}
        </div>
      </div>
    </section>

    <div className="divider my-0" />

    {/* COMPANY INFORMATION */}
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4">
        Company Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Company */}
        <div className="sm:col-span-2">
          <label className="text-xs text-base-content/50 mb-1 block">Company Name</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.companyName || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, companyName: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.companyName || "N/A"}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="sm:col-span-2">
          <label className="text-xs text-base-content/50 mb-1 block">Address Line 1</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.addressLine1 || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, addressLine1: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.addressLine1 || "N/A"}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="sm:col-span-2">
          <label className="text-xs text-base-content/50 mb-1 block">Address Line 2</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.addressLine2 || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, addressLine2: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.addressLine2 || "N/A"}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">City</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.city || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, city: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.city || "N/A"}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">State</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.state || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, state: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.state || "N/A"}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Postal Code</label>
          {isEditing ? (
            <input
              className="input input-bordered input-sm w-full"
              value={editData.postalCode || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, postalCode: e.target.value }))}
            />
          ) : (
            <p className="text-sm font-medium">{selectedLead?.postalCode || "N/A"}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="text-xs text-base-content/50 mb-1 block">Country</label>
          {isEditing ? (
            <select
              className="select select-bordered select-sm w-full"
              value={editData.country || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  country: e.target.value,
                  customCountry: "",
                }))
              }
            >
              <option value="">Select Country</option>
              {COUNTRIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm font-medium">
              {selectedLead?.country === "Other"
                ? selectedLead?.customCountry || "Other"
                : selectedLead?.country || "N/A"}
            </p>
          )}
        </div>

        {isEditing && editData.country === "Other" && (
          <div>
            <label className="text-xs text-base-content/50 mb-1 block">
              Custom Country
            </label>
            <input
              className="input input-bordered input-sm w-full"
              value={editData.customCountry || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  customCountry: e.target.value,
                }))
              }
              placeholder="Enter country"
            />
          </div>
        )}
      </div>
    </section>

    <div className="divider my-0" />

    {/* DESCRIPTION */}
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
        Additional Notes / Description
      </h3>

      {isEditing ? (
        <textarea
          className="textarea textarea-bordered w-full min-h-28 text-sm"
          value={editData.description || ""}
          onChange={(e) =>
            setEditData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Enter lead description..."
        />
      ) : (
        <p className="text-sm whitespace-pre-wrap bg-base-200/50 p-4 rounded-lg">
          {selectedLead?.description || "No description added."}
        </p>
      )}
    </section>

    {/* CREATED DATE */}
    <section className="bg-base-200/50 p-4 rounded-xl border border-base-200">
      <p className="text-xs text-base-content/50 mb-1">Created Date</p>
      <p className="text-sm font-medium">
        {selectedLead?.createdAt
          ? new Date(selectedLead.createdAt).toLocaleDateString("en-IN")
          : "N/A"}
      </p>
    </section>
  </div>
)}

            {activeTab === "timeline" && (
              <div className="animate-fade-in">
                <ul className="timeline timeline-vertical timeline-compact">
                  <li>
                    <hr className="bg-primary" />
                    <div className="timeline-middle text-primary">
                      <MdTimeline />
                    </div>
                    <div className="timeline-end timeline-box border-none shadow-none bg-transparent py-2">
                      <div className="text-xs text-base-content/50">
                        {selectedLead?.lastContacted}
                      </div>
                      <div className="text-xs font-medium">
                        Status changed to {selectedLead?.leadStatus}
                      </div>
                    </div>
                    <hr className="bg-base-300" />
                  </li>
                  <li>
                    <hr className="bg-base-300" />
                    <div className="timeline-middle text-base-300">
                      <MdTimeline />
                    </div>
                    <div className="timeline-end timeline-box border-none shadow-none bg-transparent py-2">
                      <div className="text-xs text-base-content/50">
                        {selectedLead?.createdAt &&
                          new Date(selectedLead?.createdAt).toLocaleDateString(
                            "en-GH",
                          )}
                      </div>
                      <div className="text-xs font-medium">
                        Lead Created by System
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* {activeTab === "notes" && (
              <div className="animate-fade-in flex flex-col h-full">
                <textarea
                  className="textarea textarea-bordered w-full flex-1 min-h-[200px]"
                  placeholder="Add a note about this lead..."
                ></textarea>
                <button className="btn btn-primary mt-4 self-end gap-2">
                  <MdNotes /> Save Note
                </button>
              </div>
            )} */}
              {isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setIsEditing(false);
                setEditData(selectedLead || {});
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleUpdateLead}
            >
              Save Changes
            </button>
          </div>
        )}
          </div>
        </div>
      
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <dialog className={`modal ${deleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Delete Lead</h3>
          <p className="py-4 text-base-content/80">
            Are you sure you want to delete{" "}
            <strong>
              {selectedLead?.firstName} {selectedLead?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="modal-action mt-6">
            <button
              className="btn btn-ghost"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-error text-white"
              onClick={async () => {
                if (!selectedLead?._id) return;

                await handleDelete(selectedLead._id);

                setDeleteModalOpen(false);
                setSelectedLead(null);
              }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </dialog>

      {/* ── Bulk Delete Confirmation Modal ── */}
      <dialog className={`modal ${bulkDeleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-sm p-5">
          <h3 className="font-bold text-base text-error flex items-center gap-2">
            <MdDelete size={20} /> Delete Selected Leads
          </h3>
          <p className="py-4 text-base-content/80 text-xs">
            Are you sure you want to delete{" "}
            <strong>{Object.keys(rowSelection).length}</strong> selected lead(s)?
            This action cannot be undone.
          </p>
          <div className="modal-action mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-xs"
              onClick={() => setBulkDeleteModalOpen(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error btn-sm text-xs text-white flex items-center gap-1"
              disabled={isBulkDeleting}
              onClick={handleBulkDelete}
            >
              {isBulkDeleting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Deleting...
                </>
              ) : (
                "Yes, Delete Selected"
              )}
            </button>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => !isBulkDeleting && setBulkDeleteModalOpen(false)}
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
