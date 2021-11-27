import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { isAuth } from "./middleware/auth";
import userRouter from "./routes/users";
import courseRouter from "./routes/courses";
import assignmentRouter from "./routes/assignments";
import testRouter from "./routes/tests";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const upload = multer({ dest: 'assignments/' });

app.use(compression());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(express.json());
app.use("/users", userRouter);
app.use("/courses", isAuth, courseRouter);
app.use("/assignments/submit", upload.single("file"), isAuth, assignmentRouter);
app.use("/assignments", isAuth, assignmentRouter);
app.use("/tests", isAuth, testRouter);

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    useFindAndModify: false,
  },
  () => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  }
);
