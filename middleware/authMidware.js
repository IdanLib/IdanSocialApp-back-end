import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let userToken = req.header("Authorization");
  if (!userToken) {
    return res.status(403).json({ message: "Access denied." });
  }

  //if token exists and in valid format
  if (userToken.startsWith("Bearer ")) {
    userToken = userToken.slice(userToken.search(" ") + 1).trimLeft();
  }

  //mount this middleware before any route that you want to authorize
  const verified = jwt.verify(userToken, process.env.JWT_SECRET);

  req.user = verified;
  next();
};
