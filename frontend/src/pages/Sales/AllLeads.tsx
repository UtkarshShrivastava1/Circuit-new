import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdMoreVert, MdUnfoldMore } from "react-icons/md";

/* ─────────────────────────── types ─────────────────────────── */
export interface Lead {
  id: string;
  leadOwner: string;
  companyName: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  gender: "Male" | "Female" | string;
  description: string;
  isFollowing?: boolean;
}

type SortKey = keyof Omit<Lead, "id" | "isFollowing">;
type SortDir = "asc" | "desc" | null;

interface AllLeadsProps {
  leads?: Lead[];
  onAddLead?: () => void;
  onFollowToggle?: (id: string, following: boolean) => void;
  onRowClick?: (lead: Lead) => void;
}

/* ─────────────────────────── sample data ───────────────────── */
const SAMPLE: Lead[] = [
  {
    id: "1",
    leadOwner: "V VINAY Kumar",
    companyName: "Zager Digital services",
    name: "V VINAY Kumar",
    email: "vvinaykumar3000@gmail.com",
    address:
      "A15 shivam complex koni bilaspur, zone-3 bhiali, CHATTISGARH, 495001, India",
    phoneNumber: "+918319145613",
    gender: "Male",
    description: "asdfdsaf",
    isFollowing: false,
  },
];

/* ─────────────────────────── column config ─────────────────── */
const COLUMNS: { key: SortKey; label: string; minW: string }[] = [
  { key: "leadOwner",   label: "Lead Owner",   minW: "150px" },
  { key: "companyName", label: "Company Name", minW: "160px" },
  { key: "name",        label: "Name",         minW: "150px" },
  { key: "email",       label: "Email",        minW: "200px" },
  { key: "address",     label: "Address",      minW: "280px" },
  { key: "phoneNumber", label: "Phone Number", minW: "150px" },
  { key: "gender",      label: "Gender",       minW: "90px"  },
  { key: "description", label: "Description",  minW: "160px" },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllLeads({
  leads: propLeads,
  onAddLead,
  onFollowToggle,
  onRowClick,
}: AllLeadsProps) {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>(propLeads ?? SAMPLE);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  /* ── sort handler ── */
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir(null);
  };

  /* ── filtered + sorted rows ── */
  const rows = useMemo(() => {
    let r = leads.filter((l) =>
      [l.leadOwner, l.companyName, l.name, l.email, l.address, l.phoneNumber]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    if (sortKey && sortDir) {
      r = [...r].sort((a, b) => {
        const av = (a[sortKey] ?? "").toString().toLowerCase();
        const bv = (b[sortKey] ?? "").toString().toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return r;
  }, [leads, search, sortKey, sortDir]);

  /* ── select helpers ── */
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ── follow toggle ── */
  const handleFollow = (id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isFollowing: !l.isFollowing } : l
      )
    );
    const lead = leads.find((l) => l.id === id);
    if (lead) onFollowToggle?.(id, !lead.isFollowing);
  };

  /* ── sort icon ── */
  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-0.5 transition-opacity ${sortKey === col ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>
      {sortKey === col && sortDir === "asc"  ? "↑"
       : sortKey === col && sortDir === "desc" ? "↓"
       : <MdUnfoldMore size={14} className="inline" />}
    </span>
  );

  return (
    <div className="flex flex-col h-full bg-base-100">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-base-300 sticky top-0 bg-base-100 z-10">
        <h1 className="text-lg font-semibold text-base-content">All Leads</h1>

        <div className="flex items-center gap-2">
          {/* inline search */}
          {showSearch && (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setShowSearch(false); }}
              placeholder="Search leads…"
              className="border border-base-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-success w-52 bg-base-100"
            />
          )}
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <MdSearch size={18} />
          </button>
          <button
            onClick={() => onAddLead ? onAddLead() : navigate("/sales/leads/new")}
            className="btn btn-success btn-sm btn-square text-white"
          >
            <MdAdd size={18} />
          </button>
          <button className="btn btn-ghost btn-sm btn-square">
            <MdMoreVert size={18} />
          </button>
        </div>
      </div>

      {/* ── TABLE WRAPPER (horizontally scrollable) ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "1100px" }}>
          <thead>
            <tr className="border-b border-base-300 bg-base-100 sticky top-0 z-10">
              {/* eye / checkbox col */}
              <th className="w-8 px-2 py-2.5">
                <span className="text-base-content/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </span>
              </th>
              <th className="w-8 px-2 py-2.5">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="checkbox checkbox-sm checkbox-success"
                />
              </th>

              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{ minWidth: col.minW }}
                  className="px-3 py-2.5 text-left font-medium text-base-content/70 cursor-pointer select-none group"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-0.5 whitespace-nowrap">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}

              {/* Follow Lead col */}
              <th className="px-3 py-2.5 text-left font-medium text-base-content/70 whitespace-nowrap" style={{ minWidth: "120px" }}>
                Follow Lead
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 3} className="text-center py-16 text-base-content/40 text-sm">
                  No leads found.
                </td>
              </tr>
            ) : (
              rows.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-base-200 hover:bg-base-200/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(lead)}
                >
                  {/* eye placeholder */}
                  <td className="px-2 py-3" />

                  {/* checkbox */}
                  <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleOne(lead.id)}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                  </td>

                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{lead.leadOwner}</td>
                  <td className="px-3 py-3 text-base-content">{lead.companyName}</td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{lead.name}</td>
                  <td className="px-3 py-3">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-success hover:underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-base-content max-w-xs">{lead.address}</td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{lead.phoneNumber}</td>
                  <td className="px-3 py-3 text-base-content">{lead.gender}</td>
                  <td className="px-3 py-3 text-base-content max-w-[160px] truncate">{lead.description}</td>

                  {/* Follow Lead button */}
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleFollow(lead.id)}
                      className={`btn btn-xs normal-case px-3 border transition-all ${
                        lead.isFollowing
                          ? "btn-success text-white border-success"
                          : "btn-outline border-base-300 text-base-content hover:border-success hover:text-success"
                      }`}
                    >
                      {lead.isFollowing ? "Following" : "Follow Lead"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div className="px-5 py-2.5 border-t border-base-300 text-xs text-base-content/50 bg-base-100">
        Showing {rows.length} of {leads.length}
      </div>
    </div>
  );
}

/* ─────────────────────────── usage example ─────────────────────

import AllLeads from "./AllLeads";
import { useNavigate } from "react-router-dom";

export default function AllLeadsPage() {
  const navigate = useNavigate();
  const { data: leads, isLoading } = useLeads(); // your hook/query

  return (
    <AllLeads
      leads={leads ?? []}
      onAddLead={() => navigate("/sales/leads/new")}
      onRowClick={(lead) => navigate(`/sales/leads/${lead.id}`)}
      onFollowToggle={(id, following) => api.patch(`/sales/leads/${id}`, { isFollowing: following })}
    />
  );
}

──────────────────────────────────────────────────────────────── */