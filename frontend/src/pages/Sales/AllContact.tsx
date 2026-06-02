import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdMoreVert, MdUnfoldMore } from "react-icons/md";

/* ─────────────────────────── types ─────────────────────────── */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  description: string;
  lead?: string; // linked lead name/id if any
}

type SortKey = keyof Omit<Contact, "id">;
type SortDir = "asc" | "desc" | null;

interface AllContactsProps {
  contacts?: Contact[];
  onAddContact?: () => void;
  onRowClick?: (contact: Contact) => void;
}

/* ─────────────────────────── sample data ───────────────────── */
const SAMPLE: Contact[] = [
  {
    id: "1",
    name: "V Kumar",
    email: "vvinaykumar3000@gmail.com",
    phoneNumber: "+918319145613",
    address:
      "A15 shivam complex koni bilaspur, zone-3 bhiali, Chhattisgarh, 495001, India",
    description: "make U more wiser",
    lead: "",
  },
];

/* ─────────────────────────── column config ─────────────────── */
const COLUMNS: { key: SortKey; label: string; minW: string }[] = [
  { key: "name",        label: "Name",         minW: "140px" },
  { key: "email",       label: "Email",        minW: "220px" },
  { key: "phoneNumber", label: "Phone Number", minW: "160px" },
  { key: "address",     label: "Address",      minW: "340px" },
  { key: "description", label: "Description",  minW: "200px" },
  { key: "lead",        label: "Lead",         minW: "140px" },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllContacts({
  contacts: propContacts,
  onAddContact,
  onRowClick,
}: AllContactsProps) {
  const navigate = useNavigate();

  const [contacts] = useState<Contact[]>(propContacts ?? SAMPLE);
  const [search, setSearch]       = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]     = useState<SortKey | null>(null);
  const [sortDir, setSortDir]     = useState<SortDir>(null);

  /* ── sort ── */
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir(null);
  };

  /* ── filtered + sorted rows ── */
  const rows = useMemo(() => {
    let r = contacts.filter((c) =>
      [c.name, c.email, c.phoneNumber, c.address, c.description, c.lead ?? ""]
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
  }, [contacts, search, sortKey, sortDir]);

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
    <span
      className={`ml-0.5 transition-opacity ${
        sortKey === col ? "opacity-100" : "opacity-40 group-hover:opacity-70"
      }`}
    >
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
        <h1 className="text-lg font-semibold text-base-content">All Contacts</h1>

        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setShowSearch(false); }}
              placeholder="Search contacts…"
              className="border border-base-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-success w-52 bg-base-100 transition-colors"
            />
          )}
          <button
            onClick={() => setShowSearch((v) => !v)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <MdSearch size={18} />
          </button>
          <button
            onClick={() =>
              onAddContact ? onAddContact() : navigate("/sales/contacts/new")
            }
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
        <table
          className="w-full text-sm border-collapse"
          style={{ minWidth: "1100px" }}
        >
          <thead>
            <tr className="border-b border-base-300 bg-base-100 sticky top-0 z-10">
              {/* eye col */}
              <th className="w-8 px-2 py-2.5 text-base-content/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </th>

              {/* checkbox col */}
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
                <td
                  colSpan={COLUMNS.length + 2}
                  className="text-center py-16 text-base-content/40 text-sm"
                >
                  No contacts found.
                </td>
              </tr>
            ) : (
              rows.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => onRowClick?.(contact)}
                  className="border-b border-base-200 hover:bg-base-200/50 transition-colors cursor-pointer"
                >
                  {/* eye placeholder */}
                  <td className="px-2 py-3" />

                  {/* checkbox */}
                  <td
                    className="px-2 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(contact.id)}
                      onChange={() => toggleOne(contact.id)}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3 text-base-content whitespace-nowrap font-medium">
                    {contact.name}
                  </td>

                  {/* Email */}
                  <td className="px-3 py-3">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-success hover:underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">
                    {contact.phoneNumber}
                  </td>

                  {/* Address */}
                  <td className="px-3 py-3 text-base-content">
                    {contact.address}
                  </td>

                  {/* Description */}
                  <td className="px-3 py-3 text-base-content max-w-[200px] truncate">
                    {contact.description}
                  </td>

                  {/* Lead */}
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">
                    {contact.lead || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div className="px-5 py-2.5 border-t border-base-300 text-xs text-base-content/50 bg-base-100">
        Showing {rows.length} of {contacts.length}
      </div>
    </div>
  );
}

/* ─────────────────────────── usage example ─────────────────────

import AllContacts from "./AllContacts";
import { useNavigate } from "react-router-dom";

export default function AllContactsPage() {
  const navigate = useNavigate();
  const { data: contacts } = useContacts(); // your hook/query

  return (
    <AllContacts
      contacts={contacts ?? []}
      onAddContact={() => navigate("/sales/contacts/new")}
      onRowClick={(c) => navigate(`/sales/contacts/${c.id}`)}
    />
  );
}

──────────────────────────────────────────────────────────────── */