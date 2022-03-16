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

const MAX_SCRAMBLE_LENGTH = 100;
export const ScrambleSettings = () => {
    const StyledMenu = styled((props) => (
        // @ts-ignore
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            autoFocus={false}
            variant={'menu'}
            {...props}
        />
    ))(({theme}) => ({
        '.MuiButton-text': {
            color: '#051014'
        },
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));
    const scrambleSettings = useSelector(settingsSelectors.scrambleSettings);
    const [isOpen, setIsOpen] = useState(false);
    const onScrambleLengthChange = (event) => {
        const scrambleLength = event.target.value;
        if(scrambleLength > MAX_SCRAMBLE_LENGTH) {
            toast.error('The max scramble length is 100.');
        } else if(!Number(scrambleLength)) {
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
                    <TextField
                        fullWidth
                        label={'Scramble Length'}
                        value={scrambleSettings.scrambleLength}
                        onChange={onScrambleLengthChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={saveSettings}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};