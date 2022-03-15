interface SettingsReducerState {
    timerSettings: {
        speedstacksTimerEnabled: boolean;
    };
    scrambleSettings: {
        scrambleLength: number;
    }
}

const initialState: SettingsReducerState = {
    timerSettings: {
        speedstacksTimerEnabled: false,
    },
    scrambleSettings: {
        scrambleLength: 30,
    },
};

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'settings/setTimerSettings':
            console.error(action.payload);
            return {
                ...state,
                timerSettings: action.payload.timerSettings,
            };
        case 'settings/setScrambleSettings':
            return {
                ...state,
                scrambleSettings: action.payload.scrambleSettings,
            };
        default:
            return state
    }
}