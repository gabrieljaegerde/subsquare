import { combineReducers } from "@reduxjs/toolkit";

import toastReducer from "./toastSlice";
import nodeReducer from "./nodeSlice";
import chainReducer from "./chainSlice";
import tipReducer from "./tipSlice";
import referendumReducer from "./referendumSlice";
import gov2ReferendumReducer from "./gov2ReferendumSlice";

export default combineReducers({
  toast: toastReducer,
  node: nodeReducer,
  chain: chainReducer,
  tip: tipReducer,
  referendum: referendumReducer,
  gov2Referendum: gov2ReferendumReducer,
});
