const express = require("express");
const paymentApiRouter = express.Router();

const paymentApiController = require("../../controllers/paymentApiController");
const auth = require("../../middleware/auth");


paymentApiRouter.get("/checkout/:bookingId", auth, paymentApiController.getCheckout);

paymentApiRouter.get("/checkout/:bookingId/confirm", auth, paymentApiController.getConfirmCheckoutSession);

paymentApiRouter.get("/checkout/:bookingId/paylater", auth, paymentApiController.getPayLaterCheckoutSession);

paymentApiRouter.delete("/checkout/:bookingId/cancel", auth, paymentApiController.deleteCancelCheckoutSession);

module.exports = paymentApiRouter;