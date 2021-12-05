const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    console.log(req.cookies)
  const token =
  req.cookies.token ||
  req.body.token ||
  req.header("Authorization").replace("Bearer ", "")

  if (!token) {
    res.status(404).send("token is missing");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET);
    console.log(decode);
    // here decode is noting but a the payload form the jwt token in our case it is user so we can perform DB operations also
    req.user = decode;
  } catch (error) {
    return res.status(401).send("invalid token");
  }
  next();
};

module.exports = auth;
