import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/use-theme";
import { MdNotifications ,MdMenu } from "react-icons/md";
import type { Notification } from "@/type/notification";
import { logout } from "../../services/authService";


interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps)  {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const currentUserId = "1"; // from auth later
 
 const navigate=useNavigate();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "corporate" : "dark");
  };

  const visibleNotifications = notifications.filter(
    (n) =>
      n.targetUserIds.length === 0 ||
      n.targetUserIds.includes(currentUserId)
  );

  const unreadCount = visibleNotifications.filter(
    (n) => !n.readBy.includes(currentUserId)
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              readBy: [...n.readBy, currentUserId],
            }
          : n
      )
    );
  };

  

  const handleLogout=()=>{
    localStorage.removeItem('theme');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    logout();
    navigate("/login");
  }
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-3 md:px-6">

      {/* ================= LEFT ================= */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {/* Hamburger - Mobile Only */}
            <button
              onClick={onMenuClick}
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <MdMenu size={22} />
            </button>

{/* <label
  htmlFor="drawer"
  className="btn btn-ghost btn-circle lg:hidden"
   onClick={() => {
    const checkbox = document.getElementById("drawer") as HTMLInputElement;
    if (checkbox) checkbox.checked = true;
  }}
>
  <MdMenu size={22} />
</label> */}


        {/* Logo */}
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary text-primary-content flex items-center justify-center font-bold shrink-0">
          C
        </div>

        {/* Hide text on very small screens */}
        <span className="hidden sm:block text-base md:text-lg font-semibold truncate">
          Circuit 
        </span>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* ========== NOTIFICATIONS ========== */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle relative"
          >
            <MdNotifications size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-error badge-xs">
                {unreadCount}
              </span>
            )}
          </label>

          <div className="
            dropdown-content 
            mt-3 
            w-[90vw] sm:w-80
            bg-base-100 
            shadow-xl 
            rounded-xl 
            border border-base-300 
            p-3 
            space-y-2 
            max-h-96 
            overflow-y-auto
          ">

            {visibleNotifications.length === 0 && (
              <p className="text-xs text-base-content/60">
                No notifications
              </p>
            )}

            {visibleNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 rounded-lg border cursor-pointer transition
                  ${
                    n.readBy.includes(currentUserId)
                      ? "bg-base-100"
                      : "bg-base-200"
                  }`}
              >
                <p className="text-sm font-semibold truncate">
                  {n.title}
                </p>
                <p className="text-xs text-base-content/60 line-clamp-2">
                  {n.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========== THEME TOGGLE ========== */}
        <div className="hidden sm:flex items-center bg-base-200 rounded-full px-2 py-1">
          <label className="toggle text-base-content cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
            />
            <span className="hidden md:inline">🌞</span>
            <span className="hidden md:inline">🌙</span>
          </label>
        </div>

        {/* ========== PROFILE ========== */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-8 md:w-9 rounded-full">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="User avatar"
              />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="
              menu menu-sm 
              dropdown-content 
              mt-3 p-2 
              shadow-lg 
              bg-base-100 
              rounded-xl 
              w-48 md:w-52
            "
          >
            <li className="menu-title">
              <span>Admin</span>
            </li>
            <li onClick={()=>navigate("/adminProfile/1")}>
              <a>Profile</a>
            </li>
            <li onClick={()=>navigate("/settings")}>
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
