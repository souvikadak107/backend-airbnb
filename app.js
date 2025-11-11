// Core Module
const path = require('path');

// External Module
const express = require('express');

// Load environment variables
require('dotenv').config();

// Local Modules
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { mongoConnect } = require('./utils/databaseUtil');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(express.urlencoded());
app.use(express.static(path.join(rootDir, 'public')));

// Routes
app.use(storeRouter);
app.use("/host", hostRouter);

// 404 Page
app.use(errorsController.pageNotFound);

// Port setup
const PORT = process.env.PORT || 3000;

// Start server after MongoDB connects
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(` Server running on: http://localhost:${PORT}`);
  });
});
