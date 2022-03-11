import {combineReducers, createStore} from 'redux';
import scrambleReducer from "./reducers/scrambleReducer";
import sessionReducer from './reducers/sessionReducer';
import solveReducer from "./reducers/solveReducer";

export interface ReduxStore {
    sessionReducer: any;
    scrambleReducer: any;
    solveReducer: any;
}

const reducers: ReduxStore = {
    scrambleReducer,
    solveReducer,
    sessionReducer,
};

const reduxStore = createStore(
    combineReducers(reducers)
);

export default reduxStore;
