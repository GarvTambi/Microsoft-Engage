import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Divider,
  IconButton,
  Icon,
  Switch,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { rootStyle, Copyright } from "../Commons";
import { auth, onAuth } from "../helper/API";
import { GoogleLogin } from "react-google-login";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Toast from "./utils/Toast";

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: { margin: theme.spacing(3, 0, 2) },
  root: rootStyle,
  divider: { marginTop: theme.spacing(1), width: "100%" },
}));

export default function SignUp() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    isStudent: true,
  });
  const { name, email, password, isStudent } = values;

  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ name: "", email: "", password: "", isStudent: true });

    auth(values, "signup").then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: true });
      else onAuth(data, () => setStatus({ error: "", success: true }));
    });
  };

  const handleChange = (name) => (event) =>
    setValues({ ...values, [name]: event.target.value });

  const responseGoogle = (response) => {
    const {
      tokenId,
      profileObj: { email: g_mail },
    } = response;
    auth({ tokenId, isStudent, email: g_mail }, "signup").then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: true });
      else onAuth(data, () => setStatus({ error: "", success: true }));
    });
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <ValidatorForm className={classes.form} onSubmit={onSubmit}>
          <TextValidator
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={handleChange("name")}
            validators={["required"]}
            errorMessages={["All fields are mandatory"]}
          />

          <TextValidator
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
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
            validators={[
              "required",
              "matchRegexp:^(?=.*\\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$",
            ]}
            errorMessages={[
              "All fields are mandatory",
              "Password must be at least 8 characters and contain at least 1 number and 1 letter",
            ]}
          />

          <Box display="flex" justifyContent="start" alignItems="center">
            Are you a Teacher?
            <Switch
              checked={!isStudent}
              onChange={() => setValues({ ...values, isStudent: !isStudent })}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2" underline="none">
                Already have an account? Sign In
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
      <Toast
        error={false}
        open={success}
        text="Signed up successfully. Click on the Close Icon to go to the Dashboard."
        setStatus={setStatus}
        dashboard={true}
        duration={null}
      />

      <Box mt="auto" py={3}>
        <Copyright />
      </Box>
    </Container>
  );
}
