const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const postController = require("../controller/blog.controller");
const {checkAdmin, checkAuth} = require("../middleware/CheckPermission");


router.get("/all/:number", postController.getAllData);

router.use(checkAuth); 

router.get("/data/:blogId", postController.getDataBlog);

router.use(checkAdmin);

router.get("/data", postController.getDataWithAccount);

router.post("/",
[
  check('title').isLength({min: 6}),
  check('description').isLength({min: 6}),
  check('content').isLength({min: 6}),
  check('tag').isLength({min: 5}),
  check("images").isArray({min:0}),
  check("date").isLength({min: 5})
],postController.postBlog);

// router.delete("/deleteBlog/:id", postController.XoaBai)
router.delete("/deleteBlog", postController.XoaBai);

router.patch("/updateBlog/:idUpdate", postController.updateBlog);


module.exports = router; 


