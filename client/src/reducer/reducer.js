import { LOGIN_USER } from "../actions-types/actions-types";

export default function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };

    default:
      return state;
  }
}