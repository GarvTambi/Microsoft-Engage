import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Assignment from "./components/UserCore/Assignment";
import AddAssignment from "./components/UserCore/AddAssignment";
import Announcement from "./components/UserCore/Announcement";
import AddAnnouncement from "./components/UserCore/AddAnnouncement";
import Calendar from "./components/UserHome/Calendar";
import Home from "./components/Home";
import { isAuthenticated } from "./helper/API";
import Dashboard from "./components/UserHome/Dashboard";
import AddCourse from "./components/UserHome/AddCourse";
import StudentAddCourse from "./components/UserHome/StudentAddCourse";
import Tests from "./components/UserCore/Tests";
import Meet from "./components/UserCore/Meet";
import Poll from "./components/UserCore/Poll";
import { NotFound } from "./Commons";
import SubmitAssignment from "./components/UserCore/SubmitAssignment";
import ViewTestResults from "./components/UserCore/ViewTestResults";
import ViewSubmission from "./components/UserCore/ViewSubmission";
import ViewTest from "./components/UserCore/ViewTest";
import CreateTest from "./components/UserCore/CreateTest";
import CreateMeet from "./components/UserCore/CreateMeet";
import CreatePoll from "./components/UserCore/CreatePoll";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/signin" />
    }
  />
);

const TeacherRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated() && !isAuthenticated().isStudent)
        return <Component {...props} />;
      else return <Redirect to="/signin" />;
    }}
  />
);

const StudentRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated() && isAuthenticated().isStudent)
        return <Component {...props} />;
      else return <Redirect to="/signin" />;
    }}
  />
);

const NonLoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated()) return <Redirect to="/dashboard" />;
      else return <Component {...props} />;
    }}
  />
);

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <NonLoginRoute path="/signin" component={SignIn} exact />
        <NonLoginRoute path="/signup" component={SignUp} exact />
        <NonLoginRoute path="/verify" component={VerifyEmail} exact />
        <NonLoginRoute path="/reset" component={ForgotPassword} exact />
        <LoginRoute path="/dashboard" component={Dashboard} exact />
        <TeacherRoute path="/courses/create" component={AddCourse} exact />
        <StudentRoute path="/courses/link" component={StudentAddCourse} exact />
        <LoginRoute path="/tests" component={Tests} exact />
        <LoginRoute path="/meet" component={Meet} exact />
        <LoginRoute path="/poll" component={Poll} exact />
        <StudentRoute path="/tests/submit" component={ViewTest} exact />
        <TeacherRoute path="/tests/create" component={CreateTest} exact />
        <TeacherRoute path="/meet/create" component={CreateMeet} exact />
        <TeacherRoute path="/poll/create" component={CreatePoll} exact />
        <TeacherRoute path="/tests/result" component={ViewTestResults} exact />
        <LoginRoute path="/assignment" component={Assignment} exact />
        <LoginRoute path="/announcement" component={Announcement} exact />
        <StudentRoute
          path="/assignment/submit"
          component={SubmitAssignment}
          exact
        />
        <TeacherRoute
          path="/assignment/create"
          component={AddAssignment}
          exact
        />
        <TeacherRoute
          path="/announcement/create"
          component={AddAnnouncement}
          exact
        />
        <TeacherRoute
          path="/assignment/review"
          component={ViewSubmission}
          exact
        />
        <LoginRoute path="/calendar" component={Calendar} exact />
        <Route path="/" component={Home} exact />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
