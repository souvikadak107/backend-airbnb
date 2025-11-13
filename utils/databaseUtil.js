const { MongoClient } = require("mongodb");
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
      console.log("Connected to MongoDB Atlas");
      _db = client.db("airbnb");
      callback();
    })
    .catch(err => {
      console.error("Error while connecting to Mongo:", err);
      throw err;
    });
};

const getDB = () => {
  if (!_db) throw new Error("MongoDB not connected!");
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;