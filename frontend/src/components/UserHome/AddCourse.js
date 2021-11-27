import React, { useState } from "react";
import { Container, Button, Box, Checkbox, InputLabel } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import copyText from "copy-text-to-clipboard";
import { useStyles } from "../SignUp";
import { Copyright } from "../../Commons";
import { createCourse } from "../../helper/API";
import UserHome from "../UserHome";
import Toast from "../utils/Toast";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const AddCourse = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const [schedule, setSchedule] = useState({
    monday: moment().toISOString(),
    tuesday: moment().toISOString(),
    wednesday: moment().toISOString(),
    thursday: moment().toISOString(),
    friday: moment().toISOString(),
  });

  const [days, setDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
  });

  const handleDateChange = (name) => (event) =>
    setSchedule({ ...schedule, [name]: event.toISOString() });

  const onSubmit = () => {
    const timeSchedule = {};
    Object.keys(days).map((day) => {
      timeSchedule[day] = days[day]
        ? moment(schedule[day]).format("hh:mm A")
        : "";
    });

    createCourse({ name, schedule: timeSchedule }).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setStatus({ error: "", success: data.courseID });
    });
  };

  return (
    <UserHome>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <div className={classes.paper}>
          <ValidatorForm className={classes.form} onSubmit={onSubmit}>
            <TextValidator
              variant="outlined"
              margin="normal"
              fullWidth
              label="Course Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              validators={["required"]}
              errorMessages={["All fields are mandatory"]}
            />

            <label style = {{margin:"auto", paddingLeft: "8rem"}}>Class Day and Time</label>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              {Object.keys(schedule).map((day, i) => (
                <Box
                  key={i}
                  m={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between">
                  <Checkbox
                    checked={days[day]}
                    onChange={() => setDays({ ...days, [day]: !days[day] })}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                  <span>{day.toUpperCase()}</span>:
                  <TimePicker
                    key={i}
                    value={schedule[day]}
                    onChange={handleDateChange(day)}
                  />
                </Box>
              ))}
            </MuiPickersUtilsProvider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ marginTop: "30px" }}>
              Create Course
            </Button>
          </ValidatorForm>
        </div>

        <Toast open={error} text={error} setStatus={setStatus} />
        <Toast
          error={false}
          open={success}
          text="Click on the Close Icon to copy the Course ID and go back to the Dashboard"
          onCloseExtra={() => copyText(success)}
          setStatus={setStatus}
          dashboard={true}
          duration={null}
        />

        <Box mt="auto" py={3}>
          <Copyright />
        </Box>
      </Container>
    </UserHome>
  );
};

export default AddCourse;
