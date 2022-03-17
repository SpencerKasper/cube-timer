import React, {useState} from 'react';
import {Stackmat} from '../stackmat/stackmat';
import {toast} from "react-toastify";
import {Packet, PacketStatus} from "../stackmat/packet/packet";
import {alpha, Button, Dialog, DialogContent, Menu, MenuItem, styled, Switch} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimerIcon from '@mui/icons-material/Timer';
import './TimerSettings.css';
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {useSelector} from "react-redux";

export const TimerSettings = (props) => {
    const {setTimerInfo, setCurrentTime, timerInfo} = props;
    const timerSettings = useSelector(settingsSelectors.timerSettings);
    const [previousPacketStatus, setPreviousPacketStatus] = useState('I');
    const setUpStackmatTimer = () => {
        const audioContext = new AudioContext();
        const stackmat = new Stackmat(audioContext);
        reduxStore.dispatch({
            type: 'settings/setTimerSettings', payload: {
                timerSettings: {
                    ...timerSettings,
                    speedstacksTimerEnabled: true,
                },
            }
        });
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
                    if (prevPacket === PacketStatus.RUNNING && packet.status === PacketStatus.IDLE) {
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
    const [open, setOpen] = useState(false);
    return (
        <div className={'timer-settings-container'}>
            <Button
                onClick={()=> setOpen(true)}
                className={'timer-settings-menu-button'}
            >
                <div style={{paddingRight: '8px'}}>
                    <TimerIcon/>
                </div>
                <div>
                    Timer Options
                </div>
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
            >
                <h2 className={'settings-title'}>Timer Options</h2>
                <DialogContent>
                    <div className={'setting'}>
                        <p className={'setting-label'}>Enable SpeedStacks Timer</p>
                        {timerSettings.speedstacksTimerEnabled ?
                            <p>SpeedStack timer has been enabled. Connect it, approve access to your microphone, and turn it
                                on.</p> : <Button onClick={() => setUpStackmatTimer()}>Enable StackMat Timer</Button>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
};