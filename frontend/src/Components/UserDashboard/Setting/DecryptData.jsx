import CryptoJS from "crypto-js";

// Only parse secret key/iv if provided and not the literal string 'undefined'
const rawKey = import.meta.env.VITE_SECRET_KEY;
const rawIv = import.meta.env.VITE_IV;
const hasCryptoKeys = rawKey && rawIv && rawKey !== "undefined" && rawIv !== "undefined";
const SECRET_KEY = hasCryptoKeys ? CryptoJS.enc.Utf8.parse(rawKey) : null;
const IV = hasCryptoKeys ? CryptoJS.enc.Utf8.parse(rawIv) : null;

const DecryptData = (encryptedData) => {
  try {
    // If data is already an object (unlikely), return directly
    if (typeof encryptedData !== "string") return encryptedData;

    // If no crypto keys are provided, try parsing as JSON (data may be unencrypted)
    if (!hasCryptoKeys) {
      try {
        return JSON.parse(encryptedData);
      } catch (e) {
        console.error("DecryptData: no SECRET_KEY and data is not JSON");
        return null;
      }
    }

    // Perform AES decryption
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert bytes to readable string
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      // If decryption produced empty string, maybe data was plain JSON
      try {
        return JSON.parse(encryptedData);
      } catch (e) {
        throw new Error("Decryption failed or invalid data");
      }
    }

    return JSON.parse(decryptedText); // Convert decrypted string to object
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};

export default DecryptData;
