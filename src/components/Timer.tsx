import React, {useEffect, useState} from 'react';
import './Timer.css';
import axios, {AxiosResponse} from "axios";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {GetScrambleResponse} from "./ScrambleDisplay";
import {useSelector} from "react-redux";
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {TimeFormatter} from "../utils/TimeFormatter";
import {UrlHelper} from "../utils/url-helper";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Card, CardContent} from '@mui/material';
import {toast} from "react-toastify";
import {SettingsRow, TimerInfo} from "./SettingsRow";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import SingletonStackmat from "../stackmat/singleton-stackmat";

const TIMER_PRECISION_IN_MS = 10;
const API_DOMAIN = UrlHelper.getScrambleApiDomain();
const Timer = () => {
    const [timerInfo, setTimerInfo] = useState<TimerInfo>({
        timerState: 'ready',
        timerMode: 'built-in',
    });
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const scramble = useSelector(scrambleSelectors.scramble);
    const solves = useSelector(solveSelectors.solves);
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);
    const timerSettings = useSelector(settingsSelectors.timerSettings);
    const [inspectionTimeInMs, setInspectionTimeInMs] = useState(0);
    const [inspected, setInspected] = useState(false);

    useEffect(() => {
        setInspectionTimeInMs(getInspectionTimeAsMs());
    }, [timerSettings.inspectionTime]);

    useEffect(() => {
        if (inspected && currentTime === 0 && timerInfo.timerState === 'inspecting') {
            setTimerInfo(info => ({...info, timerState: 'ready'}));
            setInspected(false);
        }
    }, [inspected, currentTime, timerInfo.timerState]);

    useEffect(() => {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    }, []);

    function getInspectionTimeAsMs() {
        return timerSettings.inspectionTime !== '' ?
            Number(timerSettings.inspectionTime) * 1000 :
            0;
    }

    useEffect(() => {
        const {timerState, timerMode} = timerInfo;
        const inspectionTimeAsMs = getInspectionTimeAsMs();
        if (timerState === 'starting' && timerMode === 'built-in') {
            if (inspectionTimeAsMs > 0) {
                stopTimer();
            }
            setStartTime(null);
            setCurrentTime(0);
        }
        if (timerState === 'inspecting' && timerMode === 'built-in') {
            setCurrentTime(inspectionTimeAsMs);
            const currentTime = Date.now();
            setStartTime(currentTime);
            setInspected(true);
            setIntervalId(setInterval(() => {
                const timePassed = Date.now() - currentTime;
                const updatedTime = inspectionTimeAsMs - timePassed;
                if (updatedTime <= 0) {
                    stopTimer();
                    setCurrentTime(0);
                    toast.error('Inspection took too long.');
                } else {
                    setCurrentTime(updatedTime);
                }
            }, TIMER_PRECISION_IN_MS));
        }
        if (timerState === 'running' && timerMode === 'built-in') {
            const currentTime = Date.now();
            setStartTime(currentTime);
            setIntervalId(setInterval(() => {
                setCurrentTime(Date.now() - currentTime);
            }, TIMER_PRECISION_IN_MS));
        }
        if (timerState === 'stopping') {
            setInspected(false);
            stopTimer();
            saveSolve()
                .then((response: AxiosResponse<{ body: { solves: any[] } }>) => {
                    reduxStore.dispatch({
                        type: 'solves/set',
                        payload: {solves: response.data.body.solves}
                    });
                    getScramble()
                        .then(() => {
                        });
                });
        }
    }, [timerInfo, inspectionTimeInMs]);

    const stopTimer = () => {
        setIntervalId(currentIntervalId => {
            if (currentIntervalId) {
                clearInterval(currentIntervalId);
            }
            return null;
        });
    };

    function runFunctionOnKeyWhenNotRepeatAndPreventDefault(event: KeyboardEvent, func: () => void, key = 'Space') {
        if (event.code === key) {
            event.preventDefault();
            if (!event.repeat) {
                func();
            }
        }
    }

    function keyDownListener(event) {
        runFunctionOnKeyWhenNotRepeatAndPreventDefault(event, () => {
            setTimerInfo(info => {
                let timerState = info.timerState;
                if (info.timerMode === 'speedstack-timer') {
                    toast.error('SpeedStacks timer is connected... Please turn it off to use the built-in timer.');
                    return info;
                }
                if (timerState === 'ready') {
                    timerState = 'starting';
                } else if (timerState === 'running') {
                    timerState = 'stopping';
                } else if (timerState === 'inspecting') {
                    timerState = 'starting';
                }
                return ({...info, timerMode: 'built-in', timerState});
            });
        });
    }

    function keyUpListener(event) {
        runFunctionOnKeyWhenNotRepeatAndPreventDefault(event, () => {
            setInspected(isInspected => {
                setInspectionTimeInMs(inspectTimeMs => {
                    setTimerInfo(info => {
                        if (info.timerMode !== 'speedstack-timer') {
                            let timerState = info.timerState;
                            if (timerState === 'stopping') {
                                timerState = 'ready';
                            } else if (timerState === 'starting' && (inspectTimeMs === 0 || isInspected)) {
                                timerState = 'running';
                            } else if (timerState === 'starting' && inspectTimeMs > 0) {
                                timerState = 'inspecting';
                            }
                            return ({...info, timerMode: 'built-in', timerState});
                        }
                        return info;
                    });
                    return inspectTimeMs;
                });
                return isInspected;
            })
        });
    }

    const getScramble = async () => {
        const response = await axios
            .get<GetScrambleResponse>(`${API_DOMAIN}cubeType/3x3x3`);
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble: response.data.body.scramble}});
        setTimerInfo(info => {
            return ({...info, timerState: 'ready'});
        });
    };

    const saveSolve = async () => {
        if (user) {
            const userId = user.attributes.email;
            const maxSolveNumber = Math.max(...solves.map(solve => solve.number));
            return axios.post(`${API_DOMAIN}solves`, {
                scramble,
                userId,
                number: maxSolveNumber + 1,
                time: currentTime,
                cubeType: '3x3x3',
            }, {headers: {'Content-Type': 'application/json'}});
        } else {
            toast.error('There must be a logged in user in order to save a solve.');
            return Promise.resolve([]);
        }
    };

    const getTimerColor = () => {
        if (timerInfo.timerState === 'starting') {
            return '#BFF7BC';
        }
        if(timerInfo.timerState === 'inspecting') {
            return '#F8EBBA';
        }
        return 'white';
    };
    const timerColor = getTimerColor();
    const timeFormatter = new TimeFormatter();
    const minutes = timeFormatter.getMinutes(currentTime);
    const seconds = timeFormatter.getSeconds(currentTime);
    const milliseconds = timeFormatter.getMilliseconds(currentTime);
    const isLongerThanMinute = currentTime >= 60000;
    const timerContentClass = timerInfo.timerState === 'inspecting' ? 'timer-content blink' : 'timer-content';
    return (
        <div style={{color: timerColor}} className='timer-container'>
            <SettingsRow setTimerInfo={setTimerInfo} setCurrentTime={setCurrentTime} timerInfo={timerInfo}/>
            <Card className='timer-card'>
                <CardContent>
                    <div className={timerContentClass}>
                        {isLongerThanMinute && <>
                            <p className='current-time'>
                                {minutes}
                            </p>
                            <p className='current-time'>
                                :
                            </p>
                        </>}
                        <p style={{
                            color: timerColor,
                            minWidth: '26vw',
                            textAlign: currentTime < 10000 ? 'right' : 'center'
                        }}
                           className='current-time'>
                            {seconds}
                        </p>
                        <p style={{color: timerColor}} className='current-time'>
                            .
                        </p>
                        <p style={{color: timerColor, minWidth: '26vw'}} className='current-time'>
                            {milliseconds}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Timer;