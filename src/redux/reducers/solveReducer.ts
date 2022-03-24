import {CubeType} from "./settingsReducer";

export interface ISolveSession {
    sessionId: string;
    userId?: string;
    name: string;
}

export interface Solve {
    userId: string;
    solveId: string;
    sessionId?: string;
    scramble: string;
    time: number;
    cubeType: CubeType | '3x3x3';
    number: number;
    plusTwo: boolean;
    dnf: boolean;
}

interface SolveReducerState {
    solves: Solve[];
    sessions: ISolveSession[];
    selectedSession?: ISolveSession;
}

const DEFAULT_SESSION: ISolveSession = {
    sessionId: 'DEFAULT_SESSION',
    name: 'Default Session',
};

const initialState: SolveReducerState = {
    solves: [],
    selectedSession: DEFAULT_SESSION,
    sessions: [DEFAULT_SESSION],
};

export default function solveReducer(state = initialState, action) {
    switch (action.type) {
        case 'solves/add':
            return {
                ...state,
                solves: [{...action.payload.solve, number: state.solves.length + 1}, ...state.solves],
            };
        case 'solves/set':
            return {
                ...state,
                solves: action.payload.solves,
            };
        case 'solves/set-sessions':
            return {
                ...state,
                sessions: [DEFAULT_SESSION, ...action.payload.sessions],
            };
        case 'solves/set-selected-session':
            return {
                ...state,
                selectedSession: action.payload.selectedSession,
            };
        default:
            return state
    }
}