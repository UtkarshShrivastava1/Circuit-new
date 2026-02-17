import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../assets/loginAnimation.json";
import { LockIcon, User2Icon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Invalid email format");
      return false;
    }

    return true;
  };

  // Submit handler (Backend ready structure)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      navigate("/dashboard");
    } catch (err: any) {
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200 p-6">
      <div className="w-full max-w-5xl bg-blue-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-blue-100 flex items-center justify-center p-10">
          <Lottie animationData={loginAnimation} loop className="w-[350px]" />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-12 flex flex-col justify-center text-white">
          {/* Heading */}
          <h1 className="text-4xl font-bold mb-2 tracking-wide">
            Welcome Back
          </h1>

          <p className="text-blue-200 text-sm mb-6">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm text-blue-200 mb-1">Email</label>
              <div className="relative">
                <User2Icon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50 text-blue-200"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                />
              </div>
            </div>

            {/* Password */}
            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm text-blue-200 mb-1">Password</label>

              <div className="relative">
                <LockIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50 text-blue-200"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-300 text-sm">{error}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
