import React, {useEffect} from 'react';
import {InputLabel, MenuItem, Select} from "@mui/material";
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import sessionSelectors from "../redux/selectors/sessionSelectors";
import axios from "axios";
import reduxStore from "../redux/redux-store";
import {UrlHelper} from "../utils/url-helper";

const SessionSelectionDropDown = () => {
    const selectedSession = useSelector(solveSelectors.selectedSession);
    const allSessions = useSelector(solveSelectors.sessions);
    const user = useSelector(sessionSelectors.user);

    useEffect(() => {
        if(user) {
            fetchSessionsForUser()
                .then(() => null);
        }
    }, [user]);

    const fetchSessionsForUser = async () => {
        const response = await axios.get(`${UrlHelper.getSolveSessionApiDomain()}sessions?userId=${user.attributes.email}`);
        reduxStore.dispatch({type: 'solves/set-sessions', payload: {sessions: response.data.body.sessions}})
    };

    const onSessionChange = (event) => {
        const selectedSessionId = event.target.value;
        const nextSelectedSession = allSessions.find(session => session.sessionId === selectedSessionId);
        reduxStore.dispatch({type: 'solves/set-selected-session', payload: {selectedSession: nextSelectedSession}});
    };

    return (
        <div>
            <InputLabel id="selected-session-label-id">Current Session</InputLabel>
            <Select
                color={'secondary'}
                labelId={'selected-session-label-id'}
                value={selectedSession.sessionId}
                label="Current Session"
                fullWidth
                onChange={onSessionChange}
            >
                {allSessions.map((session, index) =>
                    <MenuItem
                        key={index}
                        value={session.sessionId}>
                        {session.name}
                    </MenuItem>
                )}
            </Select>
        </div>
    );
};

export default SessionSelectionDropDown;