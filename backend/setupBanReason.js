const mongoose = require("mongoose");
const BanReason = require("./src/models/banReason"); // Adjust the path as needed
require("dotenv").config();

const preloadBanReasons = async () => {
  const reasons = [
    { reason: "Cheating" },
    { reason: "Using abusive language" },
    { reason: "Spamming" },
    { reason: "Fraudulent activity" },
    { reason: "Violating terms of service" },
  ];

  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("conect");
      })
      .catch((err) => {
        console.log(err.message);
      });

    for (const r of reasons) {
      const existingReason = await BanReason.findOne({ reason: r.reason });
      if (!existingReason) {
        await BanReason.create(r);
      }
    }

    console.log("Ban reasons preloaded successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error preloading ban reasons:", error);
    mongoose.connection.close();
  }
};

preloadBanReasons();
