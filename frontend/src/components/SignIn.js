import React, { useState } from "react";
import {
  Avatar,
  Button,
  Box,
  CssBaseline,
  Link,
  Grid,
  Typography,
  Container,
  Divider,
  IconButton,
  Icon,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { Copyright } from "../Commons";
import { GoogleLogin } from "react-google-login";
import { useStyles } from "./SignUp";
import { Redirect } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { auth, forgotPasswordAPI, onAuth } from "../helper/API";
import Toast from "./utils/Toast";

export default function SignIn() {
  const classes = useStyles();
  const [values, setValues] = useState({ email: "", password: "" });
  const { email, password } = values;

  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ email: "", password: "" });

    auth(values, "login").then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else onAuth(data, () => setStatus({ error: "", success: true }));
    });
  };

  const forgotPassword = () => {
    forgotPasswordAPI(email).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setStatus({ error: "Mail sent successfully", success: false });
    });
  };
  const handleChange = (name) => (event) =>
    setValues({ ...values, [name]: event.target.value });

  const responseGoogle = (response) => {
    const {
      tokenId,
      profileObj: { email: g_mail },
    } = response;
    auth({ tokenId, email: g_mail }, "login").then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else onAuth(data, () => setStatus({ error: "", success: true }));
    });
  };

  const redirect = () => {
    if (success) return <Redirect to="/dashboard" />;
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <ValidatorForm className={classes.form} onSubmit={onSubmit}>
          <TextValidator
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange("email")}
            validators={["required", "isEmail"]}
            errorMessages={[
              "All fields are mandatory",
              "Invalid Value for E-Mail",
            ]}
          />

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
            Sign In
          </Button>

          <Grid container justifyContent="space-between">
            <Grid item>
              <Link
                component="button"
                onClick={() => forgotPassword()}
                variant="body2"
                underline="none">
                Forgot Password?
              </Link>
            </Grid>

            <Grid item>
              <Link href="/signup" variant="body2" underline="none">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </ValidatorForm>

        <Divider className={classes.divider} />
        <Box display="flex" alignItems="center">
          <Typography color="primary" variant="body2">
            Or continue with
          </Typography>
          <GoogleLogin
            clientId="1096802061934-9u960cghqq9scr9nagu2qbbnt2kcg4ac.apps.googleusercontent.com"
            render={(props) => (
              <IconButton onClick={props.onClick}>
                <Icon>
                  <img src="/google.svg" width={25} alt="Google" />
                </Icon>
              </IconButton>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </Box>
      </div>

      <Toast open={error} text={error} setStatus={setStatus} />
      {redirect()}
      <Box mt="auto" py={3}>
        <Copyright />
      </Box>
    </Container>
  );
}
