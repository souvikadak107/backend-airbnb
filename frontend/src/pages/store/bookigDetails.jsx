import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CreateBooking() {
  const { homeId } = useParams();
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [home, setHome] = useState(null);
  const [guests, setGuests] = useState([{ name: "", age: "" }]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      nav("/login", { replace: true });
      return;
    }

    async function load() {
      try {
        setErr("");
        setLoading(true);

        // ✅ backend: GET /api/store/homes/:homeId/booking -> { homeDetails }
        const res = await api(`/store/homes/${homeId}/booking`);
        setHome(res.homeDetails);
      } catch (e) {
        setErr(e.message || "Failed to load booking page");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, user, homeId, nav]);

  function updateGuest(idx, key, value) {
    setGuests((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, [key]: value } : g))
    );
  }

  function addGuest() {
    setGuests((prev) => [...prev, { name: "", age: "" }]);
  }

  function removeGuest(idx) {
    setGuests((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    // Build guests array for backend: must be non-empty array
    const payloadGuests = guests
      .map((g) => ({
        name: (g.name || "").trim(),
        age: Number(g.age),
      }))
      .filter((g) => g.name && Number.isFinite(g.age));

    if (payloadGuests.length === 0) {
      setErr("At least one valid guest is required.");
      return;
    }
    if (!checkIn || !checkOut) {
      setErr("Check-in and check-out are required.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setErr("Phone must be a 10-digit number.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ backend: POST /api/store/homes/:homeId/booking
      const res = await api(`/store/homes/${homeId}/booking`, {
        method: "POST",
        body: {
          guests: payloadGuests, // ✅ array (your backend expects Array.isArray)
          checkIn,
          checkOut,
          phone,
        },
      });

     
      alert(res.message || "Booking created!");
      nav(`/checkout/${res.booking._id}`);
    } catch (e2) {
      setErr(e2.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) return null;
  if (!user) return null;

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (err && !home) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto max-w-2xl mt-10 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-2">
          Guest & Stay Details
        </h2>

        {home && (
          <p className="text-center text-gray-600 mb-8">
            Booking for: <span className="font-semibold">{home.houseName}</span>
          </p>
        )}

        {err && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Guests */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Guests</h3>

            <div className="space-y-3">
              {guests.map((g, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    className="w-full border rounded-md p-2"
                    value={g.name}
                    onChange={(e) => updateGuest(idx, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Age"
                    className="w-24 border rounded-md p-2"
                    value={g.age}
                    onChange={(e) => updateGuest(idx, "age", e.target.value)}
                  />

                  {guests.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 font-bold px-2"
                      onClick={() => removeGuest(idx)}
                      title="Remove guest"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addGuest}
              className="mt-3 text-sm bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              + Add another guest
            </button>
          </section>

          {/* Dates */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Stay Duration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                required
                className="border rounded-md p-2"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <input
                type="date"
                required
                className="border rounded-md p-2"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </section>

          {/* Phone */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <input
              type="tel"
              required
              placeholder="10-digit phone number"
              className="w-full border rounded-md p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-60"
          >
            {submitting ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </main>
    </div>
  );
}