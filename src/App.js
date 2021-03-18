import { Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import { getUser, refreshToken } from "./service";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import ForgotPassword from "./ForgotPassword";
import ResendConfirmation from "./ResendConfirmation";
import ResetPassword from "./ResetPassword";
// import Background from './logo512.png';

// var sectionStyle = {
//   width: "100%",
//   height: "400px",
//   backgroundImage: "url(" + { Background } + ")"
// };
const App = () => {
  useEffect(() => {
    const refresh = async () => {
      try {
        await refreshToken();
      } catch (ex) {
        localStorage.clear();
        window.location = "/login";
      }
    };
    refresh();
  }, []);
  const [user, setUser] = useState(getUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="resend-confirmation">
          <ResendConfirmation />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password">
          <ResetPassword />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoute path="/">
          <Dashboard />
        </ProtectedRoute>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
