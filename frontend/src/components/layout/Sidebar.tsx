import { useState, type JSX } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdEventAvailable,
  MdWorkspaces,
  MdPeople,
  MdTask,
  MdChevronLeft,
  MdExpandMore,
  
  MdPayments,
  MdReceiptLong,
  MdHistory,
  MdNotifications,
  MdClose,
} from "react-icons/md";
import { FolderKanban, UserPlus } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const coreMenu: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: <MdDashboard size={20} />,
  },
  {
    id: "attendance",
    label: "Attendance",
    path: "/attendance",
    icon: <MdEventAvailable size={20} />,
  },
];

const managementMenu: MenuItem[] = [
  { id: "tasks", label: "Tasks", path: "/tasks", icon: <MdTask size={20} /> },
  { id: "leaves", label: "Leaves", path: "/leaves", icon: <MdTask size={20} /> },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: <MdNotifications size={20} /> },
];

const teamSubMenu: MenuItem[] = [
  {
    id: "members",
    label: "Members",
    path: "/members",
    icon: <MdPeople size={18} />,
  },
  {
    id: "addMember",
    label: "Add Member",
    path: "/addMember",
    icon: <UserPlus size={18} />,
  },
];

const projectsSubMenu: MenuItem[] = [
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: <MdWorkspaces size={18} />,
  },
  {
    id: "createProject",
    label: "Create Project",
    path: "/createProject",
    icon: <FolderKanban size={18} />,
  },
  {
    id: "workUpdates",
    label: "Work Updates",
    path: "/work-updates",
   icon: <MdWorkspaces size={20} />,
  }
];

const payrollSubMenu: MenuItem[] = [
  {
    id: "payroll-dashboard",
    label: "Payroll Dashboard",
    path: "/payroll/dashboard",
    icon: <MdPayments size={18} />,
  },
  {
    id: "salary-structure",
    label: "Salary Structure",
    path: "/payroll/salary-structure",
    icon: <MdPayments size={18} />,
  },
  {
    id: "generate-payslips",
    label: "Generate Payslips",
    path: "/payroll/generate",
    icon: <MdReceiptLong size={18} />,
  },
  {
    id: "payroll-history",
    label: "Payroll History",
    path: "/payroll/history",
    icon: <MdHistory size={18} />,
  },
];

