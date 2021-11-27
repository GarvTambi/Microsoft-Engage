import React from "react";
import {
  Button,
  CssBaseline,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Copyright, rootStyle } from "../Commons";

const useStyles = makeStyles((theme) => ({
  authBtn: { marginTop: theme.spacing(4) },
  main: { marginTop: theme.spacing(10), marginBottom: theme.spacing(8) },
  root: rootStyle,
  footer: {
     Color: theme.palette.background.paper,
    padding: theme.spacing(4),
    marginTop: "auto",
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <div className={classes.root}  style={{backgroundImage:"url('M5.jpeg')", backgroundPosition: 'center',
      height: '125vh',backgroundRepeat: 'no-repeat'}}>
        <main className={classes.main} >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom>
              Microsoft Kaksha
            </Typography>

            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph>
              A digital platform that gives students and teachers an array of digital academic and social 
              tools to stay engaged with their studies, peers during pandemic.
            </Typography>

            <div className={classes.authBtn}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/signup"
                    disableElevation>
                    Sign-up
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/signin"
                    disableElevation>
                    Sign-in
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </main>

        <footer className={classes.footer}>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p">
          
          </Typography>
          <Copyright />
        </footer>
      </div>
    </>
  );
}
