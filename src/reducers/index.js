import { combineReducers } from "redux";
import columns from './columns';
import cards from './cards';
import modal from './modal';

export default combineReducers({columns, cards, modal});
