// Core Module
const path = require('path');

//evn module
require('dotenv').config();

// External Module
const express = require('express');
const app = express();


//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());


//for testing: morgan logger
const morgan = require("morgan");
app.use(morgan("dev"));


//  both form-data and JSON work reliably
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Local Modules
const rootDir = require("./utils/pathUtil");


//CORS Middleware
const cors = require("cors");
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:3000"],
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));


const errorsController = require("./controllers/errors");


const authApiRouter = require("./routes/api/auth.api");
const storeApiRouter = require("./routes/api/store.api");
const hostApiRouter = require("./routes/api/host.api");
const paymentApiRouter = require("./routes/api/payment.api");

const { default: mongoose, Collection } = require('mongoose');





app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));

//health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});



// Routes
app.use("/api/auth", authApiRouter);
app.use("/api/payment", paymentApiRouter);
app.use("/api/store", storeApiRouter);
app.use("/api/host", hostApiRouter);


// 404 Page
app.use(errorsController.pageNotFound);

// Port setup
const PORT = process.env.PORT || 4000;


//connection set-up
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("connected to mongoose");
  
    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Server running on PORT:${PORT}`);
    });
  })
  .catch((err)=>{
    console.error(" MongoDB Connection Error:", err);
  })
