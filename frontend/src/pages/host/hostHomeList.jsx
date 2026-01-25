import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function HostHomeList() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [homes, setHomes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      nav("/login", { replace: true });
      return;
    }

    if (user.usertype !== "host") {
      nav("/", { replace: true });
      return;
    }

    async function load() {
      try {
        setErr("");
        setLoading(true);

        // ✅ backend: GET /api/host/home-list -> { homes, count }
        const res = await api("/host/home-list");
        setHomes(res.homes || []);
        setCount(res.count || 0);
      } catch (e) {
        setErr(e.message || "Failed to fetch host homes");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, user, nav]);

  async function deleteHome(homeId) {
    if (!confirm("Delete this home?")) return;

    try {
      
      await api(`/host/delete-home/${homeId}`, { method: "DELETE" });

      setHomes((prev) => prev.filter((h) => h._id !== homeId));
      setCount((c) => Math.max(0, c - 1));
    } catch (e) {
      alert(e.message || "Failed to delete home");
    }
  }

  if (authLoading) return null;
  if (!user) return null;

  if (loading) return <div className="p-10 text-center">Loading host homes...</div>;
  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-2">
        Hey Host! Here are your homes:
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Total: <span className="font-semibold">{count}</span>
      </p>

      {homes.length === 0 ? (
        <p className="text-center text-gray-600">No homes found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {homes.map((home) => (
            <div
              key={home._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full max-w-sm"
            >
              <img
                src={home.photo}
                alt={home.houseName}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {home.houseName}
                </h3>

                <p className="text-gray-600 mb-2">📍 {home.location}</p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-red-500">
                    Rs {home.price} / night
                  </span>

                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-700">{home.rating}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/host/edit-home/${home._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteHome(home._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}