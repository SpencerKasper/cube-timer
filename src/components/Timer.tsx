import React, {useEffect, useState} from 'react';
import './Timer.css';
import axios from "axios";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {GetScrambleResponse} from "./ScrambleDisplay";
import {useSelector} from "react-redux";
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {TimeFormatter} from "../utils/TimeFormatter";
import {UrlHelper} from "../utils/url-helper";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Card, CardContent} from '@mui/material';
import {TimerSettings} from "./TimerSettings";
import {toast} from "react-toastify";

const TIMER_PRECISION_IN_MS = 10;
const API_DOMAIN = UrlHelper.getScrambleApiDomain();
const Timer = () => {
    const [timerInfo, setTimerInfo] = useState({
        timerState: 'ready',
        timerMode: 'built-in',
    });
    const [currentTime, setCurrentTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const scramble = useSelector(scrambleSelectors.scramble);
    const solves = useSelector(solveSelectors.solves);
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);

    useEffect(() => {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    }, []);

    useEffect(() => {
        const {timerState, timerMode} = timerInfo;
        console.error(timerState);
        if (timerState === 'starting' && timerMode === 'built-in') {
            setCurrentTime(0);
        }
        if (timerState === 'running' && timerMode === 'built-in') {
            setIntervalId(setInterval(() => {
                setCurrentTime(time => time + TIMER_PRECISION_IN_MS);
            }, TIMER_PRECISION_IN_MS));
        }
        if (timerState === 'stopping') {
            setIntervalId(currentIntervalId => {
                if (currentIntervalId) {
                    clearInterval(currentIntervalId);
                }
                return null;
            });
            reduxStore.dispatch({
                type: 'solves/add',
                payload: {solve: {scramble, time: currentTime, cubeType: '3x3x3'}}
            });
            saveSolve()
                .then(() => {
                    getScramble()
                        .then(() => {
                            console.error('reset complete.')
                        });
                });
        }
    }, [timerInfo]);

    useEffect(() => () => {
        document.removeEventListener('keyup', keyUpListener);
        document.removeEventListener('keydown', keyDownListener);
    }, []);

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
                if (timerState === 'ready') {
                    timerState = 'starting';
                } else if (timerState === 'running') {
                    timerState = 'stopping';
                }
                return ({...info, timerMode: 'built-in', timerState});
            });
        });
    }

    function keyUpListener(event) {
        runFunctionOnKeyWhenNotRepeatAndPreventDefault(event, () => {
            setTimerInfo(info => {
                let timerState = info.timerState;
                if (timerState === 'stopping') {
                    timerState = 'ready';
                } else if (timerState === 'starting') {
                    timerState = 'running';
                }
                return ({...info, timerMode: 'built-in', timerState});
            });
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
        if(user) {
            const userId = user.attributes.email;
            return axios.post(`${API_DOMAIN}solves`, {
                scramble,
                userId,
                number: solves.length + 1,
                time: currentTime,
                cubeType: '3x3x3',
            }, {headers: {'Content-Type': 'application/json'}});
        } else {
            toast.error('There must be a logged in user in order to save a solve.');
        }
    };

    const getTimerColor = () => {
        if (timerInfo.timerState === 'starting') {
            return 'green';
        }
        return 'black';
    };
    const timerColor = getTimerColor();
    const timeFormatter = new TimeFormatter();
    const minutes = timeFormatter.getMinutes(currentTime);
    const seconds = timeFormatter.getSeconds(currentTime);
    const milliseconds = timeFormatter.getMilliseconds(currentTime);
    const isLongerThanMinute = currentTime >= 60000;
    return (
        <div style={{color: timerColor}} className='timer-container'>
            <Card className='timer-card'>
                <CardContent className='timer-card-content'>
                    <TimerSettings
                        setTimerInfo={setTimerInfo}
                        setCurrentTime={setCurrentTime}
                    />
                    <div className={'timer-content'}>
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
                            minWidth: '190px',
                            textAlign: currentTime < 10000 ? 'right' : 'center'
                        }}
                           className='current-time'>
                            {seconds}
                        </p>
                        <p style={{color: timerColor}} className='current-time'>
                            .
                        </p>
                        <p style={{color: timerColor, minWidth: '190px'}} className='current-time'>
                            {milliseconds}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Timer;