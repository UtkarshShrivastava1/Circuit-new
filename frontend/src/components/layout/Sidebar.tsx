import { useEffect, useState, type JSX } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdEventAvailable,
  MdWorkspaces,
  MdPeople,
  MdTask,
  MdChevronLeft,
  MdExpandMore,
  MdExpandLess,
  MdPayments,
  MdReceiptLong,
  MdHistory,
  MdNotifications,
  MdClose,
} from "react-icons/md";
import { FolderKanban, UserPlus, UserPlus2 } from "lucide-react";

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
    id: "leaves",
    label: "Leaves",
    path: "/leaves",
    icon: <MdTask size={20} />,
  },
  {
    id: "addMember",
    label: "Add Member",
    path: "/addMember",
    icon: <UserPlus size={20} />,
  },
  {
    id: "createMember",
    label: "Create Member",
    path: "/createMember",
    icon: <UserPlus size={20} />,
  },
  {
    id: "createProject",
    label: "Create Project",
    path: "/createProject",
    icon: <FolderKanban size={20} />,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: <MdNotifications size={20} />,
  },
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
  const [collapsed, setCollapsed] = useState(false);
  const [payrollOpen, setPayrollOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const location = useLocation();
  const filteredManagementMenu = managementMenu.filter((item) => {
    // Items restricted to admin/owner
    const adminOnlyIds = ["addMember", "createMember", "createProject"];

    if (adminOnlyIds.includes(item.id)) {
      return user?.role === "admin" || user?.role === "owner";
    }

    return true; // everyone can see other items
  });
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      isActive
        ? "bg-base-300 font-semibold text-base-content"
        : "text-base-content/70 hover:bg-base-300 hover:text-base-content",
    ].join(" ");

  const isPayrollActive = location.pathname.startsWith("/payroll");

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        const decodedUser = decodeURIComponent(userCookie);
        setUser(JSON.parse(decodedUser));
      } catch (error) {
        console.error("Failed to parse user from cookie", error);
      }
    }
  }, []);

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
            h-screen bg-base-200 border-r border-base-300 flex flex-col
            transition-all duration-300 ease-in-out
            ${collapsed ? "w-20" : "w-64"}
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-2 border-base-300">
          <div
            className={`w-9 p-1 h-9 rounded-lg bg-primary text-primary-content flex items-center justify-center font-bold text-lg transition-all duration-300 ease-in-out ${collapsed ? "w-9" : "w-12"}`}
          >
            C
          </div>

          <div
            className={`
            flex-1 overflow-hidden transition-all duration-300 ease-in-out
            ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
          `}
          >
            <p className="font-semibold text-base-content whitespace-nowrap">
              Circuit
            </p>
            <p className="text-xs text-base-content/60 whitespace-nowrap">
              Office ERP
            </p>
          </div>

          <button
            className="text-lg btn btn-ghost btn-xs border-2 border-base-content-400 rounded-ee-none flex items-center justify-center lg:hidden"
            onClick={onClose}
          >
            <MdClose
              className={`transition-transform 
              `}
            />
          </button>

          <button
            className="btn btn-ghost btn-xs border-2 border-base-300 rounded-md p-1 hidden lg:block"
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
                <NavLink key={item.id} to={item.path} className={linkClass}>
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
              {filteredManagementMenu.map((item) => (
                <NavLink key={item.id} to={item.path} className={linkClass}>
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}

              {/* PAYROLL PARENT */}
              <button
                onClick={() => setPayrollOpen(!payrollOpen)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-all ${
                  isPayrollActive
                    ? "bg-base-300 font-semibold text-base-content"
                    : "text-base-content/70 hover:bg-base-300"
                }`}
              >
                <MdPayments size={20} />
                {/* {!collapsed && (
                <>
                  <span className="flex-1 text-left">Payroll</span>
                  {payrollOpen ? <MdExpandLess /> : <MdExpandMore />}
                </>
              )} */}
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
            </div>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-base-300 p-3">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            {!collapsed && (
              <div>
                <p className="text-sm font-semibold">
                  {" "}
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-base-content/60 capitalize">
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
