import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controller/company.controller.js";
const router = express.Router();

router.post("/register", isAuthenticated, registerCompany);
router.get("/", isAuthenticated, getCompany);
router.post("/update/:id", isAuthenticated, updateCompany);
router.get("/get/:id", isAuthenticated, getCompanyById);

export default router;
