import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar";

import IndexPage from "./pages/index";

import Homes from "./pages/store/homes";
import Favourites from "./pages/store/favourites";
import Bookings from "./pages/store/booking";

import HostHomeList from "./pages/host/hostHomeList";
import AddHome from "./pages/host/addHome";
import EditHome from "./pages/host/editHome";

import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import Logout from "./pages/auth/logout";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<IndexPage/>} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/bookings" element={<Bookings />} />

        <Route path="/host/host-home-list" element={<HostHomeList />} />
        <Route path="/host/add-home" element={<AddHome />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />

      </Routes>
    </BrowserRouter>
  );
}