import { addCourse, getCourses, getCourseTests } from "../controllers/courses";
import express from "express";

const router = express.Router();
router.get("/", getCourses);
router.post("/create", addCourse);
router.get("/tests", getCourseTests);

export default router;
