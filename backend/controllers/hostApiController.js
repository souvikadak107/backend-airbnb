const User = require("../models/user");
const Home = require("../models/home");
const Booking = require("../models/booking");
const { uploadImage } = require("../services/imageUpload");
const mongoose = require("mongoose");

exports.getAddHomes = (req, res) => {
  res.status(200).json({
    message: "Add Home API endpoint"
  });
}


exports.postAddHomes = async (req, res) => {


  try {
    const { houseName, price, location, rating, description } = req.body;


    if (!houseName || !price || !location || !rating || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Home photo is required" });
    }

    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const image = await uploadImage(req.file.path);
    console.log("Uploaded image:", image.public_id, image.url);
    const home = new Home({
      houseName,
      price,
      location,
      rating,
      description,
      photo: image.url,
      photoPublicId: image.public_id,
      owner: req.user._id
    });

    await home.save();

    return res.status(201).json({
      message: "Home added successfully",
      homeId: home._id
    }); 
  }
  catch (err) {
    console.error("postAddHomes error:", err);
    return res.status(500).json({
      error: "Failed to add home",
      details: err.message
    });
  }
}

exports.getHostHomes = async (req, res) => {

  try {
    const hostid = req.user._id;
    const homes =  await Home.find({ owner: hostid });
    return res.status(200).json({
      homes: homes,
      count : homes.length
    });
  } catch (err) {
    console.error("getHostHomes error:", err);
    return res.status(500).json({
      error: "Failed to retrieve homes",
      details: err.message
    });
  } 

}

exports.getEditHomes = async (req, res) => {

  try { 
    const hostId = req.user._id;
    const homeId = req.params.homeId;
    const home = await Home.findById({ owner: hostId, _id: homeId });

    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    return res.status(200).json({
      home: home
    });
  } catch (err) {
    console.error("getEditHomes error:", err);
    return res.status(500).json({
      error: "Failed to retrieve home details",
      details: err.message
    });
  } 
}

exports.patchEditHomes = async (req, res) => {

  try{
    const hostId = req.user._id;
    const homeId = req.params.homeId;
    const home = await Home.findById({ owner: hostId, _id: homeId });
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    const fields = ["houseName", "price", "location", "rating", "description"];
    let changes= false;
    for(const field of fields){
      if(req.body[field] != undefined && req.body[field] !== home[field]){
        home[field] = req.body[field];
        changes= true;
      }
    }
    if(!changes){
      return res.status(204).json({ message: "No changes detected" });
    }

    await home.save();

    return res.status(200).json({
      message: "Home updated successfully",
      home: home
    });
  } catch (err) {
    console.error("patchEditHomes error:", err);
    return res.status(500).json({
      error: "Failed to update home details",
      details: err.message
    });
  }
}

exports.deleteHomes = async (req, res) => {

  try {
    const hostId = req.user._id;
    const homeId = req.params.homeId;

    const home = await Home.findById({ owner: hostId, _id: homeId });
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    await deleteImage(home.photoPublicId);
    await Home.deleteOne({ _id: homeId });

    return res.status(200).json({
      message: "Home deleted successfully"
    });
  } catch (err) {
    console.error("deleteHome error:", err);
    return res.status(500).json({
      error: "Failed to delete home",
      details: err.message
    });
  } 
} 


exports.getPhotoPage = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const hostId = req.user._id;
    const home = await Home.findById({ owner: hostId, _id: homeId });
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    return res.status(200).json({
      home: home,
      photoPath: home.photo
    });
  } catch (err) {
    console.error("getPhotoPage error:", err);
    return res.status(500).json({
      error: "Failed to retrieve home photo",
      details: err.message
    });
  } 
} 

exports.patchPhotoPage = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const hostId = req.user._id;
    const home = await Home.findById({ owner: hostId, _id: homeId });
    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "New photo file is required" });
    }


    await deleteImage(home.photoPublicId);
    const image = await uploadImage(req.file.path);

    home.photo = image.url;
    home.photoPublicId = image.public_id;
    await home.save();

    return res.status(200).json({
      message: "Home photo updated successfully",
      photoPath: home.photo,
      home: home  
    });
  } catch (err) {
    console.error("patchPhotoPage error:", err);
    return res.status(500).json({
      error: "Failed to update home photo",
      details: err.message
    });
  } 
}