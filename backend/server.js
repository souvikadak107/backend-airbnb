require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoose");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on PORT:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

start();