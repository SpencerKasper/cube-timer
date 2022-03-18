import React, {useState} from 'react';
import {alpha, Button, Dialog, DialogActions, DialogContent, Menu, styled, TextField} from '@mui/material';
import './ScrambleSettings.css';
import axios from "axios";
import {GetScrambleResponse} from "./ScrambleDisplay";
import {UrlHelper} from "../utils/url-helper";
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {Setting} from "./Setting";

const MAX_SCRAMBLE_LENGTH = 100;
export const ScrambleSettings = () => {
    const scrambleSettings = useSelector(settingsSelectors.scrambleSettings);
    const [isOpen, setIsOpen] = useState(false);
    const onScrambleLengthChange = (event) => {
        const scrambleLength = event.target.value;
        if(scrambleLength > MAX_SCRAMBLE_LENGTH) {
            toast.error('The max scramble length is 100.');
        } else if(!Number(scrambleLength) && scrambleLength !== '') {
            toast.error('Scramble length must be a number.');
        } else {
            reduxStore.dispatch({
                type: 'settings/setScrambleSettings',
                payload: {
                    scrambleSettings: {...scrambleSettings, scrambleLength}
                },
            });
        }
    };
    const getScramble = async () => {
        const response = await axios
            .get<GetScrambleResponse>(`${UrlHelper.getScrambleApiDomain()}cubeType/3x3x3?scrambleLength=${scrambleSettings.scrambleLength}`);
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble: response.data.body.scramble}});
    };
    const onClose = () => setIsOpen(false);
    const saveSettings = async () => {
        await getScramble();
        onClose();
    };
    return (
        <div className={'scramble-settings-container'}>
            <Button
                color={'secondary'}
                variant="contained"
                disableElevation
                onClick={() => setIsOpen(true)}
                className={'scramble-settings-menu-button'}
            >
                Scramble Options
            </Button>
            <Dialog fullWidth open={isOpen} onClose={onClose}>
                <h2 className={'settings-title'}>Scramble Settings</h2>
                <DialogContent>
                    <Setting title={'Scramble Length'}>
                        <TextField
                            fullWidth
                            value={scrambleSettings.scrambleLength}
                            onChange={onScrambleLengthChange}
                        />
                    </Setting>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={saveSettings}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};