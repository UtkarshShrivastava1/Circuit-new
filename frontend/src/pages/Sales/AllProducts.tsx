import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdMoreVert, MdUnfoldMore } from "react-icons/md";

/* ─────────────────────────── types ─────────────────────────── */
export interface Product {
  id: string;
  productGroup: string;
  productName: string;
  productCode: string;
  unitPrice: number;
  description?: string;
}

type SortKey = keyof Omit<Product, "id">;
type SortDir = "asc" | "desc" | null;

interface AllProductsProps {
  products?: Product[];
  onAddProduct?: () => void;
  onRowClick?: (product: Product) => void;
}

/* ─────────────────────────── sample data ───────────────────── */
const SAMPLE: Product[] = [
  {
    id: "1",
    productGroup: "Electronics",
    productName: "Wireless Headphones Pro",
    productCode: "WHP-2024-001",
    unitPrice: 4999.99,
    description: "Premium noise-cancelling wireless headphones.",
  },
  {
    id: "2",
    productGroup: "Software",
    productName: "ERP Suite License",
    productCode: "ERP-LIC-2024",
    unitPrice: 24999.0,
    description: "Annual enterprise software license.",
  },
  {
    id: "3",
    productGroup: "Accessories",
    productName: "USB-C Hub 7-in-1",
    productCode: "USB-HUB-001",
    unitPrice: 1299.0,
    description: "Multi-port USB-C hub with HDMI and SD card.",
  },
];

/* ─────────────────────────── column config ─────────────────── */
const COLUMNS: { key: SortKey; label: string; minW: string }[] = [
  { key: "productName",  label: "Product Name",  minW: "180px" },
  { key: "productGroup", label: "Product Group", minW: "150px" },
  { key: "productCode",  label: "Product Code",  minW: "150px" },
  { key: "unitPrice",    label: "Unit Price",    minW: "130px" },
  { key: "description",  label: "Description",   minW: "240px" },
];

/* ─────────────────────────── component ─────────────────────── */
export default function AllProducts({
  products: propProducts,
  onAddProduct,
  onRowClick,
}: AllProductsProps) {
  const navigate = useNavigate();

  const [products] = useState<Product[]>(propProducts ?? SAMPLE);
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [sortKey, setSortKey]       = useState<SortKey | null>(null);
  const [sortDir, setSortDir]       = useState<SortDir>(null);

  /* ── sort handler ── */
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); return; }
    if (sortDir === "asc") { setSortDir("desc"); return; }
    setSortKey(null); setSortDir(null);
  };

  /* ── filtered + sorted rows ── */
  const rows = useMemo(() => {
    let r = products.filter((p) =>
      [p.productName, p.productGroup, p.productCode, p.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    if (sortKey && sortDir) {
      r = [...r].sort((a, b) => {
        const av =
          sortKey === "unitPrice"
            ? a.unitPrice
            : (a[sortKey] ?? "").toString().toLowerCase();
        const bv =
          sortKey === "unitPrice"
            ? b.unitPrice
            : (b[sortKey] ?? "").toString().toLowerCase();
        if (typeof av === "number" && typeof bv === "number")
          return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc"
          ? av.toString().localeCompare(bv.toString())
          : bv.toString().localeCompare(av.toString());
      });
    }
    return r;
  }, [products, search, sortKey, sortDir]);

  /* ── select helpers ── */
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll  = () =>
    allChecked
      ? setSelected(new Set())
      : setSelected(new Set(rows.map((r) => r.id)));
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
        <h1 className="text-lg font-semibold text-base-content">All Products</h1>

        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setShowSearch(false); }}
              placeholder="Search products…"
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
              onAddProduct ? onAddProduct() : navigate("/sales/products/new")
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
          style={{ minWidth: "900px" }}
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
                  No products found.
                </td>
              </tr>
            ) : (
              rows.map((product) => (
                <tr
                  key={product.id}
                  onClick={() =>
                    onRowClick
                      ? onRowClick(product)
                      : navigate(`/sales/products/${product.id}`)
                  }
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
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="checkbox checkbox-sm checkbox-success"
                    />
                  </td>

                  {/* Product Name */}
                  <td className="px-3 py-3 text-base-content font-medium whitespace-nowrap">
                    {product.productName}
                  </td>

                  {/* Product Group */}
                  <td className="px-3 py-3 text-base-content whitespace-nowrap">
                    {product.productGroup}
                  </td>

                  {/* Product Code */}
                  <td className="px-3 py-3 text-base-content whitespace-nowrap font-mono text-xs">
                    {product.productCode}
                  </td>

                  {/* Unit Price */}
                  <td className="px-3 py-3 text-success font-medium whitespace-nowrap">
                    ₹{" "}
                    {product.unitPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Description */}
                  <td className="px-3 py-3 text-base-content max-w-[240px] truncate">
                    {product.description || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div className="px-5 py-2.5 border-t border-base-300 text-xs text-base-content/50 bg-base-100">
        Showing {rows.length} of {products.length}
      </div>
    </div>
  );
}

/* ─────────────────────────── usage example ─────────────────────

import AllProducts from "./AllProducts";
import { useNavigate } from "react-router-dom";

export default function AllProductsPage() {
  const navigate = useNavigate();
  const { data: products } = useProducts(); // your hook/query

  return (
    <AllProducts
      products={products ?? []}
      onAddProduct={() => navigate("/sales/products/new")}
      onRowClick={(p) => navigate(`/sales/products/${p.id}`)}
    />
  );
}

──────────────────────────────────────────────────────────────── */