import React, { useState } from "react";
import { Container, Button, Box, Typography } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useHistory, useLocation } from "react-router-dom";
import { useStyles } from "../SignUp";
import { Copyright } from "../../Commons";
import { createAnnouncement } from "../../helper/API";
import UserHome from "../UserHome";
import Toast from "../utils/Toast";

import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

const AddAnnouncement = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    state: { courseID },
  } = useLocation();
  const [title, setTitle] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(moment().toISOString());
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const onSubmit = () => {
    createAnnouncement({ courseID, title, maxMarks, description, dueDate }).then(
      (data) => {
        if (data.error) setStatus({ error: data.error.trim(), success: false });
        else setStatus({ error: "", success: data.message });
      }
    );
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
              label="Assignment Title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              validators={["required"]}
              errorMessages={["All fields are mandatory"]}
            />

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

            <TextValidator
              variant="outlined"
              margin="normal"
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              validators={["required"]}
              errorMessages={["All fields are mandatory"]}
            />

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                my={1.5}
                mx={0.75}>
                <Typography>Submission Date</Typography>
                <DateTimePicker
                  inputVariant="outlined"
                  disablePast
                  value={dueDate}
                  onChange={(e) =>
                    e.isSameOrBefore(moment())
                      ? setStatus({
                          error: "Submission cannot be before current Time",
                          success: false,
                        })
                      : setDueDate(e.toISOString())
                  }
                />
              </Box>
            </MuiPickersUtilsProvider>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{ marginTop: "30px" }}>
              Create Assignment
            </Button>
          </ValidatorForm>
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

        <Box mt="auto" py={3}>
          <Copyright />
        </Box>
      </Container>
    </UserHome>
  );
};

export default AddAnnouncement;
