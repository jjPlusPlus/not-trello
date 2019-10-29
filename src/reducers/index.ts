import { combineReducers } from "redux";
import columns from "./columns";

import { AppState } from "../types";

export default combineReducers<AppState>({columns} as any);
