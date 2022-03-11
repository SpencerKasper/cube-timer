interface SessionReducerState {
    signInUserSession: any;
    authState: any;
    isAdmin: boolean;
}

const initialState: SessionReducerState = {
    signInUserSession: {},
    authState: {},
    isAdmin: false,
};

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case 'signInUserSession/set':
            const {user} = action.payload;
            return {
                ...state,
                user,
            }
        default:
            return state
    }
}