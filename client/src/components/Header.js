import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../context/context";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Map from "@material-ui/icons/Map";
import Typography from "@material-ui/core/Typography";
import Signout from "./Auth/Signout";

const Header = ({ classes }) => {
  const {
    state: { currentUser }
  } = useContext(Context);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow}>
            <Map className={classes.icon} />
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              GeoPins
            </Typography>
          </div>
          {/*Current User*/}
          {currentUser && (
            <div className={classes.grow}>
              <img
                src={currentUser.picture}
                alt={currentUser.name}
                className={classes.picture}
              />
              <Typography variant="h5" color="inherit" noWrap>
                {currentUser.name}
              </Typography>
            </div>
          )}


          <Signout/>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: "green",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginRight: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Header);
