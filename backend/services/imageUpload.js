const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function normalizeCloudinaryError(err) {
  const http_code = err?.http_code ?? err?.error?.http_code;
  const message =
    err?.message ||
    err?.error?.message ||
    err?.error?.toString?.() ||
    "Cloudinary upload failed";

  return { message, http_code, raw: err };
}

exports.uploadImageBuffer = async (buffer, opts = {}) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("uploadImageBuffer: buffer missing/invalid");
  }

  const MAX_TRIES = 3;
  const TIMEOUT_MS = opts.timeoutMs ?? 120000;

  let lastErr;

  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      console.log(`Cloudinary upload_stream (try ${attempt}/${MAX_TRIES})`);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: opts.folder ?? "homes",
            resource_type: "image",
            timeout: TIMEOUT_MS,
          },
          (err, res) => (err ? reject(err) : resolve(res))
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (err) {
      lastErr = err;
      const info = normalizeCloudinaryError(err);

      console.error(`Cloudinary raw error (try ${attempt}):`, {
        message: info.message,
        http_code: info.http_code,
        code: err?.code,
        errno: err?.errno,
        syscall: err?.syscall,
      });

      // Only retry on transient network-ish errors
      const transientCodes = new Set(["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN"]);
      if (attempt < MAX_TRIES && transientCodes.has(err?.code)) {
        await sleep(1500 * attempt); // 1.5s, 3s, 4.5s
        continue;
      }

      const e = new Error(info.message);
      e.http_code = info.http_code;
      throw e;
    }
  }

  const info = normalizeCloudinaryError(lastErr);
  const e = new Error(info.message || "Cloudinary upload failed after retries");
  e.http_code = info.http_code;
  throw e;
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