import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authStore } from "../auth/token";

export default function NavBar() {
  const nav = useNavigate();
  const [loggedIn, setLoggedIn] = useState(authStore.isLoggedIn());
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    const sync = () => {
      setLoggedIn(authStore.isLoggedIn());
      setUser(authStore.getUser());
    };
    sync();
    window.addEventListener("auth_changed", sync);
    return () => window.removeEventListener("auth_changed", sync);
  }, []);

  const role = user?.usertype;

  function logout() {
    authStore.logout();
    nav("/", { replace: true });
  }

  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    textDecoration: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    background: isActive ? "#b91c1c" : "transparent",
  });

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <div style={styles.left}>
          <NavLink to="/" style={linkStyle}>
            airbnb
          </NavLink>

          {loggedIn && (
            <>
              <NavLink to="/homes" style={linkStyle}>Homes</NavLink>
              <NavLink to="/favourites" style={linkStyle}>Favourites</NavLink>
              <NavLink to="/bookings" style={linkStyle}>Bookings</NavLink>

              {role === "host" && (
                <>
                  <NavLink to="/host/host-home-list" style={linkStyle}>
                    Host Homes
                  </NavLink>
                  <NavLink to="/host/add-home" style={linkStyle}>
                    Add Home
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>

        <div>
          {!loggedIn ? (
            <>
              <NavLink to="/signup" style={linkStyle}>Signup</NavLink>
              <NavLink to="/login" style={linkStyle}>Login</NavLink>
            </>
          ) : (
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    background: "#dc2626",
    padding: "10px 20px",
    color: "#fff",
  },
  nav: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  logoutBtn: {
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};