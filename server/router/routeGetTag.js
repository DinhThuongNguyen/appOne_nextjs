const express = require('express');
const router = express.Router();
const tagController = require("../controller/getTag.controller");

router.get("/", tagController.getTag);
router.get("/newsFeed", tagController.newsFeed);
router.get("/listNews", tagController.tintuc);

module.exports = router;