import { Request, Response } from "express";
import Course from "../models/Course";
import User from "../models/User";


export const getCourses = async (req: Request, res: Response) => {
  User.findById(res.locals.id)
    .select("courses -_id")
    .populate({
      path: "courses",
      select: "name professor",
      populate: { path: "professor", model: "User", select: "name -_id" },
    })
    .exec((e, courses) => {
      if (e) {
        console.log(e);
        return res.json({ error: "Fetching Course Error" });
      } else if (courses?.courses.length == 0)
        return res.json({ error: "No courses linked" });
      else return res.json(courses);
    });
};

export const addCourse = async (req: Request, res: Response) => {
  const { name, schedule } = req.body;

  if (!res.locals.isStudent) {
    Course.create(
      { name, professor: res.locals.id, schedule },
      (err, course) => {
        if (err) {
          console.log(err);
          return res.json({ error: "Create Course Error" });
        }

        User.findByIdAndUpdate(
          res.locals.id,
          { $push: { courses: course._id } },
          (e) => {
            if (e) {
              console.log(e);
              return res.json({ error: "Create Course Error" });
            } else return res.json({ courseID: course._id });
          }
        );
      }
    );
  } else return res.json({ error: "UNAUTHORIZED" });
};

export const getCourseTests = async (req: Request, res: Response) => {
  if (!res.locals.isStudent) {
    try {
      const results = await Course.find({
        $and: [
          { professor: res.locals.id },
          { tests: { $exists: true, $not: { $size: 0 } } },
        ],
      })
        .select("name tests")
        .populate("tests", "title maxMarks questions");

      return res.json(results);
    } catch (e) {
      return res.json({ error: "Couldn't fetch tests" });
    }
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};
