import express from "express";
import {
  login,
  register,
  updateProfile,
} from "../controller/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/update/profile", isAuthenticated, updateProfile);

export default router;
