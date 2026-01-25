const express = require("express");
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const authApiRouter = express.Router();

const authApiController = require("../../controllers/authApiController");
const User = require("../../models/user");


authApiRouter.post(
  "/signup",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email")
      .isEmail().withMessage("Please enter a valid email")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) return Promise.reject("E-Mail address already exists!");
      })
      .normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
    body("usertype").isIn(["guest", "host"]).withMessage("Invalid user type"),
    body("terms")
      .custom((value) => value === true || value === 'true' || value === '1' || value === 1)
      .withMessage("You must accept the terms and conditions"),
  ],
  authApiController.signup
);

authApiRouter.post("/login", authApiController.login);
authApiRouter.post("/logout", authApiController.logout);

authApiRouter.get("/me", auth, authApiController.me);

module.exports = authApiRouter;