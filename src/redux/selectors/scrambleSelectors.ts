import {ReduxStore} from "../redux-store";

export default {
    scramble: (state: ReduxStore) => state.scrambleReducer.scramble,
}