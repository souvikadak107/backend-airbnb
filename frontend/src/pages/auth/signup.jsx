import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api"; // adjust path if needed

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    usertype: "",
    terms: false,
  });

  const [errors, setErrors] = useState([]); // array of strings
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    const errs = [];
    if (!form.firstName.trim()) errs.push("First name is required");
    if (!form.lastName.trim()) errs.push("Last name is required");
    if (!form.email.trim()) errs.push("Email is required");
    if (form.password.length < 6) errs.push("Password must be at least 6 characters long");
    if (form.password !== form.confirmPassword) errs.push("Passwords do not match");
    if (!["guest", "host"].includes(form.usertype)) errs.push("Select user type");
    if (!form.terms) errs.push("You must accept the terms and conditions");
    return errs;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    setLoading(true);
    try {
      // If backend is cookie-auth and you want auto-login on signup,
      // update backend to set cookie in signup too.
      await api("/auth/signup", {
        method: "POST",
        body: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          usertype: form.usertype,
          terms: form.terms,
        },
      });

      navigate("/login");
    } catch (err) {
      setErrors([err.message || "Signup failed"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar comes from App.jsx already */}

      <div className="flex justify-center items-start mt-10 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create an account</h2>

          {errors.length > 0 && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3">
              <ul className="list-disc pl-5 text-red-700">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={onChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">User type</label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="usertype"
                    value="guest"
                    checked={form.usertype === "guest"}
                    onChange={onChange}
                  />
                  <span className="text-gray-700">Guest</span>
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="usertype"
                    value="host"
                    checked={form.usertype === "host"}
                    onChange={onChange}
                  />
                  <span className="text-gray-700">Host</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={onChange}
                className="h-4 w-4 text-red-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  terms and conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="text-blue-600 underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}