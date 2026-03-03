import { useState } from "react";
import { toast } from "react-toastify";

const CompanySettings = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    const { name, address, startTime, endTime } = form;

    if (!name || !address || !startTime || !endTime) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      //  FUTURE API
    

      setTimeout(() => {
       toast.success("Company updated successfully");

        setLoading(false);
      }, 1000);

    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      <h2 className="text-lg font-semibold text-gray-800">
        Company Information
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Company Name"
        value={form.name}
        onChange={handleChange}
        className="bg-gray-50 p-3 rounded-md border border-gray-200 w-full focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        name="address"
        placeholder="Office Address"
        value={form.address}
        onChange={handleChange}
        className="bg-gray-50 p-3 rounded-md border border-gray-200 w-full focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-4">
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="bg-gray-50 p-3 rounded-md border border-gray-200 w-full focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="bg-gray-50 p-3 rounded-md border border-gray-200 w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md w-full transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default CompanySettings;