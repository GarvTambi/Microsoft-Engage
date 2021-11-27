import React, { useEffect, useState } from "react";
import { Container, Button, Grid, CardContent, Card } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { sendMarks, viewSubmissions } from "../../helper/API";
import UserHome from "../UserHome";
import { useStyles } from "../SignUp";
import Toast from "../utils/Toast";
import { useLocation } from "react-router-dom";

const ViewSubmission = () => {
  const classes = useStyles();
  const {
    state: { courseID, assignmentID, maxMarks },
  } = useLocation();
  const [sub, setSub] = useState([]);
  const [marks, setMarks] = useState([]);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  useEffect(() => {
    viewSubmissions(courseID, assignmentID).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setSub(data);
    });
  }, []);

  useEffect(() => {
    setMarks(Array(sub.length).fill(""));
  }, [sub]);

  const onSubmit = (userID, assignmentID, mark) => {
    sendMarks({ userId: userID, assignmentId: assignmentID, marks: mark }).then(
      (data) => {
        if (data.error) setStatus({ error: data.error.trim(), success: false });
        else setStatus({ error: "", success: `${mark} Marks awarded` });
      }
    );
  };

  return (
    <UserHome>
      {sub.length > 0 && (
        <Container component="main" maxWidth="lg" className={classes.root}>
          <Grid container spacing={4}>
            {sub.map((user, i) => (
              <Grid item xs={12} key={i}>
                <Card square>
                  <CardContent>
                    <iframe
                      src={`https://drive.google.com/file/d/${user.assignmentSubmissions.link}/preview`}
                      width="100%"
                      height="480"></iframe>

                    <ValidatorForm
                      className={classes.form}
                      onSubmit={() =>
                        onSubmit(
                          user._id,
                          user.assignmentSubmissions.assignment,
                          marks[i]
                        )
                      }>
                      <TextValidator
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Maximum Marks"
                        value={marks[i]}
                        onChange={(e) => {
                          if (!isNaN(e.target.value))
                            setMarks(
                              marks.map((mark, id) => {
                                if (id === i) mark = e.target.value;
                                return mark;
                              })
                            );
                        }}
                        validators={[
                          "required",
                          "minNumber:0",
                          `maxNumber:${maxMarks}`,
                        ]}
                        errorMessages={[
                          "All fields are mandatory",
                          "Marks must be a positive value",
                          `Marks cannot be more than ${maxMarks}`,
                        ]}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Submit
                      </Button>
                    </ValidatorForm>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <Toast open={error} text={error} setStatus={setStatus} />
      <Toast
        error={false}
        open={success}
        text={success}
        setStatus={setStatus}
      />
    </UserHome>
  );
};

export default ViewSubmission;
