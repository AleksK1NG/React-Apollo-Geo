import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../context/context";
import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import { Paper } from "@material-ui/core";

const Blog = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  // let BlogContent;
  // if (!state.draft) {
  //   // no content
  //   BlogContent = <NoContent />;
  // } else {
  //   BlogContent = <CreatePin />;
  // }

  return (
    <Paper className={classes.root}>
      {!state.draft ? <NoContent/> : <CreatePin/>}
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
