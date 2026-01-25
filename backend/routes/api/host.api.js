const express = require('express');
const hostApiRouter = express.Router();

const hostApiController = require('../../controllers/hostApiController');
const auth = require('../../middleware/auth');
const hostauth = require('../../middleware/hostAuth');
const upload = require('../../middleware/upload');


//Add home
hostApiRouter.get('/add-home', auth, hostauth, hostApiController.getAddHomes);

hostApiRouter.post('/add-home', auth, hostauth,(req, res, next) => {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Form must be multipart/form-data" });
    }
    next();
  },upload.single("photo"), hostApiController.postAddHomes);


//Get host home list
hostApiRouter.get('/home-list', auth, hostauth, hostApiController.getHostHomes);


//Edit home
hostApiRouter.get('/homes/:homeId', auth, hostauth, hostApiController.getEditHomes);

hostApiRouter.patch('/homes/:homeId', auth, hostauth, hostApiController.patchEditHomes);

//edit Photo 
hostApiRouter.get("/homes/:homeId/photo", auth, hostauth, hostApiController.getPhotoPage);

hostApiRouter.patch("/homes/:homeId/photo", auth, hostauth, hostApiController.patchPhotoPage);

//Delete home
hostApiRouter.delete('/delete-home/:homeId', auth, hostauth, hostApiController.deleteHomes);
module.exports = hostApiRouter;