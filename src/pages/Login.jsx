import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validUserId = "admin";
    const validPassword = "admin05";

    if (userId == validUserId && password == validPassword) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/layouts", { replace: true });
    } else {
      setError("Invalid User ID or Password");
    }

    if (!userId || !password) {
      setError("Please enter User ID and Password");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SC</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              SCADA Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to access the control dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User ID
              </label>

              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg
                outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg
                outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700
              text-white font-semibold py-3 rounded-lg
              transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            SCADA Monitoring System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
