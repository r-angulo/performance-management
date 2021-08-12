import { UPDATE_NAV_TITLE } from "../actions/types";

const initialState = {
  pageTitle: "Feedback Company Name",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_NAV_TITLE:
      return {
        ...state,
        pageTitle: action.payload,
      };
    default:
      return state;
  }
}
