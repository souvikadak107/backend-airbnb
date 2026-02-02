import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NavBar() {
  const nav = useNavigate();
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  const loggedIn = !!user;
  const role = user?.usertype;

  async function handleLogout() {
    await logout();
    nav("/", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `mr-3 px-3 py-1 rounded text-white transition
     ${isActive ? "bg-red-700" : "hover:bg-red-600"}`;

  return (
    <header className="bg-red-600 px-5 py-3 text-white">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center">
          <NavLink to="/" className={linkClass}>
            stayNight
          </NavLink>

          {loggedIn && (
            <>
              <NavLink to="/homes" className={linkClass}>Homes</NavLink>
              <NavLink to="/favourites" className={linkClass}>Favourites</NavLink>
              <NavLink to="/bookings" className={linkClass}>Bookings</NavLink>

              {role === "host" && (
                <>
                  <NavLink to="/home-list" className={linkClass}>
                    Host Homes
                  </NavLink>
                  <NavLink to="/add-home" className={linkClass}>
                    Add Home
                  </NavLink>
                </>
              )}
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center">
          {!loggedIn ? (
            <>
              <NavLink to="/signup" className={linkClass}>Signup</NavLink>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-700 px-4 py-1 rounded hover:bg-red-800 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}