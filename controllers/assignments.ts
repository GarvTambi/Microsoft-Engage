import { Request, Response } from "express";
import fs from "fs";
import User from "../models/User";
import Course, { AssignmentModel } from "../models/Course";
import { Types } from "mongoose";
import { google } from "googleapis";


export const submitAssignment = async (req: Request, res: Response) => {
  const { assignment } = req.body;
  const marks: number = -1;
  if (res.locals.isStudent) {
    const asg = await AssignmentModel.findById(assignment);
    if (asg) {
      const user = await User.findById(res.locals.id);
      if (
        !user.assignmentSubmissions
          ?.map((submission) => submission.assignment)
          .includes(assignment)
      ) {
        if (new Date() <= asg.dueDate) {
          try {
            const auth = new google.auth.OAuth2({
              clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
              redirectUri: "https://developers.google.com/oauthplayground",
            });
            auth.setCredentials({
              refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
            });
            const driveService = google.drive({ version: "v3", auth });

            let fileMetadata = {
              name: req.file.originalname,
              parents: [process.env.UPLOAD_FOLDER],
            };

            let media = {
              mimeType: req.file.mimetype,
              body: fs.createReadStream(req.file.path),
            };

            const response = await driveService.files.create({
              requestBody: fileMetadata,
              media,
              fields: "id",
            });

            if (response.status == 200) {
              user.assignmentSubmissions.push({ assignment, marks, link: response.data.id });
              await user.save();
              return res.json({ message: "Assignment submitted successfully" });
            }
            return res.json({ message: "Couldn't submit assignment" });
          } catch (err) {
            return res.json({ error: `Couldn't submit assignment: ${err}` });
          }
        } else
          return res.json({
            error: "The time for submitting the assignment has closed",
          });
      } else
        return res.json({
          error: "You have already submitted this assignment",
        });
    } else return res.json({ error: "Assignment not found" });
  } else
    return res.json({ error: "You must be a student to perform this action" });
};

export const addAssignment = async (req: Request, res: Response) => {
  const { courseID, title, maxMarks, description, dueDate } = req.body;

  if (!res.locals.isStudent) {
    const course = await Course.findById(courseID);
    if (course) {
      try {
        const assignment = new AssignmentModel({
          title,
          maxMarks,
          description,
          dueDate,
        });
        await assignment.save();

        course.assignments.push(assignment._id);
        await course.save();
        return res.json({ message: "Assignment created Successfully" });
      } catch (err) {
        return res.json({ error: `Couldn't create assignment` });
      }
    } else return res.json({ error: "Course not found" });
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const results = await Course.findById(req.params.courseID)
      .select("assignments")
      .populate("assignments", "-__v");

    if (results.assignments.length === 0)
      return res.json({ error: "No assignments found for the given course" });
    else return res.json(results.assignments);
  } catch (err) {
    return res.json({ error: "Assignment Fetch Error" });
  }
};

export const viewSubmission = async (req: Request, res: Response) => {
  const { courseID, assignmentID } = req.body;

  if (!res.locals.isStudent) {
    const { professor } = await Course.findById(courseID).select("professor");
    if (professor?.equals(res.locals.id)) {
      try {
        const assignment = Types.ObjectId(assignmentID);
        const submissions = await User.aggregate([
          {
            $match: {
              assignmentSubmissions: {
                $elemMatch: { assignment: { $eq: assignment } },
              },
            },
          },
          { $project: { name: 1, assignmentSubmissions: 1 } },
          { $unwind: "$assignmentSubmissions" },
          { $match: { "assignmentSubmissions.assignment": assignment } },
        ]);

        return res.json(submissions);
      } catch (e) {
        return res.json({ error: "Couldn't fetch assignments" });
      }
    } else
      return res.json({ error: "You are not the teacher for this course" });
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};

export const checkAssignment = async (req: Request, res: Response) => {
  const { assignmentId, userId, marks } = req.body;

  if (!res.locals.isStudent) {
    try {
      const { maxMarks } = await AssignmentModel.findById(assignmentId);
      if (maxMarks) {
        const user = await User.findById(userId);
        if (user) {
          if (marks >= 0 && marks <= maxMarks) {
            const index = user
              .assignmentSubmissions?.
              map((submission) => submission.assignment)
              .findIndex(assignmentId);
            if (index != -1) {
              user.assignmentSubmissions[index].marks = marks;
              await user.save();
              return res.json({ message: "Marks submitted successfully" });
            }
            return res.json({ error: "Assignment submission not found for the given user" });
          }
          return res.json({ error: "Marks out of bounds" });
        }
        return res.json({ error: "User not found" });
      }
      return res.json({ error: "Assignment not found" });
    } catch (err) {
      return res.json({ error: `Couldn't submit marks: ${err}` });
    }
  }
  else return res.json({ error: "You must be a teacher to perform this action" });
}