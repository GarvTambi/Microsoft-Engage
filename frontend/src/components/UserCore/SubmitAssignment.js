import React, { useState } from "react";
import { Box, Container, Button } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useLocation } from "react-router-dom";
import { Copyright } from "../../Commons";
import { viewSubmissions, fileUploadAPI } from "../../helper/API";
import UserHome from "../UserHome";
import { useStyles } from "../SignUp";
import Toast from "../utils/Toast";

const SubmitAssignment = () => {
  const classes = useStyles();
  const {
    state: { assignmentID },
  } = useLocation();
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const handleFile = ({ target }) => {
    const file = target.files[0];
    console.log(file);
    fileUploadAPI(file, assignmentID);
  };

  return (
    <UserHome>
      <Container component="main" maxWidth="xs" className={classes.root}>
        
        <Button variant="contained" component="label" style = {{marginTop:"10rem"}}>
          Upload File
          <input type="file" onChange={handleFile} hidden />
        </Button>
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

export default SubmitAssignment;
