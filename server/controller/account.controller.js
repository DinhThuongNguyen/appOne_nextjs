const { validationResult } = require("express-validator");
const DBaccount = require("../database/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpError = require("../middleware/http-error");
const JWT_EXPIRATION_NUM = 14 * 1000 * 60 * 60 * 8;

exports.checkAccount = async (req, res) => {
  const { email } = req.body;
  const check = await DBaccount.findOne({ email: email }).exec();
  if (check) {
    return res.json({ message: "yes" });
  }
  return res.json({ message: "no" });
};

exports.getAccount = async (req, res, next) => {
  DBaccount.findById(req.params.id).exec((err, account) => {
    if (err) {
      return next(new httpError("Can't find account", 404));
    } else {
      res.status(200).json({
        id: account._id,
        name: account.name,
        avatar: account.avatar,
        role: account.role,
      });
    }
  });
};

exports.updatePassword = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    // res.status(404).json({message: "error body"})
    return res.status(500).json({ message: "Wrong data, please try again" });
  }
  const { email, password } = req.body;

  let checkEmail = await DBaccount.findOne({ email: email }).exec();
  let hashPassword = await bcrypt.hash(password, 15);
  checkEmail.password = hashPassword;
  await checkEmail.save();

  //sendToken(result, 200, req, res);
  let token;
  try {
    token = jwt.sign(
      {
        accountId: checkEmail.id,
        role: checkEmail.role,
      },
      process.env.EXAMPLE_TOKEN,
      { expiresIn: "8h" }
    );
  } catch (error) {
    return res.status(405).json({ message: "Create token failed" });
  }
  const options = {
    expires: new Date(Date.now() + JWT_EXPIRATION_NUM),
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  };
  try {
    res.cookie("vhy", token, options);
  } catch (error) {
    return res.status(405).json({ message: "Error set cookie" });
  }

  res.status(200).json({
    name: checkEmail.name,
    role: checkEmail.role,
    avatar: checkEmail.avatar,
    accountId: checkEmail.id,
  });
};

exports.signup = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(404).json({ message: "Wrong data, please try again" });
  }
  const { name, email, password, genre, phone, avatar } = req.body;

  const checkEmail = await DBaccount.findOne({ email: email }).exec();
  const checkName = await DBaccount.findOne({ name: name }).exec();
  if (checkEmail) {
    return res
      .status(404)
      .json({
        message: "Email này đã được đăng ký, hãy đăng ký bằng email khác",
      });
  }
  if (checkName) {
    req
      .status(404)
      .json({ message: "Tên tài khoản đã có, hãy nhập một tên khác" });
  }
  let hashPassword;
  try {
    try {
      hashPassword = await bcrypt.hash(password, 15);
    } catch (error) {
      return res.status(405).json({ message: "hashPassword failed" });
    }
    const newAccount = await new DBaccount({
      name,
      email,
      password: hashPassword,
      avatar,
      phone,
      genre,
      post: [],
    });
    try {
      await newAccount.save();
    } catch (error) {
      return res.status(405).json({ message: "Register failed" });
    }

    let token;
  try {
    token = jwt.sign(
      {
        accountId: newAccount.id,
        role: newAccount.role,
      },
      process.env.EXAMPLE_TOKEN,
      { expiresIn: "8h" }
    );
  } catch (error) {
    return res.status(405).json({ message: "Create token failed" });
  }

    try {
      const options = {
        expires: new Date(Date.now() + JWT_EXPIRATION_NUM),
        secure:  false,
        httpOnly: true,
        sameSite: "lax",
        path: "/"
      };
      res.cookie("vhy", token, options);
    } catch (error) {
      return res.status(405).json({ message: "Error set cookie" });
    }

    return res.status(200).json({
      name: newAccount.name,
      role: newAccount.role,
      avatar: newAccount.avatar,
      accountId: newAccount.id,
    });
  } catch (error) {
    return res.status(405).json({ message: "Create account failed" });
  }
};

exports.login = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(404).json({ message: "Wrong data, please try again" });
  }
  const { data, password } = req.body;

  const checkEmail = await DBaccount.findOne({ email: data }).exec();
  const check_tenDangNhap = await DBaccount.findOne({ name: data }).exec();
  if (!checkEmail && !check_tenDangNhap) {
    return res.status(404).json({ message: "Tài khoản này không tồn tại" });
  }
  const result = checkEmail ? checkEmail : check_tenDangNhap;
  const checkPassword = await bcrypt.compare(password, result.password);

  if (!checkPassword) {
    return res.status(404).json({ message: "sai mật khẩu" });
  }

  let token;
  try {
    token = jwt.sign(
      {
        accountId: result.id,
        role: result.role,
      },
      process.env.EXAMPLE_TOKEN,
      { expiresIn: "8h" }
    );
  } catch (error) {
    return res.status(405).json({ message: "Create token failed" });
  }
  const options = {
    expires: new Date(Date.now() + JWT_EXPIRATION_NUM),
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  };
  try {
    res.cookie("vhy", token, options);
  } catch (error) {
    return res.status(405).json({ message: "Error set cookie" });
  }

  res.status(200).json({
    name: result.name,
    role: result.role,
    avatar: result.avatar,
    accountId: result.id,
  });
};

exports.logout = (req, res) => {
  req.session = null;
  req.logout();
  res.clearCookie("vhy", { path: "/" });
  res.redirect("/login");
};
