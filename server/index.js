// const { createServer } = require("http");
// const { parse } = require("url");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const routeImage = require("./router/routeImage");
const routeAccount = require("./router/routeAccount");
const routeBlog = require("./router/routeBlog");
const routeOAuth = require("./router/routeOAuth");
const routeFacebook = require('./router/routeFacebook');
const routeLoadData = require("./router/routeGetData");
const routeGetTag = require("./router/routeGetTag");

app.prepare().then(() => {
  const server = express();

  //server.disable( 'x-powered-by' );
  server.use(cors());
  server.use(cookieParser());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(
    cookieSession({
      name: "oauth_01",
      keys: ["hey1", "key2"],
    })
  );

  
  server.use("/api/loadData", routeLoadData);
  server.use("/api/image", routeImage);
  server.use("/api/account", routeAccount);
  server.use("/api/blog", routeBlog);
  server.use("/api/auth", routeOAuth);
  server.use("/api/authfb", routeFacebook);
  server.use("/api/getTag", routeGetTag);

  // server.get("*", (req, res) => {
  //   return handle(req, res);
  // });

  //có thể đóng comment lai đoạn code trên thì url vẫn chạy bình thường

  

  const PORT = process.env.PORT || 3000;

  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      server.use(handle).listen(PORT, (err) => {
        if (err) throw err;
        console.log("> Ready on port " + PORT);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
