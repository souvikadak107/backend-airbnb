const express = require("express");
const paymentRouter = express.Router();

const paymentController = require("../controllers/paymentController");

paymentRouter.get("/payment/:bookingId", paymentController.getCheckout);
paymentRouter.post("/payment/:bookingId/confirm", paymentController.postConfirmCheckoutSession);
paymentRouter.post("/payment/:bookingId/paylater", paymentController.postPayLaterCheckoutSession);
paymentRouter.post("/payment/:bookingId/cancel", paymentController.postCancelCheckoutSession);

module.exports = paymentRouter;