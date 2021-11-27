import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Users from "../models/User";
import Courses, { TestModel } from "../models/Course";

export const createTest = async (req: Request, res: Response) => {
  if (!res.locals.isStudent) {
    const { title, startTime, endTime, maxMarks, questions } = req.body;
    if (isValidObjectId(req.params.courseId)) {
      const course = await Courses.findById(req.params.courseId);
      if (course) {
        try {
          const test = new TestModel({
            title,
            startTime,
            endTime,
            maxMarks,
            questions,
          });
          await test.save();

          course.tests.push(test._id);
          await course.save();
          return res.json({ message: "Test created" });
        } catch (e) {
          return res.json({
            error: "Something went wrong, couldn't create course",
          });
        }
      } else return res.json({ error: "Course not found" });
    } else return res.json({ error: "Invalid Course ID" });
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};

export const viewTest = async (req: Request, res: Response) => {
  if (res.locals.isStudent) {
    const test = await TestModel.findById(req.params.testId);
    if (test) {
      const date = new Date();
      if (date >= test.startTime && date <= test.endTime) {
        const testQuestions = test.questions.map((question) => ({
          title: question.title,
          opt1: question.opt1,
          opt2: question.opt2,
          opt3: question.opt3,
          opt4: question.opt4,
        }));

        return res.json({
          startTime: test.startTime,
          endTime: test.endTime,
          questions: testQuestions,
        });
      } else
        return res.json({ error: "You cannot view the test at this time" });
    } else return res.json({ error: "Test not found" });
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};

export const submitTest = async (req: Request, res: Response) => {
  if (res.locals.isStudent) {
    const test = await TestModel.findById(req.params.testId);
    if (test) {
      const date = new Date();
      if (date >= test.startTime && date <= test.endTime) {
        const user = await Users.findById(res.locals.id);
        if (user) {
          if (
            !user.testSubmissions
              .map((submission) => submission.test)
              .includes(test._id)
          ) {
            try {
              const { answers } = req.body;
              let count = 0;
              if (answers.length == test.questions.length) {
                for (let i = 0; i < test.questions.length; i++) {
                  if (answers[i] !== "") {
                    count += Number(answers[i] == test.questions[i].answer);
                  }
                }
                const marks = (count / test.questions.length) * test.maxMarks;
                user.testSubmissions.push({ test: test._id, marks });
                await user.save();
                return res.json({
                  message: `You have scored ${marks} out of ${test.maxMarks}`,
                });
              }
              return res.json({ error: "Invalid answers list" });
            } catch (err) {
              return res.json({ error: `Couldn't submit test: ${err}` });
            }
          } else
            return res.json({
              error: "You have already submitted a response for this test",
            });
        } else return res.json({ error: "User not found" });
      } else
        return res.json({ error: "You cannot submit the test at this time" });
    } else return res.json({ error: "Test not found" });
  } else
    return res.json({ error: "You must be a student to perform this action" });
};

export const viewResults = async (req: Request, res: Response) => {
  if (!res.locals.isStudent) {
    const { professor } = await Courses.findById(req.params.courseId);
    if (professor?._id.equals(res.locals.id)) {
      const test = await TestModel.findById(req.params.testId).select("_id");
      if (test) {
        try {
          const results = await Users.aggregate([
            {
              $match: {
                testSubmissions: {
                  $elemMatch: { test: { $eq: test._id } },
                },
              },
            },
            { $project: { _id: 0, name: 1, testSubmissions: 1 } },
            { $unwind: "$testSubmissions" },
            { $match: { "testSubmissions.test": test._id } },
            { $project: { "testSubmissions.test": 0 } },
            { $sort: { "testSubmissions.marks": -1 } },
          ]);

          return res.json(results);
        } catch (err) {
          return res.json({ error: "Couldn't fetch test results" });
        }
      } else return res.json({ error: "Test not found" });
    } else
      return res.json({ error: "You are not the teacher for this course" });
  } else
    return res.json({ error: "You must be a teacher to perform this action" });
};
