import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ success: false, message: "invalid token" });
    }
    console.log(decode);
    req.id = decode.UserId;
    next();
  } catch (error) {
    console.log(`Error: in isAuthenticated middleware at line no 8 ${error}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuthenticated;
