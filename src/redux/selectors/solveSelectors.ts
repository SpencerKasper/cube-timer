import {ReduxStore} from "../redux-store";

export default {
    solves: (state: ReduxStore) => state.solveReducer.solves,
    selectedSession: (state: ReduxStore) => state.solveReducer.selectedSession,
    sessions: (state: ReduxStore) => state.solveReducer.sessions,
}