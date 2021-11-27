
import {
  Link,
  Typography,
  Snackbar,
  Slide,
  Container,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

export const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"Copyright © "}
    <Link
      color="inherit"
      href="https://github.com/"
      underline="always">
      Garv Tambi
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

export const rootStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

export const NotFound = () => {
  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Typography variant="h2">404! Page not Found</Typography>
    </Container>
  );
};

export const SendToDashboard = ({
  success,
  onCloseExtra = () => void 0,
  setStatus,
  text,
}) => {
  const history = useHistory();
  const onClose = () => {
    onCloseExtra();
    setStatus({ error: "", success: false });
    history.push("/dashboard");
  };

  return (
    success && (
      <Snackbar
        open={success}
        onClose={onClose}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={onClose}>
          {text}
        </MuiAlert>
      </Snackbar>
    )
  );
};

export const Error = ({
  error,
  onCloseExtra = () => void 0,
  setStatus,
  text,
}) => {
  const onClose = () => {
    onCloseExtra();
    setStatus({ error: "", success: false });
  };

  return (
    error && (
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={onClose}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="error"
          onClose={onClose}>
          {text}
        </MuiAlert>
      </Snackbar>
    )
  );
};
