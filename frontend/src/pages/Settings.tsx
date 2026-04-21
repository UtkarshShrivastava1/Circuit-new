import { useState } from "react";

import CompanySettings from "@/components/settings/CompanySettings";

import SecuritySettings from "@/components/settings/SecuritySettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("security");

  const renderContent = () => {
    switch (activeTab) {
      case "security":
        return <SecuritySettings />;
    
      case "company":
        return <CompanySettings/>;
       case "appearance":
        return <AppearanceSettings/>;
      default:
        return null;
    }
  };
return (
  <div className="p-6 bg-base-100 text-base-content min-h-screen">
    <Breadcrumbs />

    <h1 className="text-2xl font-semibold mb-6">Settings</h1>

    {/* Tabs */}
    <div className="flex gap-6 border-b border-base-300 mb-6">
      {["security", "company", "appearance"].map((tab) => (
        <Button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 capitalize transition ${
            activeTab === tab
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-base-content/60 hover:text-base-content"
          }`}
        >
          {tab}
        </Button>
      ))}
    </div>

    {/* Tab Content */}
    <div className="bg-base-100 p-6 rounded-xl border border-base-300 shadow-sm">
      {renderContent()}
    </div>
  </div>
);
}