export default function ERPSidebar({ isOpen, onClose }: Props) {
  const { auth } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  const user = auth?.user;
  const isManagement = ['admin', 'owner', 'manager'].includes(user?.role || '');
  const location = useLocation();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      isActive
        ? "bg-base-300 font-semibold text-base-content"
        : "text-primary-content hover:bg-base-300 hover:text-base-content",
    ].join(" ");

  const isPayrollActive = location.pathname.startsWith("/payroll");
  const isTeamActive = location.pathname.startsWith("/members") || location.pathname.startsWith("/addMember");
  const isProjectsActive = location.pathname.startsWith("/projects") || location.pathname.startsWith("/createProject");


  return (
    <>
      <div
        onClick={onClose}
        className={`
            fixed inset-0 bg-black/40 z-40 lg:hidden
            transition-opacity duration-300
            ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
      />
      {/* <aside
        className={`
    h-screen bg-base-200 border-r border-base-300 flex flex-col
    transition-all duration-300 ease-in-out
    ${collapsed ? "w-25" : "w-64"}
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      > */}

      <aside
        className={`
            fixed lg:static
            top-0 left-0
            z-50
            h-screen bg-primary border-r border-base-300 flex flex-col
            transition-all duration-300 ease-in-out
            ${collapsed ? "w-20" : "w-64"}
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border border-base-300 text-base-content border-b-white">
          <div
            className={`w-9 p-1 h-9 rounded-lg bg-base-100 text-primary flex items-center justify-center font-bold text-lg transition-all duration-300 ease-in-out ${collapsed ? "w-9" : "w-12"}`}
          >
            C
          </div>

          <div
            className={`
            flex-1 overflow-hidden transition-all duration-300 ease-in-out text-base-100
            ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
          `}
          >
            <p className="font-semibold text-base-100 whitespace-nowrap">
              Circuit
            </p>
            <p className="text-xs text-base-100 whitespace-nowrap">
              Office ERP
            </p>
          </div>

          <button
            className="text-lg btn btn-ghost btn-xs border-2  rounded-ee-none flex items-center justify-center lg:hidden  border-base-content"
            onClick={onClose}
          >
            <MdClose
              className={`transition-transform 
              `}
            />
          </button>

          <button
            className="btn btn-ghost btn-xs border-2 rounded-md p-1 hidden lg:block border-primary-content text-primary-content"
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
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6 text-base-content">
          {/* CORE */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase text-primary-content">
                Core
              </p>
            )}

            <div className="space-y-1 ">
              {coreMenu.map((item) => (
                <NavLink key={item.id} to={item.path} className={linkClass} >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}

              {/* PROJECTS DROPDOWN */}
              {user?.role === "admin" || user?.role === "owner" ? (
                <>
                  <button
                    onClick={() => setProjectsOpen(!projectsOpen)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${
                      isProjectsActive
                        ? "bg-base-300 font-semibold text-base-content"
                        : "text-primary-content hover:bg-base-300 hover:text-base-content"
                    }`}
                  >
                    <MdWorkspaces size={20} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">Projects</span>
                        <MdExpandMore
                          className={`transition-transform duration-300 ${
                            projectsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        projectsOpen && !collapsed
                          ? "max-h-40 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-8 space-y-1 pb-1">
                      {projectsSubMenu.map((item) => (
                        <NavLink key={item.id} to={item.path} className={linkClass}>
                          {item.icon}
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink to="/projects" className={linkClass}>
                  <MdWorkspaces size={20} />
                  {!collapsed && <span>Projects</span>}
                </NavLink>
              )}
            </div>
          </div>

          {/* MANAGEMENT */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase text-primary-content">
                Management
              </p>
            )}

            <div className="space-y-1">
              {/* TEAM DROPDOWN */}
              {isManagement && (user?.role === "admin" || user?.role === "owner" ? (
                <>
                  <button
                    onClick={() => setTeamOpen(!teamOpen)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${
                      isTeamActive
                        ? "bg-base-300 font-semibold text-base-content"
                        : "text-primary-content hover:bg-base-300 hover:text-base-content"
                    }`}
                  >
                    <MdPeople size={20} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">Team</span>
                        <MdExpandMore
                          className={`transition-transform duration-300 ${
                            teamOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        teamOpen && !collapsed
                          ? "max-h-40 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-8 space-y-1 pb-1">
                      {teamSubMenu.map((item) => (
                        <NavLink key={item.id} to={item.path} className={linkClass}>
                          {item.icon}
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink to="/members" className={linkClass}>
                  <MdPeople size={20} />
                  {!collapsed && <span>Team</span>}
                </NavLink>
              ))}

              {managementMenu.map((item) => (
                <NavLink key={item.id} to={item.path} className={linkClass}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}

              {/* PAYROLL / MY SALARY SECTION */}
              {isManagement ? (
                <>
                  {/* PAYROLL PARENT */}
                  <button
                    onClick={() => setPayrollOpen(!payrollOpen)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all text-primary-content ${
                      isPayrollActive
                        ? "bg-base-300 font-semibold text-base-content"
                        : "text-primary-content hover:bg-base-300 hover:text-base-content"
                    }`}
                  >
                    <MdPayments size={20} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">Payroll</span>
                        <MdExpandMore
                          className={`transition-transform duration-300 ${
                            payrollOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  {/* PAYROLL SUBMENU */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        payrollOpen && !collapsed
                          ? "max-h-40 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-8 space-y-1 pb-1">
                      {payrollSubMenu.map((item) => (
                        <NavLink key={item.id} to={item.path} className={linkClass}>
                          {item.icon}
                          <span>{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink to="/my-salary" className={linkClass}>
                  <MdReceiptLong size={20} />
                  {!collapsed && <span>My Salary</span>}
                </NavLink>
              )}
            </div>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-base-300 p-3">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center">
                <img src={user?.imageUrl || "https://i.pravatar.cc/100?img=12"} alt="User" />
               {/* {
                 user?.name ? user.name.charAt(0).toUpperCase() : "U"
               } */}
              </div>
            </div>

            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-base-100">
                  {" "}
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-base-100 capitalize ">
                  {user?.role || "Administrator"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
