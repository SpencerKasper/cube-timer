import {combineReducers, createStore} from 'redux';
import scrambleReducer from "./reducers/scrambleReducer";
import sessionReducer from './reducers/sessionReducer';
import solveReducer from "./reducers/solveReducer";
import settingsReducer from "./reducers/settingsReducer";

export interface ReduxStore {
    sessionReducer: any;
    scrambleReducer: any;
    solveReducer: any;
    settingsReducer: any;
}

const reducers: ReduxStore = {
    scrambleReducer,
    solveReducer,
    sessionReducer,
    settingsReducer,
};

const reduxStore = createStore(
    combineReducers(reducers)
);

export default reduxStore;
