import {
  enroll,
  getSchedule,
  login,
  logout,
  resendVerify,
  resetPassword,
  sendResetPasswordEmail,
  signUp,
  testResults,
  unenroll,
  verifyMail
} from "../controllers/users";
import express from "express";
import { isAuth } from "../middleware/auth";

const router = express.Router();
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/verify", verifyMail);
router.post("/resendVerify", resendVerify);
router.post("/forgot", sendResetPasswordEmail);
router.post("/reset", resetPassword);

router.post("/:courseID", isAuth, enroll);
router.post("/unlink/:courseID", isAuth, unenroll);

router.get("/results", isAuth, testResults);
router.get("/schedule", isAuth, getSchedule);

export default router;
