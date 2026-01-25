import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    usertype: "guest",
    terms: true,
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function set(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      const res = await api("/auth/signup", { method: "POST", body: form });
      setOk(res.message || "Signup successful");
      setTimeout(() => nav("/login"), 300);
    } catch (e2) {
      const details = e2?.data?.details?.map((d) => d.msg).join(", ");
      setErr(details || e2?.data?.error || e2.message);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Signup</h1>

      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", gap: 10 }}>
          <input placeholder="First name" style={{ flex: 1, padding: 8 }}
            value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          <input placeholder="Last name" style={{ flex: 1, padding: 8 }}
            value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </div>

        <input placeholder="Email" style={{ width: "100%", padding: 8, marginTop: 10 }}
          value={form.email} onChange={(e) => set("email", e.target.value)} />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <input type="password" placeholder="Password" style={{ flex: 1, padding: 8 }}
            value={form.password} onChange={(e) => set("password", e.target.value)} />
          <input type="password" placeholder="Confirm" style={{ flex: 1, padding: 8 }}
            value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} />
        </div>

        <select style={{ width: "100%", padding: 8, marginTop: 10 }}
          value={form.usertype} onChange={(e) => set("usertype", e.target.value)}>
          <option value="guest">guest</option>
          <option value="host">host</option>
        </select>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
          <input type="checkbox" checked={!!form.terms} onChange={(e) => set("terms", e.target.checked)} />
          Accept terms
        </label>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {ok && <p style={{ color: "green" }}>{ok}</p>}

        <button type="submit" style={{ marginTop: 12, padding: "10px 14px" }}>
          Create account
        </button>
      </form>
    </div>
  );
}