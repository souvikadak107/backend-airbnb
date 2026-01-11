const bycrypt = require('bcrypt');
const User = require('../models/user');

const {validationResult} = require('express-validator');
const { use } = require('express/lib/router');


exports.signup = async(req, res) =>{
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
      error : "Validation failed",
      details: errors.array()
    });
  }

  const { firstName, lastName, email, password, usertype } = req.body;

  const exitingUser= await User.findOne({email});
  if(exitingUser){
    return res.status(422).json({
      error: "User already exists with this email"
    });
  }

  const hashedPassword= await bycrypt.hash(password, 12);

  const user= new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    usertype
  });

  await user.save();

  return res.status(201).json({ 
    message: "User registered successfully",
    user:{
      id: user._id,
      email: user.email,
      usertype: user.usertype
    }
   });
};


exports.login= async(req, res) =>{
  const { email, password } = req.body;

  const user= await User.findOne({email});
  if(!user){
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  const isEqual= await bycrypt.compare(password, user.password);
  if(!isEqual){
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  req.session.isLoggedIn = true;
  req.session.userId = user._id;
  req.session.usertype = user.usertype;


  return res.status(200).json({
    message: "Login successful",
    user:{
      id: user._id,
      email: user.email,
      usertype: user.usertype
    }
  });
};

exports.logout= (req, res) =>{
  req.session.destroy(()=>{
    return res.status(200).json({
      message: "Logout successful"
    });
  }); 
};