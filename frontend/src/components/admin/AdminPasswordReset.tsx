// import React, { useState } from "react";

// interface AdminPasswordProps {
//   id: string;
// }

// const AdminPasswordReset = ({ id }: AdminPasswordProps) => {
//   const [password, setPassword] = useState("");

//   const handleReset = async () => {
//     console.log("Resetting password for admin:", id);
//     console.log("New password:", password);

//     // later API call here
    
//   };

//   return (
//     <div className="bg-base-200 border border-base-300 rounded-xl p-4 w-72 flex flex-col items-center">
      
//       <h3 className="text-md font-semibold text-center mb-3">
//         Reset Your Password
//       </h3>

//       <input
//         type="password"
//         placeholder="Enter new password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full px-2 py-3 text-sm rounded-md bg-base-300 outline-none mb-3"

//       />
      
//       <button
//         onClick={handleReset}
//         className=" bg-blue-600 hover:bg-blue-500 text-white text-md px-6 py-1 rounded-md transition cursor-pointer"
//       >
//         Reset
//       </button>

//     </div>
//   );
// };

// export default AdminPasswordReset;


import React, { useState } from "react";

interface AdminPasswordProps {
  id: string;
}

const AdminPasswordReset = ({ id }: AdminPasswordProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password.trim()) return;

    try {
      setLoading(true);
      console.log("Resetting password for admin:", id);
      console.log("New password:", password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 w-96 shadow-md">
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-blue-900 mb-5">
        Reset Password
      </h3>

      {/* Input */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-sm text-gray-600">
          New Password
        </label>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleReset}
        disabled={!password.trim() || loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition-all duration-200"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

    </div>
  );
};

export default AdminPasswordReset;
