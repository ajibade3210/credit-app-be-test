import express from "express";
import { verifyToken } from "../middleware/auth";
import { signIn, signOut, validateToken, signUp } from "../controllers/auth";
import {
  loginValidation,
  registerValidation,
  validate,
} from "../utils/validation";

const router = express.Router();

router.post("/sign-in", loginValidation(), validate, signIn);

router.get("/validate-token", verifyToken, validateToken);

router.post("/sign-out", signOut);

router.post("/sign-up", registerValidation(), validate, signUp);

export default router;
