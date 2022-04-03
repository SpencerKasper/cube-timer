import React, {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, TextField} from "@mui/material";
import SessionSelectionDropDown from "../drop-downs/SessionSelectionDropDown";
import {DEFAULT_SESSION, ISolveSession} from "../../redux/reducers/solveReducer";
import _ from 'lodash';
import {CollapsableAlert} from "../common/CollapsableAlert";
import {toast} from "react-toastify";

const EMPTY_SESSION: ISolveSession = {
    sessionId: '',
    userId: '',
    name: '',
};
const ALERT_TEXT = 'Here you can change details about the session you select in the drop down.'
export const ManageSessionsCard = () => {
    const [selectedSession, setSelectedSession] = useState<ISolveSession>(DEFAULT_SESSION);
    function getEditableSession() {
    const NON_EDITABLE_SESSION_DETAILS = {sessionId: selectedSession.sessionId, userId: selectedSession.userId};
        return {...EMPTY_SESSION, ...NON_EDITABLE_SESSION_DETAILS};
    }

    const [updatedSession, setUpdatedSession] = useState(getEditableSession());

    useEffect(() => {
        setUpdatedSession(getEditableSession());
    }, [selectedSession]);
    const onNameChange = (event) => setUpdatedSession({...updatedSession, name: event.target.value});
    const hasEditBeenMade = () => !_.isEqual(selectedSession, updatedSession) && !_.isEqual(updatedSession, getEditableSession());
    const saveUpdates = () => toast.warning('This feature isn\'t quite ready yet.  Sorry for the inconvenience!');
    return (
        <Card className={'manage-sessions-card'}>
            <CardContent>
                <CollapsableAlert text={ALERT_TEXT} />
                <div className={'flex-row title-row'}>
                    <h2>Edit Session</h2>
                    <SessionSelectionDropDown
                        allowAdd={false}
                        onChange={async (session) => setSelectedSession(session)}/>
                </div>
                <div className={'flex-row session-details-form'}>
                    <p className={'label'}>Session Name</p>
                    <TextField
                        disabled={!selectedSession}
                        placeholder={selectedSession.name}
                        value={updatedSession.name}
                        onChange={onNameChange}/>
                </div>
            </CardContent>
            <CardActions className={'action-section'}>
                <Button onClick={saveUpdates} disabled={!hasEditBeenMade()} variant={'contained'} color={'success'}>Save</Button>
            </CardActions>
        </Card>
    )
};