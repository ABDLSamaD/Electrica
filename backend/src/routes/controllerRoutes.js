const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.post("/create-review", controller.createReview);
router.get("/get-reviews", controller.getReviews);
router.put("/like-review/:id", controller.likeReview);

module.exports = router;
