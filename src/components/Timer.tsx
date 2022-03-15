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
import {Stackmat} from '../stackmat/stackmat';
import {toast} from "react-toastify";
import {Packet} from "../stackmat/packet/packet";

const TIMER_PRECISION_IN_MS = 10;
const API_DOMAIN = UrlHelper.getScrambleApiDomain();
const Timer = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const [timerState, setTimerState] = useState('ready');
    const [timerMode, setTimerMode] = useState('built-in');
    const scramble = useSelector(scrambleSelectors.scramble);
    const solves = useSelector(solveSelectors.solves);
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);

    const setUpStackmatTimer = () => {
        const audioContext = new AudioContext();
        const stackmat = new Stackmat(audioContext);
        console.error('created new stackmat');
        stackmat.on('starting', (packet: Packet) => {
            console.error('starting');
            setTimerState('starting');
        });
        stackmat.on('started', (packet: Packet) => {
            setTimerState('running');
        });
        stackmat.on('stopped', (packet: Packet) => {
            console.log('Timer stopped at: ' + packet.timeAsString);
            setTimerState('stopping');
        });
        stackmat.on('packetReceived', (packet: Packet) => {
            console.error('packetReceived');
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
        console.error('registered events');
        stackmat.start();
        console.error('started stackmat');
    }
    useEffect(() => {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    }, []);

    useEffect(() => {
        console.error(timerState);
        if (timerState === 'starting') {
            if (timerMode === 'built-in') {
                setCurrentTime(0);
            }
        }
        if (timerState === 'running' && !timerIntervalId) {
            if (timerMode === 'built-in') {
                setTimerIntervalId(setInterval(() => {
                    setCurrentTime(time => time + TIMER_PRECISION_IN_MS);
                }, TIMER_PRECISION_IN_MS));
            }
        }
        if (timerState === 'stopping') {
            if (timerIntervalId) {
                clearInterval(timerIntervalId);
            }
            setTimerIntervalId(null);
            saveSolve()
                .then(() => {
                    reduxStore.dispatch({
                        type: 'solves/add',
                        payload: {solve: {scramble, time: currentTime, cubeType: '3x3x3'}}
                    });
                    getScramble();
                });
        }
    }, [timerState, timerMode]);

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
            setTimerState(state => state === 'ready' ? 'starting' : state);
            setTimerState(state => state === 'running' ? 'stopping' : state);
        });
    }

    function keyUpListener(event) {
        runFunctionOnKeyWhenNotRepeatAndPreventDefault(event, () => {
            setTimerState(state => state === 'stopping' ? 'ready' : state);
            setTimerState(state => state === 'starting' ? 'running' : state);
        });
    }

    const getScramble = async () => {
        const response = await axios
            .get<GetScrambleResponse>(`${API_DOMAIN}cubeType/3x3x3`);
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble: response.data.body.scramble}});
    };

    const saveSolve = async () => {
        const userId = user.attributes.email;
        return axios.post(`${API_DOMAIN}solves`, {
            scramble,
            userId,
            number: solves.length + 1,
            time: currentTime,
            cubeType: '3x3x3',
        }, {headers: {'Content-Type': 'application/json'}});
    };

    const getTimerColor = () => {
        if (timerState === 'starting') {
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
    console.error('ready to render');
    return (
        <div style={{color: timerColor}} className='timer-container'>
            <Card className='timer-card'>
                <CardContent className='timer-content'>
                    <button onClick={() => setUpStackmatTimer()}>Use Stackmat Timer</button>
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
                </CardContent>
            </Card>
        </div>
    );
};

export default Timer;