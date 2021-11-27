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
              {expanded[id.id][id.i] ? "Hide" : "Show"}
              
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
          

            
        </Container>
      )}

      {!isStudent && (
        <Link onClick={() => history.push("/poll/create")}>
          <Tooltip title="Add Poll" aria-label="add">
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
