const express = require("express");
const router = express.Router();
const dbAccount = require("../database/account");
const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;

let lc ;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/api/authfb/facebook/callback",
  profileFields : ['id', 'displayName', 'name', 'gender', 'email', 'photos']
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

router.get('/facebook',passport.authenticate('facebook', {scope: ["email"]}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
    async function(req, res){
      const kq = await dbAccount.findOne({email: req.user.emails[0].value}).exec();
      if(!kq){
        try {
          let newAccount = await dbAccount({
            name: req.user.displayName,
            email: req.user.emails[0].value,
            password: "no password",
            avatar: req.user.photos[0].value,
            phone: "00000000",
            genre: "ai biet",
            post: [],
          });
          await newAccount.save();
          lc = await newAccount;
          res.redirect("/")
        } catch (error) {
          res.redirect("/");
        }
      }
      else {
        if(kq.role === "admin"){
          req.session = null;
          req.logOut();
          res.redirect("/login");
        } else {
          lc = kq;
          res.redirect("/")
        }
      }
    }
  );

router.get("/logout", (req, res) => {
    lc = null;
    req.session = null;
    req.logout();
    res.redirect("/login");
  })


  router.get("/info", (req, res) => {
    if(lc) {
      return res.json({result: lc});
    }
    return res.json({message: "no data"});
  })

module.exports = router;
