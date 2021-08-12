import { UPDATE_NAV_TITLE } from "./types";

export const updateNavTitle = (title) => (dispatch) => {
  dispatch({
    type: UPDATE_NAV_TITLE,
    payload: title,
  });
};
