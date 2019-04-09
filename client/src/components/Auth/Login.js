import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";

import { withStyles } from "@material-ui/core/styles";
import Context from "../../context/context";
import { LOGIN_USER } from "../../actions-types/actions-types";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });

    const data = await client.request(ME_QUERY);
    console.log("data from ME_QUERY => ", data);
    dispatch({ type: LOGIN_USER, payload: data.me });
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
