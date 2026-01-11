// Core Module
const path = require('path');

// External Module
const express = require('express');
const app = express();

const multer = require('multer'); 
const cookieParser = require("cookie-parser");


// Load environment variables
require('dotenv').config();

// Local Modules

const rootDir = require("./utils/pathUtil");



const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const paymentRouter = require("./routes/paymentRouter");
const errorsController = require("./controllers/errors");
const authApiRouter = require("./routes/api/auth.api");
const { default: mongoose, Collection } = require('mongoose');

const authState= require("./middleware/authState");

app.use(cookieParser());
app.use(authState);



// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


//  both form-data and JSON work reliably
app.use(express.urlencoded());
app.use(express.json());


// Middleware for request parsing and static files
app.use(multer({storage, fileFilter}).single('photo'));
app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/edit-home/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads')));







app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});



// Routes
app.use(storeRouter);
app.use(authRouter);
app.use(paymentRouter);
app.use("/api/auth", authApiRouter);

const jwtPageGuard = require("./middleware/jwtPageGuard");

app.use("/host", jwtPageGuard);
app.use("/host", hostRouter);



// 404 Page
app.use(errorsController.pageNotFound);

// Port setup
const PORT = process.env.PORT || 4003;


//connection set-up
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("connected to mongoose");
  
    app.listen(PORT, () => {
      console.log(` Server running on: http://localhost:${PORT}`);
    });
  })
  .catch((err)=>{
    console.error(" MongoDB Connection Error:", err);
  })
