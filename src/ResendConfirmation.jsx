import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { resendConfirmation } from "./service";
import { Box, CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textInput: {
    background:"#fff",


    borderRadius: "5px"
  },
}));

export default function ResendConfirmation() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setError(null);
    event.preventDefault();
    try {
      setLoading(true);
      await resendConfirmation(username);
      navigate("/signup");
    } catch (ex) {
      setError(ex.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resend Confirmation
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Box marginY={2} hidden={error === null ? true : false}>
            <Alert severity="error">{error}</Alert>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                className={classes.textInput}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : "Send Confirmation"}
          </Button>
          <Grid container justify="space-between">
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Back to Signup
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
