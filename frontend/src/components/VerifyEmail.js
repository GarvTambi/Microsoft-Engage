import React, { useEffect } from "react";
import { Container, Typography } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import { verifyEmailAPI } from "../helper/API";

const VerifyEmail = () => {
  const search = useLocation().search;
  const history = useHistory();

  const verify = () => {
    const token = new URLSearchParams(search).get("t");
    verifyEmailAPI(token)
      .then((data) => {
        console.log(data);
        history.push("/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(verify, []);

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Typography variant="h2">Verifying Email...</Typography>
    </Container>
  );
};

export default VerifyEmail;
