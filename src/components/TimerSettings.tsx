import React, {useState} from 'react';
import {toast} from "react-toastify";
import {Packet, PacketStatus} from "../stackmat/packet/packet";
import {Button, Dialog, DialogActions, DialogContent, Switch, TextField} from "@mui/material";
import TimerIcon from '@mui/icons-material/Timer';
import './TimerSettings.css';
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {useSelector} from "react-redux";
import {Setting} from "./Setting";
import SingletonStackmat from "../stackmat/singleton-stackmat";
import {ITimerSettings} from '../redux/reducers/settingsReducer';
export const TimerSettings = (props) => {
    const {setTimerInfo, setCurrentTime} = props;
    const timerSettings = useSelector(settingsSelectors.timerSettings);
    const [previousPacketStatus, setPreviousPacketStatus] = useState('I');
    const setUpStackmatTimer = () => {
        reduxStore.dispatch({
            type: 'settings/setTimerSettings', payload: {
                timerSettings: {
                    ...timerSettings,
                    speedstacksTimerEnabled: true,
                },
            }
        });
        SingletonStackmat.on('starting', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'starting'});
        });
        SingletonStackmat.on('started', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'running'});
        });
        SingletonStackmat.on('stopped', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'stopping'});
        });
        SingletonStackmat.on('packetReceived', (packet: Packet) => {
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
        SingletonStackmat.on('timerConnected', (packet: Packet) => {
            setTimerInfo({timerMode: 'speedstack-timer', timerState: 'ready'});
            toast.success('Stackmat timer has been detected! Using that as the timer source.');
        });
        SingletonStackmat.on('timerDisconnected', (packet: Packet) => {
            toast.warning('Stackmat timer has been disconnected. Switching to built in timer.');
            setTimerInfo({timerMode: 'built-in', timerState: 'ready'});
        });
        SingletonStackmat.start();
    };
    const [open, setOpen] = useState(false);

    function updateTimerSettings(timerSettingsUpdate: Partial<ITimerSettings>) {
        reduxStore.dispatch({
            type: 'settings/setTimerSettings',
            payload: {timerSettings: {...timerSettings, ...timerSettingsUpdate}}
        })
    }

    const onInspectionTimeChange = (event) => {
        const inspectionTime = event.target.value;
        if (!Number(inspectionTime) && inspectionTime !== '' && Number(inspectionTime) !== 0) {
            toast.error('Inspection time most only be numbers.');
        } else if (Number(inspectionTime) >= 60 && inspectionTime !== '') {
            toast.error('Inspection time cannot be a minute or longer.');
        } else {
            updateTimerSettings({inspectionTime});
        }
    };
    const onHideTimeDuringSolveChange = (event) => {
        const hideTimeDuringSolve = event.target.checked;
        updateTimerSettings({hideTimeDuringSolve});
    };

    return (
        <div className={'timer-settings-container'}>
            <Button
                color={'secondary'}
                onClick={() => setOpen(true)}
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
                    <Setting title={'Enable SpeedStacks Timer'}>
                        {timerSettings.speedstacksTimerEnabled ?
                            <p>SpeedStack timer has been enabled. Connect it, approve access to your microphone, and
                                turn it
                                on.</p> :
                            <Button color={'secondary'} onClick={setUpStackmatTimer}>Enable SpeedStacks Timer</Button>
                        }
                    </Setting>
                    <Setting title={'Inspection Time'}>
                        <TextField onChange={onInspectionTimeChange}
                                   value={timerSettings.inspectionTime ? timerSettings.inspectionTime : ''}/>
                    </Setting>
                    <Setting title={'Hide Time During Solve'}>
                        <Switch checked={timerSettings.hideTimeDuringSolve} onChange={onHideTimeDuringSolveChange} />
                    </Setting>
                </DialogContent>
                <DialogActions>
                    <Button color={'secondary'} onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};