const express = require("express");
const router = express.Router();

const imageController = require("../controller/image.Controller");
const imageUpload = require("../middleware/imageUpload");

router.post("/", imageUpload.single("image"), imageController.postImage)

module.exports = router;