const express = require('express');
const router = express.Router();
const loadDataController = require("../controller/getData.controller");


router.get("/:genres/all?", loadDataController.loaitin);
router.get("/page/:idPage", loadDataController.getCategories);
router.get("/getmostview", loadDataController.getMostView);
router.get("/:blogId", loadDataController.getContentBlog);
router.patch("/viewUpdate/", loadDataController.mostView)

module.exports = router;  