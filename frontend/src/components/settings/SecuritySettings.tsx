import { useState } from "react";
import { toast } from "react-toastify";

const SecuritySettings = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      //  FUTURE BACKEND CALL
      
      setTimeout(() => {
      toast.success("Password updated successfully ");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Change Password
      </h2>

      <div className="grid gap-4 max-w-md">
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          className="bg-gray-50 p-3 rounded-md border border-gray-200"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="bg-gray-50 p-3 rounded-md border border-gray-200"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="bg-gray-50 p-3 rounded-md border border-gray-200"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;