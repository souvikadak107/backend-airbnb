import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navBar";

import IndexPage from "./pages/index";

import Homes from "./pages/store/homes";
import HomeDetails from "./pages/store/homeDetails";

import Favourites from "./pages/store/favourites";

import Bookings from "./pages/store/booking";
import BookigDetails from "./pages/store/bookigDetails";

import HostHomeList from "./pages/host/hostHomeList";
import AddHome from "./pages/host/addHome";
import EditHome from "./pages/host/editHome"; 
import UpdateHomePhoto from "./pages/host/updateHomePic";

import Payment from "./pages/payment/payment";

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
        <Route path="/homes/:homeId" element={<HomeDetails />} />

        <Route path="/favourites" element={<Favourites />} />

        <Route path="/bookings" element={<Bookings />} />
        <Route path="/homes/:homeId/booking" element={<BookigDetails />} />

        <Route path="/home-list" element={<HostHomeList />} />
        <Route path="/add-home" element={<AddHome />} />
        <Route path="/edit-home/:homeId" element={<EditHome />} />
        <Route path="/homes/:homeId/photo" element={<UpdateHomePhoto />} />

        <Route path="/checkout/:bookingId" element={<Payment />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="*" element={<div style={{ padding: 40 }}>404</div>} />

      </Routes>
    </BrowserRouter>
  );
}