import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, TextField} from '@mui/material';
import './ScrambleSettings.css';
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {Setting} from "./common/Setting";
import {CubeSelectionDropDown} from "./drop-downs/CubeSelectionDropDown";

const MAX_SCRAMBLE_LENGTH = 100;

export const ScrambleSettings = () => {
    const scrambleSettings = useSelector(settingsSelectors.scrambleSettings);
    const {cubeType, scrambleLengthMap} = scrambleSettings;
    const [isOpen, setIsOpen] = useState(false);
    const onScrambleLengthChange = (event) => {
        const scrambleLength = event.target.value;
        if (scrambleLength > MAX_SCRAMBLE_LENGTH) {
            toast.error('The max scramble length is 100.');
        } else if (!Number(scrambleLength) && scrambleLength !== '') {
            toast.error('Scramble length must be a number.');
        } else {
            reduxStore.dispatch({
                type: 'settings/setScrambleSettings',
                payload: {
                    scrambleSettings: {
                        ...scrambleSettings,
                        scrambleLengthMap: {...scrambleLengthMap, [cubeType]: scrambleLength},
                    }
                },
            });
        }
    };
    const onClose = () => setIsOpen(false);
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
                            value={scrambleLengthMap.hasOwnProperty(cubeType) ? scrambleLengthMap[cubeType] : ''}
                            onChange={onScrambleLengthChange}
                        />
                    </Setting>
                    <Setting title={'Cube Type'}>
                        <CubeSelectionDropDown/>
                    </Setting>
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};