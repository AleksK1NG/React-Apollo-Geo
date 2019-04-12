import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import { useClient } from '../../hooks/useClient';
import Context from '../../context/context';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';
import { CREATE_COMMENT } from '../../actions-types/actions-types';

const CreateComment = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const client = useClient();
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const variables = { pinId: state.currentPin._id, text: comment };
      const { createComment } = await client.request(
        CREATE_COMMENT_MUTATION,
        variables
      );
      dispatch({ type: CREATE_COMMENT, payload: createComment });
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <form className={classes.form}>
        <IconButton
          onClick={() => setComment('')}
          disabled={!comment.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          multiline={true}
          className={classes.input}
          placeholder="Add Comment"
        />
        <IconButton
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </React.Fragment>
  );
};

const styles = (theme) => ({
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: 'red'
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
