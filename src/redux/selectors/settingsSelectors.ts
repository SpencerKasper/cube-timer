import {ReduxStore} from "../redux-store";

export default {
    timerSettings: (state: ReduxStore) => state.settingsReducer.timerSettings,
    scrambleSettings: (state: ReduxStore) => state.settingsReducer.scrambleSettings,
}