const express = require('express');
const {body} = require('express-validator');
const authApiRouter= express.Router();

const authApiController= require('../../controllers/authApiController');
const User= require('../../models/user');


authApiRouter.post('/signup',
  [
    body('firstName').trim().not().isEmpty().withMessage('First name is required'),
    body('lastName').trim().not().isEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email')
      .custom(async (value, {req})=>{
        const userDoc= await User.findOne({email: value});
        if(userDoc){
          return Promise.reject('E-Mail address already exists!');
        }
      }).normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
  ],
  authApiController.signup
);



authApiRouter.post('/login', authApiController.login);
authApiRouter.post('/logout', authApiController.logout);

module.exports= authApiRouter;