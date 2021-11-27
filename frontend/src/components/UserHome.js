import { CssBaseline, AppBar, Toolbar, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";
import React from "react";
import { isAuthenticated, logout } from "../helper/API";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1, fontWeight: 600 },
  brand: {
    fontSize: "1.25rem",
    lineHeight: 1.6,
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    textDecoration: "none",
    color: "white",
  },
  appBar: { background:"#3f51b5"},
}));

const UserHome = ({ children }) => {
  const classes = useStyles();
  const { name } = isAuthenticated();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        elevation={6}
        position="sticky"
        classes={{ root: classes.appBar }}>
        <Toolbar>
          <Box
            component="span"
            display={{ xs: "none", sm: "block" }}
            className={classes.brand}>
            Welcome {name}
          </Box>
          <Link to="/dashboard" className={classes.menuButton}>
            Dashboard
          </Link>
          <Link to="/tests" className={classes.menuButton}>
            Tests
          </Link >   
          <Link to="/meet" className={classes.menuButton}>
            Meet
          </Link > 
          <Link to="/poll" className={classes.menuButton}>
            Poll
          </Link >                            
          <Link to="/calendar" className={classes.menuButton}>
            Calendar
          </Link>
          <Link to="/" className={classes.menuButton} onClick={logout}>
            Logout
          </Link>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default UserHome;
