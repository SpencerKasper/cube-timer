interface ScrambleReducerState {
    scramble: string;
    scrambleLength: number;
    type: '3x3x3';
}

const initialState: ScrambleReducerState = {
    scramble: '',
    scrambleLength: 20,
    type: '3x3x3',
};

export default function scrambleReducer(state = initialState, action) {
    switch (action.type) {
        case 'scrambles/set':
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}