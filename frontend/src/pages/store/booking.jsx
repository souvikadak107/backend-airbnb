import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

function fmtDate(d) {
  try {
    return new Date(d).toDateString();
  } catch {
    return "";
  }
}

export default function Bookings() {
  const nav = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // ✅ backend: GET /api/store/booking -> { data: [...] }
        const res = await api("/store/booking");
        setBookings(res.data || []);
      } catch (e) {
        setErr(e.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, user, nav]);

  async function cancelBooking(bookingId) {
    if (!confirm("Cancel this booking?")) return;

    try {
      //  backend: DELETE /api/store/booking/:bookingId/cancel
      await api(`/store/booking/${bookingId}/cancel`, { method: "DELETE" });

      // Update UI: mark cancelled
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (e) {
      alert(e.message || "Failed to cancel booking");
    }
  }

  if (authLoading) return null;
  if (!user) return null;

  if (loading) return <div className="p-10 text-center">Loading bookings...</div>;
  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;

  return (
    <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
      <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
        Here are your Bookings:
      </h2>

      {(!bookings || bookings.length === 0) ? (
        <p className="text-center text-gray-600">No bookings found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {bookings.map((b) => {
            const home = b.home || {};
            const guestsCount = Array.isArray(b.guests) ? b.guests.length : 0;

            // If backend does not store totalPrice, compute safely:
            const total =
              typeof b.totalPrice === "number"
                ? b.totalPrice
                : (typeof b.pricePerNight === "number" ? b.pricePerNight : 0);

            return (
              <div
                key={b._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full max-w-sm"
              >
                <img
                  src={home.photo}
                  alt={home.houseName || "home"}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {home.houseName}
                  </h3>

                  <p className="text-gray-600 mb-2">📍 {home.location}</p>

                  <div className="text-sm text-gray-700 space-y-1 mb-3">
                    <p>
                      <b>Status:</b>{" "}
                      <span className="capitalize">{b.status}</span>
                    </p>
                    <p><b>Check-in:</b> {fmtDate(b.checkIn)}</p>
                    <p><b>Check-out:</b> {fmtDate(b.checkOut)}</p>
                    <p><b>Guests:</b> {guestsCount}</p>
                    <p><b>Price/Night:</b> Rs {b.pricePerNight}</p>
                    <p className="text-lg font-bold text-red-500">
                      <b>Total:</b> Rs {total}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {b.status === "confirmed" ? (
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    ) : b.status === "paylater" ? (
                      <>
                        {/* If you have a payment route in React, keep it */}
                        <Link
                          to={`/payment/${b._id}`}
                          className="w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                          Pay Now
                        </Link>

                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="text-gray-600">Cancelled</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}