import {ReduxStore} from "../redux-store";

export default {
    user: (state: ReduxStore) => state.sessionReducer.user,
}