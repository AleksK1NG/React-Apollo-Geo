import React from "react";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const onSuccess = (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log("Google user", idToken);
  };

  return (
    <GoogleLogin
      isSignedIn={true}
      onSuccess={onSuccess}
      clientId="893433774168-fggepcpja3e98mmlphp70b06m250h01n.apps.googleusercontent.com"
    />
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
