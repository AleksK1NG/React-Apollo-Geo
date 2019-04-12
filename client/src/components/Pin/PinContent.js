import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Context from '../../context/context';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FaceIcon from '@material-ui/icons/Face';
import format from 'date-fns/format';
import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';

const PinContent = ({ classes }) => {
  const {
    state: { currentPin }
  } = useContext(Context);

  return (
    <div className={classes.root}>
      <Typography component="h2" color="primary" variant="h4" gutterBottom>
        {currentPin.title}
      </Typography>
      <Typography
        className={classes.text}
        component="h3"
        variant="h6"
        color="inherit"
        gutterBottom
      >
        <FaceIcon className={classes.icon} /> {currentPin.author.name}
      </Typography>
      <Typography
        className={classes.text}
        variant="subtitle2"
        color="inherit"
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />
        {format(Number(currentPin.createdAt), 'MMM Do, YYYY')}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        <AccessTimeIcon className={classes.icon} />
        {currentPin.content}
      </Typography>

      {/*Pin Comments*/}
      <CreateComment />
      <Comments comments={currentPin.comments} />
    </div>
  );
};

const styles = (theme) => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%'
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default withStyles(styles)(PinContent);
