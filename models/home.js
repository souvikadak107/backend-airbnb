// Core Modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");


const homeDataPath = path.join(rootDir, "data", "homes.json");


module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
  }

  

  save() {
    this.id= Math.random().toString();
    Home.fetchAll((registeredHomes) => {
      registeredHomes.push(this);
      fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
        console.log("File Writing Concluded", error);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }

  static findById(homeId, callback){
    this.fetchAll(homes=>{
      callback(homes.find(home=> home.id==homeId));
    })
  }

  static deleteHome(homeId, callback){
    Home.fetchAll((homes)=>{
      const updatedHomeList= homes.filter(home=> home.id!=homeId)
      fs.writeFile(homeDataPath, JSON.stringify(updatedHomeList),(err)=>{
        if(err){
          callback("write fail")
        }
        else{
          callback(null);
        }
      })

    })
  }




};
