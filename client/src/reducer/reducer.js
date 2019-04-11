import {
  CREATE_DRAFT,
  CREATE_PIN,
  DELETE_DRAFT,
  GET_PINS,
  IS_LOGGED_IN,
  LOGIN_USER,
  SIGNOUT_USER,
  UPDATE_DRAFT_LOCATION
} from "../actions-types/actions-types";

export default function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    case IS_LOGGED_IN:
      return { ...state, isAuth: payload };
    case SIGNOUT_USER:
      return { ...state, currentUser: null, isAuth: false };
    case CREATE_DRAFT:
      return { ...state, draft: { latitude: 0, longitude: 0 } };
    case UPDATE_DRAFT_LOCATION:
      return { ...state, draft: payload };
    case DELETE_DRAFT:
      return { ...state, draft: null };
    case GET_PINS:
      return { ...state, pins: payload };
    case CREATE_PIN:
      const newPin = payload;
      const prevPins = state.pins.filter((pin) => pin._id !== newPin._id);
      return { ...state, pins: [...prevPins, newPin] };

    default:
      return state;
  }
}
