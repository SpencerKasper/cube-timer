import {combineReducers, createStore} from 'redux';

export interface ReduxStore {
    someReducer: any
}

const reducers: ReduxStore = {
    someReducer: () => null
};

const reduxStore = createStore(
    combineReducers(reducers)
);

export default reduxStore;
