import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, Tooltip, Fab, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { Add } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import { getAssignments, isAuthenticated } from "../../helper/API";
import UserHome from "../UserHome";
import Toast from "../utils/Toast";

import moment from "moment";
import "moment/locale/en-in";
moment.updateLocale("en-in", { week: { dow: 1 } });

export const useStyles = makeStyles((theme) => ({
  grid: { padding: theme.spacing(5, 6) },
  center: { textAlign: "center" },
  submit: { margin: theme.spacing(3, 0, 2) },
}));

export default function Assignment() {
  const classes = useStyles();
  const history = useHistory();
  const { isStudent } = isAuthenticated();
  const {
    state: { courseID, name },
  } = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error } = status;

  useEffect(() => {
    getAssignments(courseID).then((data) => {
      if (data.error) {
        setStatus({ error: data.error.trim(), success: false });
        setAssignments([]);
      } else setAssignments(data);
    });
  }, []);

  return (
    <UserHome>
      {assignments.length > 0 && (
        <Container maxWidth="md" className={classes.grid}>
          <h1 className={classes.center}>Assignments for {name}</h1>
          <Grid container spacing={4}>
            {assignments.map((assignment, i) => (
              <Grid item xs={12} key={i}>
                <Card>
                  <Box px={2} py={1}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {assignment.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        paragraph
                        align="justify">
                        {assignment.description}
                      </Typography>

                    </CardContent>

                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {!isStudent && (
        <Link
          onClick={() =>
            history.push("/announcement/create", { courseID: courseID })
          }>
          <Tooltip title="Add" aria-label="add">
            <Fab
              color="primary"
              aria-label="add"
              style={{ position: "fixed", bottom: "10%", left: "5%" }}>
              <Add />
            </Fab>
          </Tooltip>
        </Link>
      )}

      <Toast open={error} text={error} setStatus={setStatus} duration={null} />
    </UserHome>
  );
}

Assignment.propTypes = {
  posts: PropTypes.array,
  title: PropTypes.string,
};
