import { History } from "history";
import { combineReducers } from "redux";
import * as configReducer from './config';
import * as notestoreReducer from './notestore';


import * as snackbarReducer from './snackbarEvent';
import { SnackbarEvent } from "../model";
import { NoteStore } from '../model';

export interface RootState {
	drawerOpen: boolean;
    snackbarEvents: SnackbarEvent[];	
	notestore: 	NoteStore;
}

export default (history: History) =>
	combineReducers({
		...configReducer,
		...snackbarReducer,
		...notestoreReducer,
	});
