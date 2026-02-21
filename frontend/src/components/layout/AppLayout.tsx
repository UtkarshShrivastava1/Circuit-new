import { useState, type ReactNode } from "react";
import Header from "./Header";
import ERPSidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {

  // 🔹 Mock permissions for Week-1
  const permissions = ["view_dashboard", "attendance", "projects"];
    const [sidebarOpen, setSidebarOpen] = useState(false);
 

  return (
    <div className="drawer lg:drawer-open bg-base-100">
      
      <input id="drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
         <Header onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>

      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        {/* Sidebar */}
      <ERPSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      </div>
    </div>
  );
}

// import { useState , type ReactNode } from "react";
// import ERPSidebar from "./Sidebar";
// import Header from "./Header";

// interface Props {
//   children: ReactNode;
// }

// export default function AppLayout({ children }: Props){
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     // <div className="flex h-screen overflow-hidden">
//     <div className="flex h-screen bg-base-100">
      
//       {/* Sidebar */}
//       <ERPSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
        
//         {/* <main className="flex-1 p-4 bg-base-100 overflow-y-scroll "> */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-100">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }