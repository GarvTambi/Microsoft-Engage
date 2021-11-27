import express from "express";

import {
  addAssignment,
  checkAssignment,
  getAssignment,
  submitAssignment,
  viewSubmission,
} from "../controllers/assignments";

const router = express.Router();
router.post("/submit", submitAssignment);
router.post("/create", addAssignment);
router.get("/:courseID", getAssignment);
router.post("/view", viewSubmission);
router.post("/check", checkAssignment);

export default router;
