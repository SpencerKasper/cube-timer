import React, {useState} from 'react';
import axios from "axios";
import {UrlHelper} from "../../utils/url-helper";
import {useSelector} from "react-redux";
import sessionSelectors from "../../redux/selectors/sessionSelectors";
import {Button, Dialog, DialogActions, DialogContent, TextField} from "@mui/material";
import {Setting} from "../common/Setting";
import reduxStore from "../../redux/redux-store";
import {toast} from "react-toastify";

export const AddSessionModal = (props: { onClose, isOpen?: boolean }) => {
    const [newSession, setNewSession] = useState({name: ''});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const user = useSelector(sessionSelectors.user);

    const onAddSession = async () => {
        try {
            const response = await axios.post(`${UrlHelper.getSolveSessionApiDomain()}/sessions`, {...newSession, userId: user.attributes.email});
            onClose();
            reduxStore.dispatch({
                type: 'solves/set-sessions',
                payload: {sessions: response.data.body.sessions},
            });
            toast.success(`Successfully created a new session with name "${newSession.name}".`);
        } catch(e) {
            toast.error(`There was an error creating new session with name "${newSession.name}".`)
        }
    }

    const onClose = () => {
        props.onClose();
        setIsDialogOpen(false);
    };
    const onChange = (event) => setNewSession({name: event.target.value});
    return (
        <Dialog fullWidth open={props.isOpen || isDialogOpen} onClose={onClose}>
            <DialogContent>
                <h2>Add Session</h2>
                <Setting title={'Name'}>
                    <TextField fullWidth value={newSession.name} onChange={onChange}/>
                </Setting>
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={onClose}>Close</Button>
                <Button color={'secondary'} onClick={onAddSession}>Create</Button>
            </DialogActions>
        </Dialog>
    )
};