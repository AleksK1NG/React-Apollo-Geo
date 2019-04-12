import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";

import { withStyles } from "@material-ui/core/styles";
import Context from "../../context/context";
import { IS_LOGGED_IN, LOGIN_USER } from "../../actions-types/actions-types";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../hooks/useClient";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(ME_QUERY);

      dispatch({ type: LOGIN_USER, payload: me });
      dispatch({ type: IS_LOGGED_IN, payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = (error) => {
    console.error("Login error ", error);
    dispatch({ type: IS_LOGGED_IN, payload: false });
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        buttonText="Login with Google"
        isSignedIn={true}
        onSuccess={onSuccess}
        onFailure={onFailure}
        clientId="893433774168-fggepcpja3e98mmlphp70b06m250h01n.apps.googleusercontent.com"
        theme="dark"
      />
    </div>
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
