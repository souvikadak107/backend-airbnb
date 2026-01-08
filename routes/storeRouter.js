// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
<<<<<<< HEAD
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
=======

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/homes/booking/:homeId", storeController.getBookHome);
storeRouter.post("/homes/booking/:homeId", storeController.postBookHome);
storeRouter.post("/booking/:bookingId/cancel", storeController.postCancelBooking);



storeRouter.get("/favourites", storeController.getFavouriteList);


>>>>>>> working
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);

module.exports = storeRouter;
