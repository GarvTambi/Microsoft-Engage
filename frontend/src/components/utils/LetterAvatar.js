import React from "react";
import { Avatar } from "@material-ui/core";
import {
  blue,
  teal,
  green,
  lightGreen,
  indigo,
} from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  blueAvatar: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
  },
  tealAvatar: {
    color: theme.palette.getContrastText(teal[500]),
    backgroundColor: teal[500],
  },
  greenAvatar: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
  lightGreenAvatar: {
    color: theme.palette.getContrastText(lightGreen[500]),
    backgroundColor: lightGreen[500],
  },
  indigoAvatar: {
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
  },
}));

const LetterAvatar = ({ text, css }) => {
  const classes = useStyles();
  const randomColor = () =>
    classes[Object.keys(classes)[Math.floor(Math.random() * 5)]];

  return (
    <Avatar
      classes={{ "colorDefault": randomColor(), "root": css }}
      variant="square">
      {text
        .toUpperCase()
        .match(/\b(\w)/g)
        .join("")}
    </Avatar>
  );
};

export default LetterAvatar;
