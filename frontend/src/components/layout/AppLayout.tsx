import { useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {

  // 🔹 Mock permissions for Week-1
  const permissions = ["view_dashboard", "attendance", "projects"];
 

  return (
    <div className="drawer lg:drawer-open bg-base-100">
      
      <input id="drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Header 
        />
        {children}
      </div>

      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <Sidebar permissions={permissions} 
        />
      </div>
    </div>
  );
}
