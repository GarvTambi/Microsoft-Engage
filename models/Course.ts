import { User } from "./User";
import mongoose, { Document } from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  maxMarks: Number
});

const questionSchema = new mongoose.Schema({
  _id: false,
  title: { type: String, trim: true },
  opt1: { type: String, trim: true },
  opt2: { type: String, trim: true },
  opt3: { type: String, trim: true },
  opt4: { type: String, trim: true },
  answer: Number,
});

const testSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  startTime: Date,
  endTime: Date,
  maxMarks: Number,
  questions: [questionSchema],
});

const courseSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  schedule: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
  },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
});

export interface Assignment extends Document {
  title: string;
  description: string;
  dueDate: Date;
  maxMarks: number;
}

interface Question {
  title: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  answer: number;
}

export interface Test extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  maxMarks: number;
  questions: Array<Question>;
}

export interface Course extends Document {
  name: string;
  professor: User;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  assignments: Array<Assignment>;
  tests: Array<Test>;
}

export const AssignmentModel = mongoose.model<Assignment>("Assignment", assignmentSchema);
export const TestModel = mongoose.model<Test>("Test", testSchema);
export default mongoose.model<Course>("Course", courseSchema);
