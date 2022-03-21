interface SessionReducerState {
    user?: {attributes: {email: string;}}
}

const initialState: SessionReducerState = {};

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case 'signInUserSession/set':
            const {user} = action.payload;
            return {
                ...state,
                user,
            };
        default:
            return state
    }
}