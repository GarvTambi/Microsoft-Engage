import React, { useState } from "react";
import { Box, Container, Button } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Copyright } from "../../Commons";
import { addCourseStudent } from "../../helper/API";
import UserHome from "../UserHome";
import { useStyles } from "../SignUp";
import Toast from "../utils/Toast";

const StudentAddCourse = () => {
  const classes = useStyles();
  const [id, setId] = useState("");
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const onSubmit = () => {
    if (id !== "") {
      addCourseStudent(id).then((data) => {
        if (data.error) setStatus({ error: data.error.trim(), success: false });
        else setStatus({ error: "", success: data.message.trim() });
      });
    }
  };

  return (
    <UserHome>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <ValidatorForm className={classes.form} onSubmit={onSubmit}>
          <TextValidator
            variant="outlined"
            margin="normal"
            fullWidth
            label="Course ID"
            autoFocus
            value={id}
            onChange={(e) => setId(e.target.value)}
            validators={["required"]}
            errorMessages={["All fields are mandatory"]}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Add Course
          </Button>
        </ValidatorForm>

        <Toast open={error} text={error} setStatus={setStatus} />
        <Toast
          error={false}
          open={success}
          text={success}
          setStatus={setStatus}
          dashboard={true}
        />

        <Box mt="auto" py={3}>
          <Copyright />
        </Box>
      </Container>
    </UserHome>
  );
};

export default StudentAddCourse;
