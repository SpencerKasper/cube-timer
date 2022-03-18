interface SettingsReducerState {
    timerSettings: {
        speedstacksTimerEnabled: boolean;
        inspectionTime: number;
    };
    scrambleSettings: {
        scrambleLength: number;
    }
}

const initialState: SettingsReducerState = {
    timerSettings: {
        speedstacksTimerEnabled: false,
        inspectionTime: 0,
    },
    scrambleSettings: {
        scrambleLength: 30,
    },
};

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case 'settings/setTimerSettings':
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