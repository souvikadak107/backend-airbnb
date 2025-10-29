const Home = require("../models/home");

exports.getAddHome = (req, res, next) => {
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) =>
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
    })
  );
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, photoUrl } = req.body;
  const home = new Home(houseName, price, location, rating, photoUrl);
  home.save();

  res.render("host/home-added", {
    pageTitle: "Home Added Successfully",
    currentPage: "homeAdded",
  });
};

exports.postDeleteHome=(req, res, next) => {
  const homeId= req.body.id;
  console.log("try to delete", homeId);
  Home.deleteHome(homeId,(err)=>{
    if(err){
      console.log("failed to write");
    }
    console.log("delete successfully");
    res.redirect("/host/host-home-list")
  })
  
};


exports.getEditHomes=(req, res, next)=>{
  const homeId= req.params.homeid;
  console.log("i try to edit this home", homeId);
  Home.findById(homeId, home=>{
    if(!home){
      console.log("no home");
      res.redirect("/homes");
    }
    else{
      
      res.render("host/edit-home", {
        home:home,
        pageTitle: "edit Details",
        currentPage: "edit-details",
      })
    }
  })
}