import React, {useState} from 'react';
import {Stackmat} from '../stackmat/stackmat';
import {toast} from "react-toastify";
import {Packet} from "../stackmat/packet/packet";
import {Button, Menu, MenuItem, styled, alpha} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimerIcon from '@mui/icons-material/Timer';
import './TimerSettings.css';

export const TimerSettings = (props) => {
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
            {...props}
        />
    ))(({ theme }) => ({
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
    const {setTimerState, setCurrentTime, setTimerMode} = props;
    const [selectedSettings, setSelectedSettings] = useState({speedStackTimerEnabled: false})
    const setUpStackmatTimer = () => {
        setSelectedSettings({speedStackTimerEnabled: true});
        const audioContext = new AudioContext();
        const stackmat = new Stackmat(audioContext);
        stackmat.on('starting', (packet: Packet) => {
            setTimerState('starting');
        });
        stackmat.on('started', (packet: Packet) => {
            setTimerState('running');
        });
        stackmat.on('stopped', (packet: Packet) => {
            setTimerState('stopping');
        });
        stackmat.on('packetReceived', (packet: Packet) => {
            setCurrentTime(time => packet.timeInMilliseconds !== time ? packet.timeInMilliseconds : time);
        });
        stackmat.on('timerConnected', (packet: Packet) => {
            toast.success('Stackmat timer has been detected! Using that as the timer source.');
            setTimerMode('speedstack-timer');
        });
        stackmat.on('timerDisconnected', (packet: Packet) => {
            toast.warning('Stackmat timer has been disconnected. Switching to built in timer.');
            setTimerMode('built-in');
            setTimerState('ready');
        });
        stackmat.start();
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={'timer-settings-container'}>
            <Button
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                className={'timer-settings-menu-button'}
            >
                <div style={{paddingRight: '8px'}}>
                    <TimerIcon />
                </div>
                <div>
                    Timer Options
                </div>
            </Button>
            <StyledMenu
                // @ts-ignore
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} disableRipple>
                    {selectedSettings.speedStackTimerEnabled ? <p>SpeedStack timer has been enabled.  Connect it, approve access to your microphone, and turn it on.</p> : <Button onClick={() => setUpStackmatTimer()}>Enable StackMat Timer</Button>}
                </MenuItem>
            </StyledMenu>
        </div>
    )
};