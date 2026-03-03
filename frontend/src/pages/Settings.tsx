import { useState } from "react";

import CompanySettings from "@/components/settings/CompanySettings";

import SecuritySettings from "@/components/settings/SecuritySettings";


const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("security");

  const renderContent = () => {
    switch (activeTab) {
      case "security":
        return <SecuritySettings />;
    
      case "company":
        return <CompanySettings/>;
      default:
        return null;
    }
  };
return (
  <div className="p-6 text-gray-800">
    <h1 className="text-2xl font-semibold mb-6">Settings</h1>

    {/* Tabs */}
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {["security",  "company"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 capitalize transition ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Tab Content */}
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {renderContent()}
    </div>
  </div>
);
};

export default SettingsPage;