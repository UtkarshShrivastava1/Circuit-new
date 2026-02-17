import { useState, type JSX } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdEventAvailable,
  MdWorkspaces,
  MdPeople,
  MdTask,
  MdChevronLeft,
} from "react-icons/md";
import { FolderKanban, UserPlus, UserPlus2 } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
};

const coreMenu: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard size={20} />,
  },
  {
    id: "attendance",
    label: "Attendance",
    path: "/attendance",
    icon: <MdEventAvailable size={20} />,
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: <MdWorkspaces size={20} />,
  },
];

const managementMenu: MenuItem[] = [
  {
    id: "members",
    label: "Members",
    path: "/members",
    icon: <MdPeople size={20} />,
  },
  {
    id: "tasks",
    label: "Tasks",
    path: "/tasks",
    icon: <MdTask size={20} />,
  },
  {
    id:"addMember",
    label:"Add Member",
    path:"/addMember",
    icon:<UserPlus size={20}/>
  },
  {
    id:"createProject",
    label:"Create Project",
    path:"/createProject",
    icon:<FolderKanban size={20}/>
  }
];

export default function ERPSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      "relative",
      isActive
        ? "bg-base-300 font-semibold text-base-content"
        : "text-base-content/70 hover:bg-base-300 hover:text-base-content",
    ].join(" ");

  return (
    <aside
      className={`h-screen bg-base-200 border-r border-base-300 flex flex-col
        transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* HEADER / LOGO */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-base-300">
        <div className="w-9 h-9 rounded-lg bg-primary text-primary-content flex items-center justify-center font-bold">
          C
        </div>

        {!collapsed && (
          <div className="flex-1">
            <p className="font-semibold leading-tight text-base-content">Covalenz</p>
            <p className="text-xs text-base-content/60">Office ERP</p>
          </div>
        )}

        <button
          className="btn btn-ghost btn-xs text-base-content hover:bg-base-300 rounded-full p-1 border dark:border-blue-50  border-black/10 "
          onClick={() => setCollapsed(!collapsed)}
        >
          <MdChevronLeft
            className={`transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* CORE */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase text-base-content/50">
              Core
            </p>
          )}

          <div className="space-y-1">
            {coreMenu.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={linkClass}
              >
                {/* Active left indicator */}
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-primary opacity-0 group-[.active]:opacity-100" />

                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase text-base-content/50">
              Management
            </p>
          )}

          <div className="space-y-1">
            {managementMenu.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={linkClass}
              >
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-primary opacity-0 group-[.active]:opacity-100" />

                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* USER FOOTER */}
      <div className="border-t border-base-300 p-3">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content text-center justify-center  rounded-full w-9">
              <span className="py-4">AK</span>
            </div>
          </div>

          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-semibold text-base-content">Alex Kumar</p>
              <p className="text-xs text-base-content/60">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
