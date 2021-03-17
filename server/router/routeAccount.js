const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const accountController = require("../controller/account.controller");

router.post('/register'
,[
  check('name').isLength({min: 6, max: 30}),
  check('email').isLength({min: 8, max: 50}),
  check('password').isLength({min: 6, max: 50}),
  check('avatar').isLength({min: 6, max: 500}),
  check('phone').isLength({min: 6, max: 50}),
  check('genre').isLength({min: 1, max: 6}),
],accountController.signup);

router.post('/login',
[
  check('data').not().isEmpty().trim().escape(),
  check('password').not().isEmpty().trim().escape()
],accountController.login);
router.post("/checkAccount", accountController.checkAccount);
router.patch("/updatePassword",
[
  check("email").not().isEmpty().trim().escape(),
  check("password").not().isEmpty().isEmpty().trim().escape()
], accountController.updatePassword)
router.get("/:id", accountController.getAccount);
router.get("/ac/logout", accountController.logout);

module.exports = router;