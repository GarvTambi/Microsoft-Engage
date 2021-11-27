import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Link,
  Tooltip,
  Fab,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import { makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import UserHome from "../UserHome";
import {
  getCourseTests,
  getTestResultsStudent,
  isAuthenticated,
} from "../../helper/API";
import Toast from "../utils/Toast";

export const useStyles = makeStyles((theme) => ({
  grid: { padding: theme.spacing(5, 6) },
  cardActions: { justifyContent: "flex-end", paddingTop: 0, paddingRight: 10 },
  divider: { margin: theme.spacing(1, 0), width: "100%" },
  justify: { textAlign: "justify", padding: theme.spacing(0, 2) },
  center: { textAlign: "center" },
  link: { cursor: "pointer" },

  // GFG Green
  correct: { color: "#308D46" },
  incorrect: { color: "inherit" },
  content1: { paddingBottom: 0, paddingLeft: theme.spacing(2.75) },
  content2: { paddingTop: 0 },
}));

const Tests = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isStudent } = isAuthenticated();
  const [tests, setTests] = useState([]);

  const [condition, setCondition] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error } = status;

  useEffect(() => {
    if (isStudent) {
      getTestResultsStudent().then((data) => {
        console.log(data);
        if (data.error) setStatus({ error: data.error.trim(), success: false });
        else setTests(data);
      });
    } else {
      getCourseTests().then((data) => {
        if (data.error) setStatus({ error: data.error.trim(), success: false });
        else setTests(data);
      });
    }
  }, []);

  useEffect(() => {
    if (!isStudent) {
      setCondition(tests.length > 0);
      setExpanded(tests.map(({ tests }) => tests.map(() => false)));
    } else setCondition(Object.keys(tests).length > 0);
  }, [tests]);

  const Questions = ({ questions }) => {
    const Question = ({ q }) => {
      const ar = Array(4).fill(classes.incorrect);
      ar[q.answer - 1] = classes.correct;

      return (
        <Box className={classes.justify}>
          <Typography variant="" paragraph>
            {q.title}
          </Typography>
          <Typography variant="body2" classes={{ root: ar[0] }}>
            {q.opt1}
          </Typography>
          <Typography variant="body2" classes={{ root: ar[1] }}>
            {q.opt2}
          </Typography>
          <Typography variant="body2" classes={{ root: ar[2] }}>
            {q.opt3}
          </Typography>
          <Typography variant="body2" classes={{ root: ar[3] }}>
            {q.opt4}
          </Typography>
        </Box>
      );
    };

    return questions.map((question, i) => (
      <>
        <Divider className={classes.divider} />
        <Question q={question} />
      </>
    ));
  };

  const TestCard = ({ test, course = undefined, id = undefined }) => {
    return (
      <Card square>
        <CardContent classes={{ root: classes.content1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {test.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {isStudent ? `Your Marks: ${test.marks}` : `Course: ${course.name}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Maximum Marks: {test.maxMarks}
          </Typography>
        </CardContent>

        {!isStudent && (
          <CardActions classes={{ root: classes.cardActions }}>
            <Button
              size="small"
              color="secondary"
              onClick={() =>
                setExpanded(
                  expanded.map((el, idx) => {
                    if (idx === id.id) el[id.i] = !el[id.i];
                    return el;
                  })
                )
              }>
              {expanded[id.id][id.i] ? "Hide Questions" : "Show Questions"}
            </Button>

            <Button
              size="small"
              color="secondary"
              onClick={() =>
                history.push("/tests/result", {
                  course: course,
                  test: test,
                })
              }>
              View Results
            </Button>
          </CardActions>
        )}
      </Card>
    );
  };

  return (
    <UserHome>
      {condition && (
        <Container maxWidth="lg" className={classes.grid}>
          {isStudent && (
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <h1 className={classes.center}>Upcoming/Ongoing Tests</h1>
                {tests.future.map((test, i) => (
                  <Box mb={4} key={i}>
                    <Link
                      classes={{ root: classes.link }}
                      underline="none"
                      onClick={() =>
                        history.push("/tests/submit", { testID: test.id })
                      }>
                      <TestCard test={test} />
                    </Link>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <h1 className={classes.center}>Submitted Tests</h1>
                {tests.submitted.map((test, i) => (
                  <Box mb={4} key={i}>
                    <TestCard test={test} />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <h1 className={classes.center}>Incomplete Tests</h1>
                {tests.remain.map((test, i) => (
                  <Box mb={4} key={i}>
                    <TestCard test={test} />
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}

          {!isStudent &&
            expanded.length > 0 &&
            tests.map((course, id) =>
              course.tests.map((test, i) => (
                <Box mb={4} key={i}>
                  <TestCard
                    test={test}
                    course={{ name: course.name, id: course._id }}
                    id={{ id, i }}
                  />
                  <Card square>
                    <Collapse in={expanded[id][i]} timeout="auto">
                      <CardContent classes={{ root: classes.content2 }}>
                        <Questions questions={test.questions} />
                      </CardContent>
                    </Collapse>
                  </Card>
                </Box>
              ))
            )}
        </Container>
      )}

      {!isStudent && (
        <Link onClick={() => history.push("/tests/create")}>
          <Tooltip title="Add Test" aria-label="add">
            <Fab
              color="primary"
              aria-label="add"
              style={{ position: "fixed", bottom: "10%", right: "5%" }}>
              <Add />
            </Fab>
          </Tooltip>
        </Link>
      )}

      <Toast open={error} text={error} setStatus={setStatus} />
    </UserHome>
  );
};

export default Tests;
