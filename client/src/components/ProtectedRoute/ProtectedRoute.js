import React, { useContext } from "react";
import Context from "../../context/context";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);

  return (
    <Route
      render={(props) =>
        !state.isAuth ? <Redirect to="/login" /> : <Component />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
