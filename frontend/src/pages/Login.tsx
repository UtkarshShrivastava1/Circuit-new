import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../assets/loginAnimation.json";
import { LockIcon, User2Icon } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login as loginService } from "../services/authService";
import { useAuth } from "../auth/AuthContext";

interface LoginProps {
  setToken?: React.Dispatch<React.SetStateAction<string>>;
}

const Login = ({ setToken }: LoginProps) => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

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

      const response = await loginService(formData);

    // ✅ Save user data
    console.log(response.data.user);
    alert("Login successful");
    
    // Store the token from the response
    if (response.data && response.data.token) {
      // Fallback local storage for token if your API service requires it
      // localStorage.setItem("token", response.data.token) ;
      
      // ✅ Update AuthContext global state correctly
      contextLogin({ 
        user: response.data.user,
        slug: response.data.user.slug,
       });

      // ✅ Save the full user details so other components (like Dashboards) can access it
      // sessionStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      
         
        if (setToken) {
          setToken(response.data.token );
          setUser(response.data.user);
        }
      }

      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
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
            {/* <div className="flex flex-col">
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
            </div> */}

            <div>
          <label className="text-sm text-blue-200 mb-4">
            Password 
          </label>

  <div className="relative">
     <LockIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50 text-blue-200"
                />
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-gray-50 text-black
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pl-10"
    />

    {/* Eye Icon */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  {/* {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
  )} */}
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
