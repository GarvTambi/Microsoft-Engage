import React from "react";
import { Snackbar, Slide } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

const Toast = ({
  error = true,
  open,
  text,
  onCloseExtra = () => void 0,
  setStatus = (input) => console.log(input),
  dashboard = false,
  duration = 2000,
}) => {
  const history = useHistory();
  const onClose = () => {
    onCloseExtra();
    setStatus({ error: "", success: false });
    if (dashboard) history.push("/dashboard");
  };

  return (
    open && (
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={onClose}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={error ? "error" : "success"}
          onClose={onClose}>
          {text}
        </MuiAlert>
      </Snackbar>
    )
  );
};

export default Toast;
