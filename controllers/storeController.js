const Favourite = require("../models/favourites");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) =>
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
    })
  );
};

exports.getHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) =>
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
    })
  );
};

exports.getHomeDetails = (req, res, next) => {
  const homdId= req.params.homeId
  console.log(homdId);
  Home.findById(homdId, home=>{
    if(!home){
      console.log("no home");
      res.redirect("/homes");
    }
    else{
      console.log(home);
      res.render("store/home-detail", {
        home:home,
        pageTitle: "Homes Details",
        currentPage: "Home-details",
      })
    }
  })

};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
  })
};

exports.getFavouriteList = (req, res, next) => {
  Favourite.getFavourites(favourites => {
    Home.fetchAll(registeredHomes => {
      const favSet = new Set(favourites.map(String));
      const favouriteHomes = registeredHomes.filter(home =>
        favSet.has(String(home.id))
      );

      res.render("store/favourite-list", {
        favouriteHomes,
        pageTitle: "My Favourites",
        currentPage: "favourites",
      });
    });
  });
};


exports.postAddToFavourite = (req, res, next) => {
  const homeId = req.body.id;
  Favourite.addToFavourite(homeId, err => {
    if (err) {
      console.log("Error while marking favourite:", err);
    }
    res.redirect("/favourites");
  });
};

exports.postRemoveToFavourite=(req, res, next) => {
  const homeId = req.body.id;
  console.log("try to remove", homeId);
  Favourite.deleteFavourites(homeId,(err)=>{
    if (err) {
      console.log(err);
    }
    res.redirect("/favourites");
  });
};

