import React from 'react';
import {ScrambleSettings} from "./ScrambleSettings";
import {TimerSettings} from "./TimerSettings";
import './SettingsRow.css';
import SessionSelectionDropDown from "./drop-downs/SessionSelectionDropDown";
import {Card, CardContent} from "@mui/material";

export interface TimerInfo {
    timerMode: 'built-in' | 'speedstack-timer',
    timerState: string,
}

interface Props {
    setTimerInfo: (timerInfo: { timerMode: 'built-in' | 'speedstack-timer'; timerState: string; }) => void;
    setCurrentTime: (currentTime: number) => void;
    timerInfo: TimerInfo;
}

export const SettingsRow = (props: Props) => {
    const {setTimerInfo, setCurrentTime, timerInfo} = props;
    return (
        <div className={'settings-card-container'}>
            <Card>
                <CardContent className={'settings-row'}>
                    <div className={'settings-button'}>
                        <ScrambleSettings/>
                    </div>
                    <TimerSettings
                        timerInfo={timerInfo}
                        setTimerInfo={setTimerInfo}
                        setCurrentTime={setCurrentTime}
                    />
                </CardContent>
            </Card>
        </div>
    );
};