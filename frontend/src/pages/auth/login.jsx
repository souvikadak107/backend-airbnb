import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();   // ✅ add this

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      await refresh();                 // ✅ now it’s real
      navigate("/", { replace: true }); // ✅ replace avoids staying on /login
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-center mt-10 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

          {err && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600">
              New here?{" "}
              <Link className="text-blue-600 underline" to="/signup">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}