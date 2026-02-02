import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EditHome() {
  const { homeId } = useParams();
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [home, setHome] = useState(null);

  const [houseName, setHouseName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        // ✅ backend: GET /api/host/homes/:homeId -> { home }
        const res = await api(`/host/homes/${homeId}`);
        const h = res.home;

        setHome(h);
        setHouseName(h.houseName || "");
        setPrice(String(h.price ?? ""));
        setLocation(h.location || "");
        setRating(String(h.rating ?? ""));
        setDescription(h.description || "");
      } catch (e) {
        setErr(e.message || "Failed to load home");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, user, homeId, nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      setSaving(true);

      // ✅ backend: PATCH /api/host/homes/:homeId (JSON)
      const res = await api(`/host/homes/${homeId}`, {
        method: "PATCH",
        body: {
          houseName,
          price,
          location,
          rating,
          description,
        },
      });

      // refresh UI with updated home from backend
      const updated = res.home || home;
      setHome(updated);

      alert(res.message || "Home updated!");
      nav("/home-list");
    } catch (e2) {
      setErr(e2.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) return null;
  if (!user) return null;

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (err && !home) return <div className="p-10 text-center text-red-600">{err}</div>;
  if (!home) return <div className="p-10 text-center">Home not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-3xl">
        <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
          Details of {home.houseName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT: Image + read-only details */}
          {/* LEFT: Image + details */}
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden w-full h-64">
              <img
                src={home.photo}
                alt={home.houseName}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>

            {/* ✅ two-column details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Description + Location */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Description</h3>
                  <p className="text-gray-600">
                    {home.description || "No description available."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-1">Location</h3>
                  <p className="text-gray-600">{home.location}</p>
                </div>
              </div>

              {/* Right column: Price + Rating */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Price</h3>
                  <p className="text-green-600 text-lg font-bold">
                    ₹{home.price} / night
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-1">Rating</h3>
                  <div className="flex items-center text-yellow-400 text-lg">
                    ★ <span className="ml-2 text-gray-700">{home.rating} / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit form */}
          <div>
            {err && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="text"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="House Name"
              />

              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Price"
              />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Location"
              />

              <input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="Rating"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="border p-2 rounded w-full"
                placeholder="Description"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update"}
                </button>

                <Link
                  to={`/homes/${homeId}/photo`}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Update Photo
                </Link>

                <button
                  type="button"
                  onClick={() => nav(-1)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}