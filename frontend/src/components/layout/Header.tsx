import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/use-theme";

export default function Header() {
  const { theme, setTheme } = useTheme();
 const navigate=useNavigate();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "corporate" : "dark");
  };
  const handleLogout=()=>{
    navigate("/login");
  }
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4">
      {/* LEFT: Logo */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary text-primary-content flex items-center justify-center font-bold">
            C
          </div>
          <span className="text-lg font-semibold tracking-wide text-base-content">
            Covalenz ERP
          </span>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
       {/* Theme Toggle */}
<div className="flex items-center bg-base-200 rounded-full px-2 py-1">
  <label className="toggle text-base-content cursor-pointer">
    <input
      type="checkbox"
      checked={isDark}
      onChange={toggleTheme}
    />

    {/* Sun */}
    <svg
      aria-label="sun"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4"
    >
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </g>
    </svg>

    {/* Moon */}
    <svg
      aria-label="moon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4"
    >
      <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </g>
    </svg>
  </label>
</div>


        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-9 rounded-full">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="User avatar"
              />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 text-base-content"
          >
            <li className="menu-title">
              <span>Admin</span>
            </li>
            <li onClick={()=>navigate("/adminProfile/1")}>
              <a>Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li onClick={()=>{
              handleLogout()
            }}>
              <a className="text-error">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
