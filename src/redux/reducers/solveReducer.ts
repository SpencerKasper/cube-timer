export interface Solve {
    scramble: string;
    time: number;
    cubeType: '3x3x3';
    number: number;
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
                solves: [{...action.payload.solve, number: state.solves.length + 1}, ...state.solves],
            }
        default:
            return state
    }
}