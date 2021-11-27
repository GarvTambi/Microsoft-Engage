import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { signToken } from "../utils/signToken";
import User from "../models/User";
import sendMail from "../utils/sendMail";

export const signUp = async (req: Request, res: Response) => {
  if (!req.cookies?.token) {
    const { name, email, password, isStudent, tokenId } = req.body;
    const exists = await User.findOne({ email }).select("_id");
    if (!exists) {
      if (!tokenId) {
        try {
          const hash = await bcrypt.hash(password, 10);
          const user = new User({
            email,
            name,
            password: hash,
            isStudent,
            verified: true,
          });
          await user.save();
          const token = signToken(
            { id: user._id },
            process.env.VERIFY_TOKEN_SECRET
          );
          await sendMail(
            email,
            "Verify your email",
            `Hello ${name}, Click this to verify your email: http://localhost:3000/verify?t=${token}`,
            `Hello ${name}, <p>Click this to verify your email: <a href="http://localhost:3000/verify?t=${token}">Verify Your Email</a></p>`
          );
          return res.json({
            id: user._id,
            message: "Verify your email",
            isStudent,
          });
        } catch (err) {
          return res.json({ error: `Couldn't sign you up: ${err}` });
        }
      } else {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        try {
          const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.CLIENT_ID,
          });

          const { email: t_mail, name: t_name, sub } = ticket.getPayload();
          const user = new User({
            email: t_mail,
            name: t_name,
            googleId: sub,
            isStudent,
            verified: true,
          });
          await user.save();
          const token = signToken({ id: user._id, name: t_name, isStudent });
          const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires,
          });

          return res.json({
            id: user._id,
            name: t_name,
            isStudent,
            message: "Successfully signed up",
          });
        } catch (e) {
          return res.json({ error: "Error occurred in Google Sign-up" });
        }
      }
    } else return res.json({ error: "User already exists" });
  } else return res.json({ message: "You are already logged in" });
};

export const login = async (req: Request, res: Response) => {
  if (!req.cookies?.token) {
    const { email, password, tokenId } = req.body;
    if (email && (password || tokenId)) {
      const user = await User.findOne({ email }).select(
        "name isStudent password verified"
      );

      if (user) {
        const { _id: id, name, isStudent } = user;
        if (tokenId) {
          const client = new OAuth2Client(process.env.CLIENT_ID);
          try {
            await client.verifyIdToken({
              idToken: tokenId,
              audience: process.env.CLIENT_ID,
            });

            const token = signToken({ id, name, isStudent });
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires,
            });

            return res.json({ id, name, isStudent });
          } catch (e) {
            console.log(e);
            return res.json({ error: "Error occurred in Google Sign-in" });
          }
        } else {
          if (user.verified) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              const token = signToken({ id, name, isStudent });
              const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
              res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires,
              });
              return res.json({ id, name, isStudent, message: "Logged in" });
            }
            return res.json({ error: "Incorrect credentials" });
          } else {
            return res.json({ error: "Your email is not verified" });
          }
        }
      } else return res.json({ error: "User not found" });
    } else return res.json({ error: "Incorrect credentials" });
  } else return res.json({ message: "You are already logged in" });
};

export const resendVerify = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (!user.verified) {
      try {
        const token = signToken(
          { id: user._id },
          process.env.VERIFY_TOKEN_SECRET
        );
        await sendMail(
          email,
          "Verify your email",
          `Hello ${user.name}, Click this to verify your email: http://localhost:3000/verify?t=${token}`,
          `Hello ${user.name}, <p>Click this to verify your email: <a href="http://localhost:3000/verify?t=${token}">Verify Your Email</a></p>`
        );
        return res.json({
          id: user._id,
          message: "Verify your email",
          isStudent: user.isStudent,
        });
      } catch (err) {
        return res.json({ error: `Couldn't resend verify email: ${err}` });
      }
    } else {
      return res.json({ message: "Your email is already verified" });
    }
  } else return res.json({ error: "User not found" });
};

