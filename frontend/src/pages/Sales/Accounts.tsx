import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdMoreVert, MdUnfoldMore } from "react-icons/md";

/* ─────────────────────────── types ─────────────────────────── */
export interface AccountDetail {
  id: string;
  accountOwner: string;
  lead: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  contactAddress: string;
}

type SortKey = keyof Omit<AccountDetail, "id">;
type SortDir = "asc" | "desc" | null;

interface AllAccountDetailsProps {
  accounts?: AccountDetail[];
  onAddAccount?: () => void;
  onRowClick?: (account: AccountDetail) => void;
}

/* ─────────────────────────── sample data ───────────────────── */
const SAMPLE: AccountDetail[] = [
  {
    id: "1",
    accountOwner: "V VINAY Kumar",
    lead: "Zager Digital services",
    accountName: "Zager Digital services",
    contactName: "V VINAY Kumar",
    contactEmail: "vvinaykumar3000@gmail.com",
    contactNumber: "+918319145613",
    contactAddress:
      "A15 shivam complex koni bilaspur, ZZZZ, XXXXXX, CHATTISGARH, 495001, India",
  },
];

/* ─────────────────────────── column config ─────────────────── */
const COLUMNS: { key: SortKey; label: string; minW: string }[] = [
  { key: "accountOwner",   label: "Account Owner",   minW: "160px" },
  { key: "lead",           label: "Lead",            minW: "160px" },
  { key: "accountName",    label: "Account Name",    minW: "170px" },
  { key: "contactName",    label: "Contact Name",    minW: "150px" },
  { key: "contactEmail",   label: "Contact Email",   minW: "220px" },
  { key: "contactNumber",  label: "Contact Number",  minW: "150px" },
  { key: "contactAddress", label: "Contact Address", minW: "300px" },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllAccountDetails({
  accounts: propAccounts,
  onAddAccount,
  onRowClick,
}: AllAccountDetailsProps) {
  const navigate = useNavigate();

  const [accounts] = useState<AccountDetail[]>(propAccounts ?? SAMPLE);
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]       = useState<SortKey | null>(null);
  const [sortDir, setSortDir]       = useState<SortDir>(null);

  /* ── sort ── */
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir(null);
  };

  /* ── filtered + sorted rows ── */
  const rows = useMemo(() => {
    let r = accounts.filter((a) =>
      [a.accountOwner, a.lead, a.accountName, a.contactName, a.contactEmail, a.contactNumber, a.contactAddress]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    if (sortKey && sortDir) {
      r = [...r].sort((a, b) => {
        const av = (a[sortKey] ?? "").toLowerCase();
        const bv = (b[sortKey] ?? "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return r;
  }, [accounts, search, sortKey, sortDir]);

  /* ── select helpers ── */
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll  = () =>
    allChecked ? setSelected(new Set()) : setSelected(new Set(rows.map((r) => r.id)));
  const toggleOne  = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ── sort icon ── */
  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-0.5 transition-opacity ${sortKey === col ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>
      {sortKey === col && sortDir === "asc"
        ? "↑"
        : sortKey === col && sortDir === "desc"
        ? "↓"
        : <MdUnfoldMore size={14} className="inline" />}
    </span>
  );

  /* ── render ── */
  return (
    <div className="flex flex-col h-full bg-base-100">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-base-300 sticky top-0 bg-base-100 z-10">
        <h1 className="text-lg font-semibold text-base-content">All Account Details</h1>

        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setShowSearch(false); }}
              placeholder="Search accounts…"
              className="border border-base-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-success w-52 bg-base-100 transition-colors"
            />
          )}
          <button onClick={() => setShowSearch((v) => !v)} className="btn btn-ghost btn-sm btn-square">
            <MdSearch size={18} />
          </button>
          <button
            onClick={() => onAddAccount ? onAddAccount() : navigate("/sales/accounts/new")}
            className="btn btn-success btn-sm btn-square text-white"
          >
            <MdAdd size={18} />
          </button>
          <button className="btn btn-ghost btn-sm btn-square">
            <MdMoreVert size={18} />
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse" style={{ minWidth: "1200px" }}>
          <thead>
            <tr className="border-b border-base-300 bg-base-100 sticky top-0 z-10">
              {/* checkbox */}
              <th className="w-10 px-3 py-2.5">
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
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2.5 text-left font-medium text-base-content/70 cursor-pointer select-none group whitespace-nowrap"
                >
                  <span className="flex items-center gap-0.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="text-center py-16 text-base-content/40 text-sm">
                  No accounts found.
                </td>
              </tr>
            ) : (
              rows.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => onRowClick ? onRowClick(account) : navigate(`/sales/accounts/${account.id}`)}
                  className="border-b border-base-200 hover:bg-base-200/50 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(account.id)}
                      onChange={() => toggleOne(account.id)}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                  </td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{account.accountOwner}</td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{account.lead}</td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{account.accountName}</td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{account.contactName}</td>
                  <td className="px-3 py-3">
                    <a
                      href={`mailto:${account.contactEmail}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-success hover:underline whitespace-nowrap"
                    >
                      {account.contactEmail}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">{account.contactNumber}</td>
                  <td className="px-3 py-3 text-base-content">{account.contactAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div className="px-5 py-2.5 border-t border-base-300 text-xs text-base-content/50 bg-base-100">
        Showing {rows.length} of {accounts.length}
      </div>
    </div>
  );
}