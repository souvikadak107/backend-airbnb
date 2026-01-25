import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { authStore } from "../../auth/token"; 

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      authStore.setToken(res.token);
      authStore.setUser(res.user);

      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2?.data?.error || e2.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit}>
        <input placeholder="Email" style={{ width: "100%", padding: 8, marginBottom: 10 }}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" style={{ width: "100%", padding: 8, marginBottom: 10 }}
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <button type="submit" style={{ padding: "10px 14px" }}>
          Login
        </button>
      </form>
    </div>
  );
}