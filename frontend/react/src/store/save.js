import { SAVE_FINISHED, SAVE_STARTED } from "./saveMiddleware";
import { SET_STATE_STATUS } from "../actions/initial";
import { certifyAndSubmit } from "../actions/certify";

const initial = {
  error: false,
  errorMessage: null,
  lastSave: null,
  saving: false,
};

export default (state = initial, action) => {
  switch (action.type) {
    case SAVE_STARTED:
      return {
        ...state,
        saving: true,
      };

    case certifyAndSubmit.success:
      return {
        ...state,
        lastSave: new Date(),
      };

    case SAVE_FINISHED:
      return {
        error: action.error,
        errorMessage: action.errorMessage,
        lastSave: action.error ? state.lastSave : new Date(),
        saving: false,
      };

    case SET_STATE_STATUS:
      return {
        ...state,
        lastSave:
          action.payload.last_changed && new Date(action.payload.last_changed),
      };

    default:
      return state;
  }
};
