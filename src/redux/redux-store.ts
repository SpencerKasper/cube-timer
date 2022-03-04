import {combineReducers, createStore} from 'redux';
import scrambleReducer from "./reducers/scrambleReducer";
import solveReducer from "./reducers/solveReducer";

export interface ReduxStore {
    scrambleReducer: any;
    solveReducer: any;
}

const reducers: ReduxStore = {
    scrambleReducer,
    solveReducer,
};

const reduxStore = createStore(
    combineReducers(reducers)
);

export default reduxStore;
