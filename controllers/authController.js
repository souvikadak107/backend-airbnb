const { check } = require("express-validator");
const { validationResult } = require('express-validator');

const bcrypt= require('bcryptjs');

const User= require("../models/user");

exports.getLogin = (req, res, next) => {
      res.render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        editing: false,
        isLoggedIn: req.isLoggedIn
      });
    };

    exports.postLogin = (req, res, next) => {
      req.session.isLoggedIn = true;
      req.session.save(err => {
        if (err) {
          console.log('Session save error:', err);
        }
        res.redirect("/");
      });
    };


    exports.postLogout= (req, res, next)=>{
      req.session.destroy(()=>{
        res.redirect("/");
      })
    }

    exports.getSignup = (req, res, next) => {
      res.render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        editing: false,
        isLoggedIn: false
      });
    }


    exports.postSignup = [
      check("firstName").not().isEmpty().withMessage("First Name is required").trim().isLength({ min: 2 }).withMessage("First Name must be at least 2 characters long").matches(/^[A-Za-z]+$/).withMessage("First Name must contain only letters"),


      check("lastName").matches(/^[A-Za-z]+$/).withMessage("Last Name must contain only letters"),   

      check("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail().custom(async(value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("Email already in use");
        }
        return true;  
      }),
      
      check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").trim().matches(/\d/).withMessage("Password must contain at least one number").matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter").matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter").matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@, $, !, %, *, ?, &)").trim(),

      check("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }).trim(),  


      check("usertype").isIn(['guest', 'host']).withMessage("Invalid user type"),
      

      check("terms").equals("1").withMessage("You must accept the terms and conditions"),
      
      (req, res, next) => {

        const { firstName, lastName, email, password, usertype, term} = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            currentPage: "signup",
            editing: false,
            isLoggedIn: false,
            errors: errors.array(),
            form: { firstName, lastName, email, password, usertype, term}
          });
        }
        bcrypt.hash(password, 12).then(hashedPassword=>{ 
        const user= new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          usertype
        });

      user.save();
    })
    .then(result=>{
      console.log("User signed up:", result);
      return res.render("auth/signToLogin", {
        pageTitle: "SignUp Successful",
        currentPage: "signup",
        editing: false,
        isLoggedIn: false
      });
    })
    .catch(err=>{
      return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            currentPage: "signup",
            editing: false,
            isLoggedIn: false,
            errors: [err.message],
            form: { firstName, lastName, email, password, usertype, term}
          });
    })
}];



