import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function AddHome() {
  const nav = useNavigate();
  const { user, loading } = useAuth();

  const [houseName, setHouseName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  // host-only page (frontend guard)
  if (!user) {
    nav("/login", { replace: true });
    return null;
  }
  if (user.usertype !== "host") {
    return <div className="p-10 text-center text-red-600">Hosts only.</div>;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!houseName || !price || !location || !rating || !description) {
      setErr("All fields are required.");
      return;
    }
    if (!photo) {
      setErr("Please upload a photo.");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("houseName", houseName);
      fd.append("price", price);
      fd.append("location", location);
      fd.append("rating", rating);
      fd.append("description", description);
      fd.append("photo", photo);


      const res = await fetch(`${BASE}/host/add-home`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to add home");

      alert("Home added!");
      nav("/host/home-list");
    } catch (e2) {
      setErr(e2.message || "Failed to add home");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register Your Home on stayNight
        </h1>

        {err && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="max-w-md mx-auto">
          <input
            type="text"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            placeholder="Enter your House Name"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price Per Night"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rating"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Upload Photo
            </label>

            <label
              htmlFor="photo"
              className="flex items-center justify-center w-full
                        px-4 py-3 border border-red-300 rounded-md
                        cursor-pointer bg-white text-gray-600
                        hover:bg-red-50 hover:border-red-400
                        transition"
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

          {/* textarea (your EJS used type="textarea" which is invalid HTML) */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            rows={4}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}