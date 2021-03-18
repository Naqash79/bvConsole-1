import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { setNewPassword, getUser, setToken, login } from "./service";
import { UserContext } from "./UserContext";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/;

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
}));

export default function ResetPassword() {
  const classes = useStyles();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [username, setUsername] = useState(params.get("username") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(
    params.get("confirmationCode") || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (!password.match(PASSWORD_REGEX)) {
      setError(
        "Password must contain 1 capital letter. 1 small letter. 1 number. 1 special character"
      );
      return false;
    }
    return true;
  };

  const handleConfirm = async (event) => {
    setError(null);
    event.preventDefault();
    if (!validatePassword()) {
      return;
    }
    try {
      setLoading(true);
      await setNewPassword(username, password, confirmationCode);
      await login(username, password);
      setToken();
      setUser(getUser());
      navigate("/", { replace: true });
    } catch (ex) {
      setError(ex.response?.data?.message);
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
          Reset Password
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleConfirm}>
          <Box marginY={2} hidden={error === null ? true : false}>
            <Alert severity="error">{error}</Alert>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="confirmationCode"
                label="ConfirmationCode"
                name="confirmationCode"
                autoComplete="confirmationCode"
                value={confirmationCode}
                onChange={(event) => setConfirmationCode(event.target.value)}
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
            {loading ? <CircularProgress /> : "Confirm Reset"}
          </Button>
          <Grid container justify="space-between">
            <Grid item>
              <Link
                component={RouterLink}
                variant="body2"
                to="/forgot-password"
              >
                Resend Link
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
