import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies?.token) {
    type Token = {
      id: string;
      isStudent: boolean;
    };
    try {
      const { id, isStudent } = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      ) as Token;

      if (id && isStudent != undefined) {
        res.locals.id = id;
        res.locals.isStudent = isStudent;
        next();
      } else return res.json({ error: "Invalid token" });
    } catch (error) {
      return res.json({ error: "Invalid token" });
    }
  } else return res.json({ error: "You are not logged in" });
};
