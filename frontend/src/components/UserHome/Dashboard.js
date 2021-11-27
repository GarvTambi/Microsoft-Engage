import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Fab,
  Link,
  CardActions,
  Button,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import copyText from "copy-text-to-clipboard";
import { getCourses, isAuthenticated, unlinkCourse } from "../../helper/API";
import UserHome from "../UserHome";
import LetterAvatar from "../utils/LetterAvatar";
import Toast from "../utils/Toast";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  main: { marginTop: theme.spacing(10), marginBottom: theme.spacing(8) },
  grid: { padding: theme.spacing(0, 6) },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  cardContent: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  media: {
    height: 150,
    width: "100%",
    fontSize: "2.5rem",
    letterSpacing: "0.1rem",
  },
  cardActions: { justifyContent: "flex-end", paddingTop: 0, paddingRight: 10 },
}));

const Dashboard = () => {
  const { id, isStudent } = isAuthenticated();
  const classes = useStyles();
  const history = useHistory();
  const [courses, setCourses] = useState([]);

  const [update, setUpdate] = useState(true);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  useEffect(() => {
    if (update) {
      getCourses(id).then((data) => {
        if (data.error) {
          setStatus({ error: data.error.trim(), success: false });
          setCourses([]);
        } else {
          setUpdate(false);
          setCourses(data.courses);
        }
      });
    }
  }, [update]);

  const unlink = (courseID) => {
    unlinkCourse(courseID).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else {
        setUpdate(true);
        setStatus({ error: "", success: data.message.trim() });
      }
    });
  };

  return (
    <UserHome>
      <main className={classes.main}>
        {courses.length > 0 && (
          <Container maxWidth="md" className={classes.grid}>
            <Grid container spacing={4}>
              {courses.map((course, id) => (
                <Grid item key={id} xs={12} sm={6} md={4}>
                  <Card className={classes.card} raised>
                    <Link
                      onClick={() =>
                        history.push("/assignment", {
                          courseID: course._id,
                          name: course.name,
                        })
                      }

                      

                      underline="none"
                      color="inherit">
                      <LetterAvatar text={course.name} css={classes.media} />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {course.name}
                        </Typography>
                        <Typography color="textSecondary">
                          {course.professor.name}
                        </Typography>
                      </CardContent>
                    </Link>
                    <CardActions classes={{ root: classes.cardActions }}>
                      {!isStudent && (
                        <Button
                          size="small"
                          color="secondary"
                          disableElevation
                          onClick={() => copyText(course._id)}>
                          Copy ID
                        </Button>
                      )}
                      {isStudent && (
                        <Button
                          size="small"
                          disableElevation
                          color="secondary"
                          onClick={() => unlink(course._id)}>
                          Unlink
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}

        <Link href={isStudent ? "/courses/link" : "/courses/create"}>
          <Tooltip title="Add Course" aria-label="add" arrow interactive>
            <Fab
              color="primary"
              aria-label="add"
              style={{ position: "fixed", bottom: "10%", right: "5%" }}>
              <Add />
            </Fab>
          </Tooltip>
        </Link>

        <Toast open={error} text={error} setStatus={setStatus} />
        <Toast
          error={false}
          open={success}
          text={success}
          onCloseExtra={() => setUpdate(false)}
          setStatus={setStatus}
        />
      </main>
    </UserHome>
  );
};

export default Dashboard;