export const verifyMail = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    type Token = { id: string };
    const { id } = jwt.verify(token, process.env.VERIFY_TOKEN_SECRET) as Token;
    const user = await User.findById(id);
    if (user) {
      if (!user.verified) {
        user.verified = true;
        await user.save();
        return res.json({ message: "Verified email successfully" });
      }
      return res.json({ message: "Your email has already been verified" });
    }
    return res.json({ message: "User not found" });
  } catch (err) {
    return res.json({ message: `Couldn't verify email: ${err}` });
  }
};

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (!user.googleId) {
      try {
        const token = signToken(
          { id: user._id },
          process.env.RESET_PASSWORD_SECRET
        );
        await sendMail(
          email,
          "Reset your password",
          `Hello ${user.name}, Click this to reset your password: http://localhost:3000/reset?t=${token}`,
          `Hello ${user.name}, <p>Click this to reset your password: <a href="http://localhost:3000/reset?t=${token}">Reset your password</a></p>`,
        );
        return res.json({
          id: user._id,
          message: "Reset password mail sent",
          isStudent: user.isStudent,
        });
      } catch (err) {
        return res.json({
          error: `Couldn't send reset password email: ${err}`,
        });
      }
    } else {
      return res.json({
        error:
          "Google users cannot reset their password. Sign in with Google instead",
      });
    }
  } else return res.json({ error: "User not found" });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    type Token = { id: string };
    const { id } = jwt.verify(token, process.env.RESET_PASSWORD_SECRET) as Token;
    const user = await User.findById(id);
    if (user) {
      if (!user.googleId) {
        try {
          const hash = await bcrypt.hash(newPassword, 10);
          user.password = hash;
          await user.save();
          res.clearCookie("token");
          return res.json({ message: "Changed password successfully" });
        } catch (err) {
          return res.json({ error: `Couldn't reset password: ${err}` });
        }
      } else {
        return res.json({
          error:
            "Google users cannot reset their password. Sign in with Google instead",
        });
      }
    }
    return res.json({ message: "User not found" });
  } catch (err) {
    return res.json({ message: `Couldn't verify email: ${err}` });
  }
};

export const logout = async (req: Request, res: Response) => {
  if (req.cookies?.token) {
    res.clearCookie("token");
    return res.json({ message: "Logged out" });
  } else return res.json({ error: "You are not logged in" });
};

export const enroll = async (req: Request, res: Response) => {
  if (res.locals.isStudent) {
    User.findByIdAndUpdate(
      res.locals.id,
      { $push: { courses: req.params.courseID } },
      (e) => {
        if (e) {
          console.log(e);
          return res.json({ error: "Enrollment Error" });
        } else return res.json({ message: "Enrolled successfully" });
      }
    );
  } else return res.json({ error: "UNAUTHORIZED" });
};

export const unenroll = async (req: Request, res: Response) => {
  if (res.locals.isStudent) {
    User.findByIdAndUpdate(
      res.locals.id,
      { $pull: { courses: req.params.courseID } },
      (e) => {
        if (e) {
          console.log(e);
          return res.json({ error: "Unlink Error" });
        } else return res.json({ message: "Unlinked successfully" });
      }
    );
  } else return res.json({ error: "UNAUTHORIZED" });
};

export const testResults = async (req: Request, res: Response) => {
  if (res.locals.isStudent) {
    try {
      const dbResults = await User.findById(res.locals.id)
        .select("testSubmissions courses -_id")
        .populate([
          {
            path: "courses",
            select: "tests -_id",
            populate: {
              path: "tests",
              model: "Test",
              select: "title maxMarks startTime endTime",
            },
          },
          { path: "testSubmissions.test", select: "title maxMarks" },
        ]);

      const submitted = dbResults.testSubmissions.map((sub) => ({
        id: sub.test._id,
        title: sub.test.title,
        maxMarks: sub.test.maxMarks,
        marks: sub.marks,
      }));

      const remain: any[] = [],
        futureContainer: any[] = [],
        future: any[] = [],
        tests: any[] = [];
      dbResults.courses.map((course) => tests.push(...course.tests));

      tests
        .filter(
          (test) =>
            !submitted.some((sub) => String(test._id) === String(sub.id))
        )
        .forEach((test) => {
          if (test.endTime < new Date())
            remain.push({
              id: test._id,
              title: test.title,
              marks: 0,
              maxMarks: test.maxMarks,
            });
          else
            futureContainer.push({
              id: test._id,
              title: test.title,
              start: test.startTime,
              maxMarks: test.maxMarks,
            });
        });

      const now = new Date().getTime();
      future.push(
        ...futureContainer
          .sort(
            (a, b) =>
              Math.abs(a.start.getTime() - now) -
              Math.abs(b.start.getTime() - now)
          )
          .map((test) => ({
            id: test.id,
            title: test.title,
            marks: "NA",
            maxMarks: test.maxMarks,
          }))
      );

      res.json({ submitted, remain, future });
    } catch (e) {
      console.log(e);
      return res.json({ error: "Fetching Results Error" });
    }
  } else
    return res.json({ error: "You must be a student to perform this action" });
};

export const getSchedule = async (req: Request, res: Response) => {
  User.findById(res.locals.id)
    .select("courses -_id")
    .populate(
      res.locals.isStudent
        ? {
            path: "courses",
            select: "schedule assignments tests -_id",
            populate: [
              {
                path: "assignments",
                model: "Assignment",
                select: "title dueDate -_id",
              },
              {
                path: "tests",
                model: "Test",
                select: "title startTime endTime -_id",
              },
            ],
          }
        : { path: "courses", select: "schedule -_id" }
    )
    .exec((e, courses) => {
      if (e) {
        console.log(e);
        return res.json({ error: "Fetching Course Error" });
      } else return res.json(courses.courses);
    });
};
