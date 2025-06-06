import CryptoJS from "crypto-js";

// Convert environment variables correctly
const SECRET_KEY = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_SECRET_KEY);
const IV = CryptoJS.enc.Utf8.parse(import.meta.env.VITE_IV);

const DecryptData = (encryptedData) => {
  try {
    // Perform AES decryption
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert bytes to readable string
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error("Decryption failed or invalid data");

    return JSON.parse(decryptedText); // Convert decrypted string to object
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};

export default DecryptData;
