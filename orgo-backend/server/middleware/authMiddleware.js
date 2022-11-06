import jwt from "jsonwebtoken";
import asyncHadler from "express-async-handler";
import User from "../models/userModel.js";
import Community from "../models/communityModel.js";

const protect = asyncHadler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized , token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

//Check if the user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an admin");
  }
};

//Check if the user is community
const community = async(req, res, next) => {
  const com = await Community.find({$or:[{createdBy:req.user._id},{"members.userId":req.user._id}]});
  if (com.length>0 || req?.user?.role==="admin") {
    next();
  }else{
    res.status(401);
    throw new Error("Not Authorized as a community");
  }
  
};

export { protect, admin, community };
