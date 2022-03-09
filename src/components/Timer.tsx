import React, {useEffect, useState} from 'react';
import './Timer.css';
import axios from "axios";
import reduxStore from "../redux/redux-store";
import {GetScrambleResponse} from "./ScrambleDisplay";
import {useSelector} from "react-redux";
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {TimeFormatter} from "../utils/TimeFormatter";

const TIMER_PRECISION_IN_MS = 10;
const Timer = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const [timerState, setTimerState] = useState('ready');
    const scramble = useSelector(scrambleSelectors.scramble);

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

    useEffect(() => {
        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    }, []);

    const getScramble = async () => {
        const response = await axios
            .get<GetScrambleResponse>(`https://akyz39h8vj.execute-api.us-east-1.amazonaws.com/prod/cubeType/3x3x3`);
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble: response.data.body.scramble}});
    };

    useEffect(() => {
        if (timerState === 'starting') {
            setCurrentTime(0);
        }
        if (timerState === 'running' && !timerIntervalId) {
            setTimerIntervalId(setInterval(() => {
                setCurrentTime(time => time + TIMER_PRECISION_IN_MS);
            }, TIMER_PRECISION_IN_MS));
        }
        if (timerState === 'stopping' && timerIntervalId) {
            clearInterval(timerIntervalId);
            setTimerIntervalId(null);
            reduxStore.dispatch({type: 'solve/add', payload: {solve: {scramble, time: currentTime, cubeType: '3x3x3'}}})
            getScramble();
        }
    }, [timerState]);

    useEffect(() => () => {
        document.removeEventListener('keyup', keyUpListener);
        document.removeEventListener('keydown', keyDownListener);
    }, []);

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
    return (
        <div style={{color: timerColor}} className='timer-container'>
            {isLongerThanMinute && <>
                <p className='current-time'>
                    {minutes}
                </p>
                <p className='current-time'>
                    :
                </p>
            </>}
            <p style={{color: timerColor, minWidth: '190px', textAlign: currentTime < 10000 ? 'right' : 'center'}} className='current-time'>
                {seconds}
            </p>
            <p style={{color: timerColor}} className='current-time'>
                .
            </p>
            <p style={{color: timerColor, minWidth: '190px'}} className='current-time'>
                {milliseconds}
            </p>
        </div>
    );
}

export default Timer;