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

  if (loading) return <p style={styles.msg}>Loading homes...</p>;
  if (err) return <p style={{ ...styles.msg, color: "crimson" }}>{err}</p>;

  return (
    <main style={styles.container}>
      <h2 style={styles.heading}>
        Welcome to airbnb index page
      </h2>

      <div style={styles.grid}>
        {homes.map((home) => (
          <div key={home._id} style={styles.card}>
            <img
              src={home.photo}
              alt={home.houseName}
              style={styles.image}
            />

            <div style={styles.body}>
              <h3 style={styles.title}>{home.houseName}</h3>
              <p style={styles.location}>{home.location}</p>

              <div style={styles.row}>
                <span style={styles.price}>
                  Rs {home.price} / night
                </span>
                <span style={styles.rating}>
                   {home.rating}
                </span>
              </div>

              <div style={styles.actions}>
                <Link to={`/homes/${home._id}`} style={styles.btn}>
                  Details
                </Link>
                <Link to={`/homes/booking/${home._id}`} style={styles.btn}>
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

const styles = {
  container: {
    maxWidth: 1100,
    margin: "30px auto",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#dc2626",
    marginBottom: 30,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    width: 300,
    border: "1px solid #ddd",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },
  body: {
    padding: 12,
  },
  title: {
    margin: "6px 0",
  },
  location: {
    color: "#555",
    fontSize: 14,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "8px 0",
  },
  price: {
    fontWeight: "bold",
    color: "#dc2626",
  },
  rating: {
    color: "#444",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    textDecoration: "none",
    background: "#e5e7eb",
    padding: "6px 10px",
    borderRadius: 6,
    color: "#111",
    fontSize: 14,
  },
  msg: {
    textAlign: "center",
    padding: 40,
  },
};