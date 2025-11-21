
//const home = require("../models/home");
const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  //  to check the session value->
   // console.log('Session value', req.session);

  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.getFavouriteList = (req, res, next) => {
  const userId= req.session.user._id;

  const user = User.findById(userId).populate('favourites').then(user => {
    const favouriteHomes = user.favourites;
    res.render("store/favourite-list", {
      favouriteHomes: favouriteHomes,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.postAddToFavourite = (req, res, next) => {
  console.log("came to add to favourite", req.body);
  const homeId = req.body.id;
  const userId = req.session.user._id;

  User.findById(userId).then(user => {
    const alreadyFavourite = user.favourites.find(favHomeId => favHomeId.toString() === homeId);
    if (alreadyFavourite) {
      console.log("Home already in favourites");
      return res.redirect('/favourites');
    }
    user.favourites.push(homeId);
    return user.save().then(() => {
      console.log("Home added to favourites");
      res.redirect('/favourites');
    }); 
  })
}



exports.postRemoveFromFavourite = (req, res, next) => {
  //console.log(req.params);
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  User.findById(userId).then(user => {
    user.favourites = user.favourites.filter(favHomeId => favHomeId.toString() !== homeId);
    return user.save().then(() => {
      console.log("Home removed from favourites");
      res.redirect('/favourites');
    });
  });   
}


exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
      });
    }
  });
};
