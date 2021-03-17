import Axios from "axios";

const url = "https://p8fvjm8zb3.execute-api.eu-west-1.amazonaws.com/Prod/";

export const setToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token !== null) {
    Axios.defaults.headers.common["Authorization"] = token.idToken.jwtToken;
  }
};

setToken();
// Axios.interceptors.response.use(response => response, async error => {
//     const originalRequest = error.config;
//     if(error.response.status === 401 && !originalRequest._retry)
//     {
//         originalRequest._retry = true;
//         try{
//         const {data} = await refreshToken();
//         localStorage.setItem('token', data);
//         Axios.defaults.headers.common['Authorization'] = data.idToken.jwtToken;
//         return Axios.request(originalRequest);
//         }
//         catch(ex)
//         {
//             return Promise.reject(error);
//         }
//     }
// });

export const refreshToken = async () => {
  const token = getUser();
  if (token === null) {
    return;
  }
  const Username = token.idToken.payload.email;
  const refreshToken = token.refreshToken;
  const { data } = await Axios.put(url + "SignIn", { Username, refreshToken });
  localStorage.setItem("token", JSON.stringify(data));
  Axios.defaults.headers.common["Authorization"] = data.idToken.jwtToken;
};

export const login = async (Username, Password) => {
  const { data } = await Axios.post(url + "SignIn", { Username, Password });
  localStorage.setItem("token", JSON.stringify(data));
};

export const signup = (Username, Password) => {
  return Axios.post(url + "SignUp", { type: "SignUp", Username, Password });
};

export const confirmSignup = (Username, Password, ConfirmationCode) => {
  return Axios.post(url + "SignUp", {
    type: "confirmSignUp",
    Username,
    Password,
    ConfirmationCode,
  });
};

export const forgotPassword = (Username) => {
  return Axios.post(url + "ForgotPassword", { Username });
};

export const setNewPassword = (Username, newPassword, verificationCode) => {
  return Axios.post(url + "ForgotPassword", {
    Username,
    newPassword,
    verificationCode,
  });
};

export const getData = () => {
  return Axios.get(url + "bvClientsData");
};

export const updateData = (data) => {
  return Axios.post(url + "bvClientsData", { ...data });
};

export const getUser = () => {
  const token = localStorage.getItem("token");
  if (token === null) {
    return null;
  }
  return JSON.parse(localStorage.getItem("token"));
};
