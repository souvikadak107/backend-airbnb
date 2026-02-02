import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";


const BASE = import.meta.env.VITE_API_BASE_URL;

export default function UpdateHomePhoto() {
  const { homeId } = useParams();
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [home, setHome] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) return nav("/login", { replace: true });
    if (user.usertype !== "host") return nav("/", { replace: true });

    async function load() {
      try {
        setErr("");
        setLoading(true);

        const res = await fetch(`${BASE}/host/homes/${homeId}/photo`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load home");
        setHome(data.home);
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

    if (!photo) {
      setErr("Please select a new photo.");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("photo", photo);

      const res = await fetch(`${BASE}/host/homes/${homeId}/photo`, {
        method: "PATCH",
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Photo update failed");

      alert("Photo updated!");
      nav(`/home-list`);
    } catch (e2) {
      setErr(e2.message || "Photo update failed");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) return null;
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (err && !home) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Update Photo: {home?.houseName}
        </h2>

        {home?.photo && (
          <div className="flex justify-center mb-6">
            <img
              src={home.photo}
              alt={home.houseName}
              className="w-64 h-48 object-cover rounded-lg shadow"
            />
          </div>
        )}

        {err && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* nice file input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload New Photo</label>

            <label
              htmlFor="photo"
              className="flex items-center justify-center w-full
                         px-4 py-3 border border-red-300 rounded-md
                         cursor-pointer bg-white text-gray-600
                         hover:bg-red-50 hover:border-red-400 transition"
            >
              {photo ? photo.name : "Choose an image file"}
            </label>

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Photo"}
            </button>

            <button
              type="button"
              onClick={() => nav(-1)}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}