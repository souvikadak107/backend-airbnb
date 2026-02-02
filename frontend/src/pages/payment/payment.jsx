import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toDateString();
}

export default function CheckoutPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [home, setHome] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        setMsg("");

        const res = await api(`/payment/checkout/${bookingId}`);
        if (!mounted) return;

        setBooking(res.booking);
        setHome(res.home);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load checkout");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [bookingId]);

  const guestCount = useMemo(() => {
    const g = booking?.guests;
    if (Array.isArray(g)) return g.length;
    if (typeof g === "number") return g;
    return 0;
  }, [booking]);

  async function confirmPayNow() {
    try {
      setBusy(true);
      setErr("");
      setMsg("");

      const res = await api(`/payment/checkout/${bookingId}/confirm`, { method: "POST" });
      setBooking(res.booking);
      setMsg("Booking confirmed successfully ✅");
      navigate("/bookings");
    } catch (e) {
      setErr(e.message || "Failed to confirm booking");
    } finally {
      setBusy(false);
    }
  }

  async function setPayLater() {
    try {
      setBusy(true);
      setErr("");
      setMsg("");

      const res = await api(`/payment/checkout/${bookingId}/paylater`, { method: "POST" });
      setBooking(res.booking);
      setMsg("Booking set to pay later");
      navigate("/bookings");
    } catch (e) {
      setErr(e.message || "Failed to set pay later");
    } finally {
      setBusy(false);
    }
  }

  async function cancelBooking() {
    const ok = window.confirm("Cancel this booking? This action cannot be undone.");
    if (!ok) return;

    try {
      setBusy(true);
      setErr("");
      setMsg("");

      await api(`/payment/checkout/${bookingId}/cancel`, { method: "DELETE" })

      setMsg("Booking cancelled successfully ");
      // optional redirect
      navigate("/bookings");
    } catch (e) {
      setErr(e.message || "Failed to cancel booking");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm font-semibold text-gray-700">
        Loading checkout...
      </div>
    );
  }

  if (err && !booking) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm font-extrabold text-red-600">{err}</p>
          <Link
            to="/store"
            className="mt-4 inline-block rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-900 hover:bg-gray-50"
          >
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-emerald-600">
              Payment
            </h2>
            <p className="mt-2 text-center text-sm font-semibold text-gray-600">
              Review your booking and choose how you want to pay.
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold text-gray-900">Booking Summary</h3>

                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-extrabold text-gray-800">
                  Booking ID: {bookingId}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-500">Property</p>
                  <p className="mt-1 font-extrabold text-gray-900">
                    {home?.houseName || booking?.home?.houseName || "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-500">Guests</p>
                  <p className="mt-1 font-extrabold text-gray-900">{guestCount}</p>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-500">Check-in</p>
                  <p className="mt-1 font-extrabold text-gray-900">
                    {formatDate(booking?.checkIn)}
                  </p>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-4">
                  <p className="text-xs font-bold text-gray-500">Check-out</p>
                  <p className="mt-1 font-extrabold text-gray-900">
                    {formatDate(booking?.checkOut)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-lg bg-white border border-gray-200 p-4">
                <p className="text-sm font-extrabold text-gray-900">Total Amount</p>
                <p className="text-xl font-black text-gray-900">
                  ₹ {booking?.totalPrice ?? "—"}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold text-gray-600">
                <span>Status</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-800">
                  {booking?.status || "—"}
                </span>
              </div>
            </div>

            {/* Alerts */}
            {msg && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-extrabold text-emerald-700">
                {msg}
              </div>
            )}
            {err && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700">
                {err}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 grid gap-3">
              <button
                onClick={confirmPayNow}
                disabled={busy}
                className={`w-full rounded-xl px-4 py-3 text-sm font-extrabold text-white transition
                  ${busy ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"}`}
              >
                {busy ? "Processing..." : "Pay Now"}
              </button>

              <button
                onClick={setPayLater}
                disabled={busy}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-extrabold transition
                  ${busy ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 active:scale-[0.99]"}`}
              >
                Book now Pay Later
              </button>

              <button
                onClick={cancelBooking}
                disabled={busy}
                className={`w-full rounded-xl px-4 py-3 text-sm font-extrabold text-white transition
                  ${busy ? "bg-rose-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 active:scale-[0.99]"}`}
              >
                Cancel Booking
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/store"
                className="text-sm font-extrabold text-gray-700 hover:text-gray-900 underline underline-offset-4"
              >
                Back to listings
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="text-sm font-extrabold text-gray-700 hover:text-gray-900 underline underline-offset-4"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}