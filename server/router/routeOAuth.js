const express = require("express");
const router = express.Router();
const dbAccount = require("../database/account");
const passport = require("passport");
const httpError = require("../middleware/http-error");

require("../middleware/passport-setup");
let lc ;

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {failureRedirect: "/login"}),
   async function (req, res) {
    const { name, email, picture } = req.user._json;
    //res.status(200).json({result: req.user._json})
    const ggAccount = await dbAccount.findOne({email: email}).exec();
    if(!ggAccount){
      try {
        let newAccount = await dbAccount({
          name,
          email,
          password: "no password",
          avatar: picture,
          phone: "00000000",
          genre: "ai biet",
          post: [],
        });
        await newAccount.save();
        lc = await newAccount;
        await res.redirect("/");
      } catch (error) {
        res.redirect("/");
      }
    } else {
      if(ggAccount.role === "admin"){
        req.session = null;
        req.logout();
        res.redirect("/login")
      } else {
        lc = ggAccount;
        res.redirect("/");
      }
    }
  }
);

router.get("/good", (req, res) => {
  if(lc){
    return res.json({result: lc});
  }
  return res.json({message: "No data"})
});

router.get("/failed", (req, res) => {
  return res.json({message: "Failed to login with google"})
});

router.get("/logout", (req, res) => {
  lc = null;
  req.session = null;
  req.logout();
  res.redirect("/login");
})
module.exports = router;
