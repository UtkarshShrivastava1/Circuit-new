import { useState } from "react";

type User = {
  id: string;
  name: string;
};

interface Props {
  users: User[];
  value?: User;
  onChange: (user: User) => void;
}

export default function AssigneeSelect({
  users,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        className="input input-bordered w-full text-left flex items-center gap-2"
        onClick={() => setOpen(!open)}
        type="button"
      >
        👤 {value ? value.name : "Assign to"}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow">
          <input
            autoFocus
            className="input input-sm w-full border-b rounded-none"
            placeholder="Search user…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ul className="max-h-48 overflow-auto">
            {filtered.map((user) => (
              <li
                key={user.id}
                onClick={() => {
                  onChange(user);
                  setOpen(false);
                  setQuery("");
                }}
                className="px-3 py-2 cursor-pointer hover:bg-base-200"
              >
                {user.name}
              </li>
            ))}

            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-base-content/60">
                No users found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
