import React, { useContext } from "react";
import Login from "../components/Auth/Login";
import Context from "../context/context";
import { Redirect } from "react-router-dom";

const Splash = () => {
  const { state } = useContext(Context);

  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
