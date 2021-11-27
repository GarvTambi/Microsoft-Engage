import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Button, Typography, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import { getTestResults } from "../../helper/API";
import UserHome from "../UserHome";
import { useStyles } from "./Tests";
import Toast from "../utils/Toast";

const ViewTestResults = () => {
  const classes = useStyles();
  const {
    state: { course, test },
  } = useLocation();
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error } = status;

  useEffect(() => {
    getTestResults(course.id, test._id).then((data) => {
      console.log(data);
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setResults(data);
    });
  }, []);

  return (
    <UserHome>
      {results.length > 0 && (
        <Container maxWidth="sm" className={classes.grid}>
          <Card square>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {test.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {`Course: ${course.name}`}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Maximum Marks: {test.maxMarks}
              </Typography>
            </CardContent>

            <CardActions classes={{ root: classes.cardActions }}>
              <Button
                size="small"
                color="secondary"
                onClick={() => setExpanded(!expanded)}>
                {expanded ? "Hide Result" : "Show Result"}
              </Button>
            </CardActions>

            <Collapse in={expanded} timeout="auto">
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>Name</Grid>
                  <Grid item xs={6}>Marks</Grid>
                  {results.map((result, i) => (
                    <>
                      <Grid item key={i} xs={6}>
                        <Typography variant="body2">{result.name}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {result.testSubmissions.marks}
                        </Typography>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        </Container>
      )}

      <Toast open={error} text={error} setStatus={setStatus} />
    </UserHome>
  );
};

export default ViewTestResults;
