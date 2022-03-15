import React from 'react';
import {ScrambleSettings} from "./ScrambleSettings";
import {TimerSettings} from "./TimerSettings";
import './SettingsRow.css';

interface Props {
    setTimerInfo: (timerInfo: {timerMode: 'built-in' | 'speedstack-timer'; timerState: string;}) => void;
    setCurrentTime: (currentTime: number) => void;
}

export const SettingsRow = (props: Props) => {
    const {setTimerInfo, setCurrentTime} = props;
    return (
        <div className={'settings-row'}>
            <ScrambleSettings />
            <TimerSettings
                setTimerInfo={setTimerInfo}
                setCurrentTime={setCurrentTime}
            />
        </div>
    );
};