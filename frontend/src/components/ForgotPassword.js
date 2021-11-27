import React, { useState } from "react";
import { Box, Container, Button } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Copyright } from "../Commons";
import { resetPasswordAPI } from "../helper/API";
import { useStyles } from "./SignUp";
import { useLocation } from "react-router-dom";
import Toast from "./utils/Toast";

const ForgotPassword = () => {
    const classes = useStyles();
    const [values, setValues] = useState({ password: "" });
    const { password } = values;
  
    const [status, setStatus] = useState({ error: "", success: false });
    const { error, success } = status;

    const search = useLocation().search;
    const token = new URLSearchParams(search).get('t');

    const handleChange = (name) => (event) =>
    setValues({ ...values, [name]: event.target.value });

    const onSubmit = () => {
        if (password !== "" && token !== undefined) {
        resetPasswordAPI(token, password).then((data) => {
            if (data.error) setStatus({ error: data.error.trim(), success: false });
            else setStatus({ error: "", success: data.message.trim() });
        });
        }
    };

  return (
      <Container component="main" maxWidth="xs" className={classes.root}>
        <ValidatorForm className={classes.form} onSubmit={onSubmit}>
        <TextValidator
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange("password")}
            validators={["required"]}
            errorMessages={["All fields are mandatory"]}
          />


          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Reset Password
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
  );
};

export default ForgotPassword;