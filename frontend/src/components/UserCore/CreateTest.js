import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Container, Button, Box, Grid, Tooltip } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useStyles } from "../SignUp";
import { Copyright } from "../../Commons";
import { createTest } from "../../helper/API";
import UserHome from "../UserHome";
import Toast from "../utils/Toast";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const CreateTest = () => {
  const classes = useStyles();
  const history = useHistory();
  const [courseID, setCourseID] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(moment().toISOString());
  const [endTime, setEndTime] = useState(moment().toISOString());
  const [maxMarks, setMaxMarks] = useState("");
  const [questions, setQuestions] = useState([]);
  const [qSuccess, setQSuccess] = useState(false);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const [curQuestion, setCurQuestion] = useState({
    title: "",
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
    answer: "",
  });
  const { title: qTitle, opt1, opt2, opt3, opt4, answer } = curQuestion;
  const handleChange = (name) => (event) =>
    setCurQuestion({ ...curQuestion, [name]: event.target.value });

  const onSubmit = () => {
    if (questions.length === 0)
      setStatus({ error: "All Fields are Mandatory", success: false });
    else {
      if (moment(endTime).isSameOrBefore(startTime))
        setStatus({
          error: "End Time cannot be before Start Time",
          success: false,
        });
      else {
        createTest(courseID, {
          title,
          startTime,
          endTime,
          maxMarks,
          questions,
        }).then((data) => {
          if (data.error)
            setStatus({ error: data.error.trim(), success: false });
          else setStatus({ error: "", success: data.message });
        });
      }
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...curQuestion }]);
    setCurQuestion({
      title: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      answer: "",
    });
    setQSuccess(true);
  };

  return (
    <UserHome>
      <Container component="main" maxWidth="lg" className={classes.root}>
        <div className={classes.paper}>
          <Grid container spacing={10} justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <ValidatorForm className={classes.form} onSubmit={onSubmit}>
                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Course ID"
                  autoFocus
                  value={courseID}
                  onChange={(e) => setCourseID(e.target.value)}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Test Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mx={0.75}>
                    <span style={{ fontSize: "1rem" }}>Start Time</span>
                    <DateTimePicker
                      inputVariant="outlined"
                      disablePast
                      value={startTime}
                      onChange={(e) =>
                        e.isSameOrBefore(moment())
                          ? setStatus({
                              error: "Start Time cannot be before current Time",
                              success: false,
                            })
                          : setStartTime(e.toISOString())
                      }
                    />
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mx={0.75}>
                    <span style={{ fontSize: "1rem" }}>End Time</span>
                    <DateTimePicker
                      inputVariant="outlined"
                      disablePast
                      value={endTime}
                      onChange={(e) =>
                        e.isSameOrBefore(moment())
                          ? setStatus({
                              error: "Submission cannot be before current Time",
                              success: false,
                            })
                          : setEndTime(e.toISOString())
                      }
                    />
                  </Box>
                </MuiPickersUtilsProvider>

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Maximum Marks"
                  value={maxMarks}
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) setMaxMarks(e.target.value);
                  }}
                  validators={["required", "minNumber:0", "maxNumber:100"]}
                  errorMessages={[
                    "All fields are mandatory",
                    "Marks must be a positive value",
                    "Marks cannot be more than 100",
                  ]}
                />

                <Tooltip
                  title="To be done after adding Questions"
                  aria-label="Create Test"
                  arrow
                  interactive>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submit}
                    style={{ marginTop: "30px" }}>
                    Create Test
                  </Button>
                </Tooltip>
              </ValidatorForm>
            </Grid>

            <Grid item xs={12} sm={10} md={8} lg={6}>
              <ValidatorForm className={classes.form} onSubmit={addQuestion}>
                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Question"
                  value={qTitle}
                  onChange={handleChange("title")}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Option 1"
                  value={opt1}
                  onChange={handleChange("opt1")}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Option 2"
                  value={opt2}
                  onChange={handleChange("opt2")}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Option 3"
                  value={opt3}
                  onChange={handleChange("opt3")}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Option 4"
                  value={opt4}
                  onChange={handleChange("opt4")}
                  validators={["required"]}
                  errorMessages={["All fields are mandatory"]}
                />

                <TextValidator
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Correct Option"
                  value={answer}
                  onChange={handleChange("answer")}
                  validators={["required", "minNumber:1", "maxNumber:4"]}
                  errorMessages={[
                    "All fields are mandatory",
                    "Correct option can only be chosen from 1-4",
                    "Correct option can only be chosen from 1-4",
                  ]}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={classes.submit}
                  style={{ marginTop: "30px" }}>
                  Add Question
                </Button>
              </ValidatorForm>
            </Grid>
          </Grid>
        </div>

        <Toast
          open={error}
          text={error}
          setStatus={setStatus}
          duration={3000}
        />

        <Toast
          error={false}
          open={success}
          text={success}
          onCloseExtra={() => history.goBack()}
          setStatus={setStatus}
        />

        <Toast
          error={false}
          open={qSuccess}
          text="Question added successfully"
          onCloseExtra={() => setQSuccess(false)}
        />

        <Box mt="auto" py={3}>
          <Copyright />
        </Box>
      </Container>
    </UserHome>
  );
};

export default CreateTest;
