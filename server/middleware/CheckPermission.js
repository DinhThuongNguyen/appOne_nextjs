// const httpError = require("../middleware/http-error");
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token;
  if (req.cookies) token = req.cookies.vhy;
  if (!token || token === "expiredtoken") {
    return res.status(500).json({message: "Chua dang nhap"})
  }
  const decodedToken = jwt.verify(token, process.env.EXAMPLE_TOKEN);

  req.account = { accountId: decodedToken.accountId };
  req.permission = { role: decodedToken.role };
  next();
};

const checkAdmin = async (req, res, next) => {
  try {
    const role = req.permission.role;
    if (!role || role === "user") {
      return res.status(500).json({message: "Not admin"});
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({message: "Server issue !"})
  }
};

module.exports = {
  checkAuth,
  checkAdmin,
};
