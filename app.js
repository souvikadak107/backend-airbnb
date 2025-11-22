// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const mongoDBStore= require('connect-mongodb-session')(session);

// Load environment variables
require('dotenv').config();

// Local Modules

const rootDir = require("./utils/pathUtil");


const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
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


// Middleware
app.use(express.urlencoded());

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


app.use(express.static(path.join(rootDir, 'public')));

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
app.use(authRouter)

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
const PORT = process.env.PORT || 4000;


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
