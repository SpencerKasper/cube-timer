export type CubeType = '222' | '333' | '444' | '555' | '666' | '777' | 'clock' | 'minx' | 'pyram' | 'sq1' | 'skewb';

export interface ITimerSettings {
    speedStacksTimerEnabled: boolean;
    inspectionTime: number;
    hideTimeDuringSolve: boolean;
}

export interface IScrambleSettings {
    scrambleLengthMap: {[key in CubeType]?: number};
    cubeType: CubeType;
}

interface SettingsReducerState {
    timerSettings: ITimerSettings;
    scrambleSettings: IScrambleSettings;
}

const initialState: SettingsReducerState = {
    timerSettings: {
        speedStacksTimerEnabled: false,
        inspectionTime: 0,
        hideTimeDuringSolve: false,
    },
    scrambleSettings: {
        scrambleLengthMap: {},
        cubeType: '333',
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