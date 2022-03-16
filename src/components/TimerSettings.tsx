import React, {useState} from 'react';
import {Stackmat} from '../stackmat/stackmat';
import {toast} from "react-toastify";
import {Packet, PacketStatus} from "../stackmat/packet/packet";
import {alpha, Button, Menu, MenuItem, styled} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimerIcon from '@mui/icons-material/Timer';
import './TimerSettings.css';
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {useSelector} from "react-redux";

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
    const {setTimerInfo, setCurrentTime} = props;
    const timerSettings = useSelector(settingsSelectors.timerSettings);
    const [previousPacketStatus, setPreviousPacketStatus] = useState('I');
    const setUpStackmatTimer = () => {
        const audioContext = new AudioContext();
        const stackmat = new Stackmat(audioContext);
        reduxStore.dispatch({type: 'settings/setTimerSettings', payload: {
            timerSettings: {
                ...timerSettings,
                speedstacksTimerEnabled: true,
            },
        }});
        stackmat.on('starting', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'starting'});
        });
        stackmat.on('started', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'running'});
        });
        stackmat.on('stopped', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'stopping'});
        });
        stackmat.on('packetReceived', (packet: Packet) => {
            setCurrentTime(time => {
                setPreviousPacketStatus(prevPacket => {
                    if(prevPacket === PacketStatus.RUNNING && packet.status === PacketStatus.IDLE) {
                        setTimerInfo(info => ({
                            ...info,
                            timerState: 'stopping',
                        }));
                    }
                    return packet.status;
                });
                return packet.timeInMilliseconds !== time ?
                        packet.timeInMilliseconds :
                        time;
            });
        });
        stackmat.on('timerConnected', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'ready'});
            toast.success('Stackmat timer has been detected! Using that as the timer source.');
        });
        stackmat.on('timerDisconnected', (packet: Packet) => {
            toast.warning('Stackmat timer has been disconnected. Switching to built in timer.');
            setTimerInfo({timerMode: 'built-in', timerState: 'ready'});
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
                endIcon={<KeyboardArrowDownIcon/>}
                className={'timer-settings-menu-button'}
            >
                <div style={{paddingRight: '8px'}}>
                    <TimerIcon/>
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
                    {timerSettings.speedstacksTimerEnabled ?
                        <p>SpeedStack timer has been enabled. Connect it, approve access to your microphone, and turn it
                            on.</p> : <Button onClick={() => setUpStackmatTimer()}>Enable StackMat Timer</Button>}
                </MenuItem>
            </StyledMenu>
        </div>
    )
};