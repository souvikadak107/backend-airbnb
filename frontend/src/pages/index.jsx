import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function IndexPage() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadHomes() {
      try {
        const res = await api("/store");
        setHomes(res.registeredHomes || []);
      } catch (e) {
        setErr("Failed to fetch homes");
      } finally {
        setLoading(false);
      }
    }
    loadHomes();
  }, []);

  if (loading) return <p className="text-center p-10">Loading homes...</p>;
  if (err) return <p className="text-center text-red-500 p-10">{err}</p>;

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Welcome to airbnb index page
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
                <div className="flex items-center gap-1">
                  ⭐ <span>{home.rating}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/homes/${home._id}`}
                  className="bg-blue-300 px-3 py-1 rounded"
                >
                  Details
                </Link>

                <Link
                  to={`/homes/${home._id}/booking`}
                  className="bg-blue-300 px-3 py-1 rounded"
                >
                  Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}