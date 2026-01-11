const Home = require("../models/home");
const fs = require('fs');
const path = require('path');

exports.getAddHome = (req, res, next) => {
   if (!req.session.user) return res.redirect("/login");
   if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
   }
  res.render("host/addHome", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.getEditHome = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  
  
   if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
   }

  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';
  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
  }
  Home.find().then(registeredHomes => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    })
  });
};

exports.postAddHome = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
  }


  const { houseName, price, location, rating, description } = req.body;

  if(!req.file){
    console.log('No file uploaded');
    return res.redirect("/host/add-home");
  }

  const home = new Home({houseName, price, location, rating, description});
  home.photo= req.file.path;

  home.save().then(() => {
    console.log('Home Saved successfully');
    res.redirect("/host/host-home-list");
  });

  
};

exports.postEditHome = (req, res, next) => {
  //const temp= req.params.homeId;
  //console.log(req.method);
  if (!req.session.user) return res.redirect("/login");
  if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
  }
  
  const { _id, houseName, price, location,  rating, description } = req.body;
  
  

  Home.findById(_id).then((home)=>{
    home.houseName=houseName;
    home.price=price;
    home.location=location;
    home.rating=rating;
    home.description=description;

    if(req.file){
      fs.unlink(home.photo, (err)=>{
        if(err){
          console.log("error while deleting old photo", err);
        }
      });
      home.photo= req.file.path;
    }
    

    home.save().then(result => {
      console.log('Home updated ', result);
    })
    .catch( err=>{
      console.log("error while editing home", err);
    })
    res.redirect("/host/host-home-list");

  })
  .catch(err=>{
    console.log("error while finding home", err);
    
  })
  
};

exports.postDeleteHome = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  if(req.session.user.usertype !== 'host'){
     return res.redirect("/");
  }
  const homeId = req.params.homeId;
  console.log('Came to delete ', homeId);
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  })
};
