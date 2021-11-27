import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { useHistory, useLocation } from "react-router-dom";
import { getTest, submitTest } from "../../helper/API";
import UserHome from "../UserHome";
import Toast from "../utils/Toast";
import { useStyles } from "./Assignment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

const ViewTest = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    state: { testID },
  } = useLocation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  useEffect(() => {
    getTest(testID).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setQuestions(data.questions);
    });
  }, []);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(""));
  }, [questions]);

  const handleChange = (event, i) => {
    setAnswers(
      answers.map((ans, id) => {
        if (id === i) ans = event.target.value;
        return ans;
      })
    );
  };

  const onSubmit = () => {
    submitTest(testID, answers).then((data) => {
      if (data.error) setStatus({ error: data.error.trim(), success: false });
      else setStatus({ error: "", success: data.message });
    });
  };

  return (
    <UserHome>
      {questions.length > 0 && (
        <Container maxWidth="md" className={classes.grid}>
          <Grid container spacing={4}>
            {questions.map((q, i) => (
              <Grid item xs={12} key={i}>
                <Card>
                  <Box px={2} py={1}>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {q.title}
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={answers[i]}
                          onChange={(event) => handleChange(event, i)}>
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label={q.opt1}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label={q.opt2}
                          />
                          <FormControlLabel
                            value="3"
                            control={<Radio />}
                            label={q.opt3}
                          />
                          <FormControlLabel
                            value="4"
                            control={<Radio />}
                            label={q.opt4}
                          />
                        </RadioGroup>
                      </FormControl>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "30px" }}
            onClick={onSubmit}>
            Submit
          </Button>
        </Container>
      )}

      <Toast open={error} text={error} setStatus={setStatus} />
      <Toast
        error={false}
        open={success}
        text={success}
        onCloseExtra={() => history.push("/tests")}
        setStatus={setStatus}
        duration={null}
      />
    </UserHome>
  );
};

export default ViewTest;
