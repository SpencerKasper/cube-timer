import React from 'react';
import {ScrambleSettings} from "./ScrambleSettings";
import {TimerSettings} from "./TimerSettings";
import './SettingsRow.css';

export interface TimerInfo {
    timerMode: 'built-in' | 'speedstack-timer',
    timerState: string,
}

interface Props {
    setTimerInfo: (timerInfo: {timerMode: 'built-in' | 'speedstack-timer'; timerState: string;}) => void;
    setCurrentTime: (currentTime: number) => void;
    timerInfo: TimerInfo;
}

export const SettingsRow = (props: Props) => {
    const {setTimerInfo, setCurrentTime} = props;
    return (
        <div className={'settings-row'}>
            <ScrambleSettings />
            <TimerSettings
                timerInfo={props.timerInfo}
                setTimerInfo={setTimerInfo}
                setCurrentTime={setCurrentTime}
            />
        </div>
    );
};