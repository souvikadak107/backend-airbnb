// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.post("/delete-home", hostController.postDeleteHome);

hostRouter.get("/host-edit/:homeid", hostController.getEditHomes);

module.exports = hostRouter;
