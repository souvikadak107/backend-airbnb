import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Favourites() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [favHomes, setFavHomes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    // if auth still loading, wait
    if (authLoading) return;

    // if not logged in, go to login
    if (!user) {
      nav("/login", { replace: true });
      return;
    }

    async function loadFavs() {
      try {
        setErr("");
        setLoading(true);

      
        const res = await api("/store/favourites");
        setFavHomes(res.data || []);
        setCount(res.count || 0);
      } catch (e) {
        setErr(e.message || "Failed to fetch favourites");
      } finally {
        setLoading(false);
      }
    }

    loadFavs();
  }, [authLoading, user, nav]);

  async function removeFav(homeId) {
    try {
      // ✅ backend: DELETE /api/store/favourites/:homeId
      await api(`/store/favourites/${homeId}`, { method: "DELETE" });

      // optimistic UI update
      setFavHomes((prev) => prev.filter((h) => h._id !== homeId));
      setCount((c) => Math.max(0, c - 1));
      nav("/");
    } catch (e) {
      alert(e.message || "Failed to remove from favourites");
    }
  }

  if (authLoading) return null;
  if (!user) return null;

  if (loading) return <div className="p-10 text-center">Loading favourites...</div>;
  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-2">
        Here are your favourites:
      </h2>

      {favHomes.length === 0 ? (
        <div className="text-center text-gray-600">No favourites yet.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {favHomes.map((home) => (
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
                    className="bg-blue-300 px-3 py-2 rounded hover:bg-blue-400 transition"
                    to={`/homes/${home._id}/booking`}   // ⚠️ match your frontend booking route
                  >
                    Book
                  </Link>

                  <button
                    onClick={() => removeFav(home._id)}
                    className="bg-red-300 px-3 py-2 rounded hover:bg-red-400 transition"
                  >
                    Remove
                  </button>

                  <Link
                    className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
                    to={`/homes/${home._id}`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}