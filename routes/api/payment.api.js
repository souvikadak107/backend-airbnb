const express = require("express");
const paymentApiRouter = express.Router();

const paymentApiController = require("../../controllers/paymentApiController");
const auth = require("../../middleware/auth");


paymentApiRouter.get("/checkout/:bookingId", auth, paymentApiController.getCheckout);

paymentApiRouter.post("/checkout/:bookingId/confirm", auth, paymentApiController.postConfirmCheckoutSession);

paymentApiRouter.post("/checkout/:bookingId/paylater", auth, paymentApiController.postPayLaterCheckoutSession);

paymentApiRouter.delete("/checkout/:bookingId/cancel", auth, paymentApiController.deleteCancelCheckoutSession);

module.exports = paymentApiRouter;