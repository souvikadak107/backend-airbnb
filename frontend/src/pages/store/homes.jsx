import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";
export default function Homes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadHomes() {
      try {
        // assumes backend: GET /api/store/homes -> { registeredHomes: [...] }
        const res = await api("/store/homes");
        setHomes(res.registeredHomes || []);
      } catch (e) {
        setErr(e.message || "Failed to fetch homes");
      } finally {
        setLoading(false);
      }
    }
    loadHomes();
  }, []);

  async function addFavourite(homeId) {
    if (!user) {
      alert("Please login to add favourites");
      return;
    }

    try {
      // change this endpoint to your real favourite route
      await api(`/store/favourites/${homeId}`, { method: "POST" });
      alert("Added to favourites");
      navigate("/favourites");
      

    } catch (e) {
      alert(e.message || "Failed to add favourite");
    }
  }

  if (loading) return <div className="p-10 text-center">Loading homes...</div>;
  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Here are our registered homes:
      </h2>

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
                  className="bg-blue-300 px-3 py-2 rounded hover:bg-blue-400 transition"
                  to={`/homes/${home._id}`}
                >
                  Details
                </Link>

                <button
                  onClick={() => addFavourite(home._id)}
                  className="bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600 transition"
                >
                  Favourite
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}