const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../.env" });

const SECRET_KEY = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);
const IV = CryptoJS.enc.Utf8.parse(process.env.IV);

// Function to encrypt user data
const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

module.exports = encryptData;
