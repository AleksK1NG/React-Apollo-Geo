import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import Context from '../../context/context';
import { DELETE_DRAFT } from '../../actions-types/actions-types';
import axios from 'axios';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../hooks/useClient';

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async () => {
    const formData = new FormData();

    formData.append('file', image);
    formData.append('upload_preset', 'geopins');
    formData.append('cloud_name', 'dxumnbnoe');

    try {
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dxumnbnoe/image/upload',
        formData
      );
      return data.url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDraft = () => {
    setTitle('');
    setContent('');
    setImage('');
    dispatch({ type: DELETE_DRAFT });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitting(true);

      const url = await handleImageUpload();
      const variables = {
        title,
        image: url,
        content,
        longitude: state.draft.longitude,
        latitude: state.draft.latitude
      };

      await client.request(CREATE_PIN_MUTATION, variables);

      handleDeleteDraft();
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />
      </Typography>

      <div>
        <TextField
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          label="Title"
          placeholder="Enter title"
        />
        <input
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
        />
        <label htmlFor="image">
          <Button
            style={{ color: image && 'green' }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          onChange={(e) => setContent(e.target.value)}
          name="content"
          label="Content"
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
        />
      </div>
      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <ClearIcon className={classes.leftIcon} />
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || !image || submitting}
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  },
  input: {
    display: 'none'
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
