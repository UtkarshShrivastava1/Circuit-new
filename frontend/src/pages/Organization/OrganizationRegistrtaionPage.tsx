

import OrganizationForm from "@/components/organization/OrganizationRegistrationForm";

export default function OrganizationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 md:p-6">

      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* MOBILE TOP BANNER */}
        <div className="lg:hidden relative  bg-gradient-to-br from-blue-700 via-blue-600 to-blue-300 text-white flex flex-col justify-center items-center text-center py-10 px-6 overflow-hidden">

          <div className="z-10 max-w-xs">
            <h2 className="text-2xl font-semibold mb-3">
              Welcome
            </h2>

            <p className="text-sm opacity-90">
              Create your organization account and start managing
              employees, projects and payroll in one place.
            </p>
          </div>

        </div>

        {/* DESKTOP LEFT PANEL */}
        <div className="hidden lg:flex relative shapedividers_com-4472 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-300 text-white flex-col justify-center items-center text-center overflow-hidden">
 

          <div className="z-10 max-w-xs">
            <h2 className="text-3xl font-semibold mb-4">
              Welcome
            </h2>

            <p className="text-sm opacity-90">
              Create your organization account and start managing
              employees, projects and payroll in one place.
            </p>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white relative z-10 p-6 md:p-10 overflow-y-auto md:max-h-[90vh] modern-scroll">

          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
            Create your account
          </h2>

          <OrganizationForm />

        </div>

      </div>

    </div>
  );
}