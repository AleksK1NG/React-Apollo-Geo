import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { Subscription } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import PinIcon from './PinIcon';
import Context from '../context/context';
import {
  CREATE_COMMENT,
  CREATE_DRAFT,
  CREATE_PIN,
  DELETE_PIN,
  GET_PINS,
  SET_PIN,
  UPDATE_DRAFT_LOCATION
} from '../actions-types/actions-types';
import Blog from './Blog';
import { GET_PINS_QUERY } from '../graphql/queries';
import { useClient } from '../hooks/useClient';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION
} from '../graphql/subscriptions';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const INITIAL_VIEWPORT = {
  latitude: 55.755826,
  longitude: 37.6173,
  zoom: 13
};

const Map = ({ classes }) => {
  const client = useClient();
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    getPins();
  }, []);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);

  // remove popup is pin deleted by author of the pin
  useEffect(() => {
    const pinExists =
      popup && state.pins.findIndex((pin) => pin._id === popup._id) > -1;
    if (!pinExists) {
      setPopup(null);
    }
  }, [state.pins.length]);

  useEffect(() => {
    getUserPosition();
  }, []);

  const getPins = async () => {
    try {
      const { getPins } = await client.request(GET_PINS_QUERY);
      dispatch({ type: GET_PINS, payload: getPins });
    } catch (error) {
      console.error(error);
    }
  };

  const setGeoData = ({ latitude, longitude }) => {
    setViewport({ ...viewport, latitude, longitude });
    setUserPosition({ latitude, longitude });
  };

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // setViewport({ ...viewport, latitude, longitude });
        // setUserPosition({ latitude, longitude });
        setGeoData({ latitude, longitude });
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: CREATE_DRAFT });
    }

    const [longitude, latitude] = lngLat;
    dispatch({ type: UPDATE_DRAFT_LOCATION, payload: { longitude, latitude } });
  };

  const highlightNewPin = (pin) => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;

    return isNewPin ? 'limegreen' : 'darkblue';
  };

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({ type: SET_PIN, payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handleDeletePin = async (pin) => {
    const variables = { pinId: pin._id };
    try {
      await client.request(DELETE_PIN_MUTATION, variables);

      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        scrollZoom={!mobileSize}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiYWxleGsxbmciLCJhIjoiY2p1YXh6ZXdzMDc1MzQ0bWl5Nmt0NmFidCJ9.Mlb5if_o696XwJFClyxI5w"
        {...viewport}
        onViewportChange={(newViewport) => setViewport(newViewport)}
        onClick={handleMapClick}
      >
        {/*Navigation control*/}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={(newViewport) => setViewport(newViewport)}
          />
        </div>
        {/*Pin of position*/}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon color="red" size={40} />
          </Marker>
        )}

        {/*Draft Pin*/}

        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon color="hotpink" size={40} />
          </Marker>
        )}

        {/*Created Pins*/}
        {state.pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              color={highlightNewPin(pin)}
              size={40}
            />
          </Marker>
        ))}

        {/*Popup dialog*/}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              src={popup.image}
              alt={popup.title}
              className={classes.popupImage}
            />
            <div className={popup.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {!isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/*Subscriptions for Pins*/}

      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log('Subscription => ', pinAdded);
          dispatch({ type: CREATE_PIN, payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log('Subscription => ', pinUpdated);
          dispatch({ type: CREATE_COMMENT, payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log('Subscription => ', pinDeleted);
          dispatch({ type: DELETE_PIN, payload: pinDeleted });
        }}
      />

      {/*Blog*/}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};

export default withStyles(styles)(Map);
