import {ReduxStore} from "../redux-store";

export default {
    solves: (state: ReduxStore) => state.solveReducer.solves,
}