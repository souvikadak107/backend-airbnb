const exprss = require('express');
const storeApiRouter = exprss.Router();

const storeApiController = require('../../controllers/storeApiController');
const auth = require('../../middleware/auth');

storeApiRouter.get('/', storeApiController.getIndex);

storeApiRouter.get('/homes', auth, storeApiController.getHomes);

storeApiRouter.get('/homes/:homeId', auth, storeApiController.getHomeDetails);


storeApiRouter.get('/favourites', auth, storeApiController.getFavorites);
storeApiRouter.post('/favourites/:homeId', auth, storeApiController.postAddToFavorites);

storeApiRouter.delete('/favourites/:homeId', auth, storeApiController.removeFromFavorites);




storeApiRouter.get('/booking', auth, storeApiController.getBookings);
storeApiRouter.get('/homes/:homeId/booking', auth, storeApiController.getCreateBooking);

storeApiRouter.post('/homes/:homeId/booking',  auth, storeApiController.postCreateBooking);

storeApiRouter.delete('/booking/:bookingId/cancel', auth, storeApiController.postCancelBooking);


module.exports = storeApiRouter;