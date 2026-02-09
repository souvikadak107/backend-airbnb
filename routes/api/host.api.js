const express = require('express');
const hostApiRouter = express.Router();

const hostApiController = require('../../controllers/hostApiController');
const auth = require('../../middleware/auth');
const hostauth = require('../../middleware/hostAuth');
const upload = require('../../middleware/upload');

function multerErrorHandler(err, req, res, next) {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large (max 2MB)" });
  }
  if (err) {
    return res.status(400).json({ error: err.message || "Upload error" });
  }
  next();
}




//Add home
hostApiRouter.get('/add-home', auth, hostauth, hostApiController.getAddHomes);

hostApiRouter.post("/add-home", auth, hostauth, upload.single("photo"), multerErrorHandler, hostApiController.postAddHomes
);


//Get host home list
hostApiRouter.get('/home-list', auth, hostauth, hostApiController.getHostHomes);


//Edit home
hostApiRouter.get('/homes/:homeId', auth, hostauth, hostApiController.getEditHomes);

hostApiRouter.patch('/homes/:homeId', auth, hostauth, hostApiController.patchEditHomes);

//edit Photo 
hostApiRouter.get("/homes/:homeId/photo", auth, hostauth, hostApiController.getPhotoPage);

hostApiRouter.patch("/homes/:homeId/photo", auth, hostauth,upload.single("photo"), hostApiController.patchPhotoPage);

//Delete home
hostApiRouter.delete('/delete-home/:homeId', auth, hostauth, hostApiController.deleteHomes);
module.exports = hostApiRouter;