import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function HomeDetails() {
  const { homeId } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    

    async function load() {
      try {
        setErr("");
        setLoading(true);

        const res = await api(`/store/homes/${homeId}`);
        if (!ignore) setHome(res.homeDetails); // ✅ matches backend
      } catch (e) {
        if (!ignore) setErr(e.message || "Failed to load home details");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [homeId]);

  async function handleFavourite() {
    if (!user) return nav("/login");

    try {
      // ✅ change this path if your backend uses a different favourite route
      await api(`/store/favourites/${homeId}`, { method: "POST" });
      alert("Added to favourites");
      nav("/favourites");
    } catch (e) {
      alert(e.message || "Failed to add favourite");
    }
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (err)
    return (
      <div className="p-10 text-center text-red-600">
        {err}
      </div>
    );

  if (!home)
    return (
      <div className="p-10 text-center">
        Home not found
      </div>
    );

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Details of {home.houseName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IMAGE */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={home.photo}
            alt={home.houseName}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{home.description}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Location</h3>
            <p className="text-gray-600">{home.location}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Price</h3>
            <p className="text-green-600 text-xl font-bold">
              ₹{home.price} / night
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold mb-2">Rating</h3>
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-2 text-lg">{home.rating} / 5</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-2 flex gap-3 items-center">
            <button
              onClick={handleFavourite}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Favourite
            </button>

            {/* If booking route is /homes/booking/:homeId */}
            <Link
              to={`/homes/${homeId}/booking`}
              className="bg-blue-300 px-4 py-2 rounded hover:bg-blue-400 transition"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}