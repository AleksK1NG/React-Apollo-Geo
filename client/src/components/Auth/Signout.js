import React, { useContext } from 'react';
import { GoogleLogout } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import Context from '../../context/context';
import { SIGNOUT_USER } from '../../actions-types/actions-types';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const Signout = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const { dispatch } = useContext(Context);

  const onSignout = () => {
    dispatch({ type: SIGNOUT_USER });
    console.log('Sign out');
  };

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      clientId="893433774168-fggepcpja3e98mmlphp70b06m250h01n.apps.googleusercontent.com"
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography
            variant="body1"
            className={classes.buttonText}
            style={{ display: mobileSize ? 'none' : 'block' }}
          >
            Signout
          </Typography>
          <ExitToAppIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex'
  },
  buttonText: {
    color: 'orange'
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'orange'
  }
};

export default withStyles(styles)(Signout);
