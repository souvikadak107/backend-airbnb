const fs = require("fs");
const cloudinary = require("../config/cloudinary");



exports.uploadImage = async (filePath) => {
  if (!filePath) throw new Error("uploadImage: filePath missing");


  if (!fs.existsSync(filePath)) {
    throw new Error(`uploadImage: file not found at path: ${filePath}`);
  }

  try {
    console.log("Uploading image to Cloudinary:", filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "homes",
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    // Cloudinary errors contain useful info
    const msg =
      err?.message ||
      err?.error?.message ||
      "Cloudinary upload failed";

    const httpCode = err?.http_code || err?.error?.http_code;

    const e = new Error(msg);
    e.http_code = httpCode;
    throw e;
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch (_) {
     
    }
  }
};

exports.deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    // Optional: handle "not found" gracefully
    // res.result can be "ok" | "not found"
    return res;
  } catch (err) {
    const msg =
      err?.message ||
      err?.error?.message ||
      "Cloudinary delete failed";

    const e = new Error(msg);
    e.http_code = err?.http_code || err?.error?.http_code;
    throw e;
  }
};