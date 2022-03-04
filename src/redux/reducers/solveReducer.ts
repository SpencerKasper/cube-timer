interface Solve {
    scramble: string;
    time: number;
    cubeType: '3x3x3';

}

interface SolveReducerState {
    solves: Solve[];
}

const initialState: SolveReducerState = {
    solves: [],
};

export default function solveReducer(state = initialState, action) {
    switch (action.type) {
        case 'solve/add':
            return {
                ...state,
                solves: [...state.solves, action.payload.solve],
            }
        default:
            return state
    }
}