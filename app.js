// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const multer = require('multer'); 

const mongoDBStore= require('connect-mongodb-session')(session);

// Load environment variables
require('dotenv').config();

// Local Modules

const rootDir = require("./utils/pathUtil");


const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const paymentRouter = require("./routes/paymentRouter");
const errorsController = require("./controllers/errors");
const { default: mongoose, Collection } = require('mongoose');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');



// session store 

const store = new mongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "session"
});

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


const secretKey= process.env.secret;

app.use(session({
    secret:secretKey,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 30
    }
}));



app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});



app.use((req,res,next)=>{
  //  console.log('cookie checking', req.get('Cookie'));
  //  req.isLoggedIn= req.get('Cookie')? req.get('Cookie').split('=')[1]==='true':false;

  req.isLoggedIn= req.session.isLoggedIn;
  next();
})


// Routes
app.use(storeRouter);
app.use(authRouter);
app.use(paymentRouter);
app.use("/api/auth", require("./routes/api/auth.api"));

app.use("/host",(req, res, next) => {
  if(req.isLoggedIn){
    next();
  }
  else{
    res.redirect("/login");
  }
});

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
