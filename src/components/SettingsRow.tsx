import React, {useEffect, useState} from 'react';
import {ScrambleSettings} from "./ScrambleSettings";
import {TimerSettings} from "./TimerSettings";
import './SettingsRow.css';
import {Card, CardContent, Chip} from "@mui/material";

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
    const [chipColor, setChipColor] = useState('success' as 'success' | 'warning' | 'error' | 'primary');
    const [visibleTimerState, setVisibleTimerState] = useState(timerInfo.timerState);
    useEffect(() => {
        const VISIBLE_TIMER_STATES = ['ready', 'inspecting', 'running'];
        if (VISIBLE_TIMER_STATES.includes(timerInfo.timerState)) {
            setVisibleTimerState(timerInfo.timerState);
        }
    }, [timerInfo.timerState]);
    useEffect(() => {
        const nextChipColor = getChipColor(visibleTimerState);
        if (nextChipColor) {
            setChipColor(nextChipColor);
        }
    }, [visibleTimerState]);
    const getChipColor = (timerState) => {
        if (['ready'].includes(timerState)) {
            return 'success';
        }
        if (['inspecting'].includes(timerState)) {
            return 'warning';
        }
        if (['running'].includes(timerState)) {
            return 'error';
        }
        return null;
    };

    const chipClassName = ['running', 'inspecting'].includes(props.timerInfo.timerState) ? 'timer-state-chip blink' : 'timer-state-chip';

    return (
        <div className={'settings-row'}>
            <div className={'scramble-settings-button'}>
                <ScrambleSettings/>
            </div>
            <div className={'timer-info-chip-container'}>
                <Card>
                    <CardContent className={'timer-info-card-content'}>
                        <div className={'chip-and-label'}>
                            <h3 className={'chip-label'}>Timer State</h3>
                            <Chip className={chipClassName} color={chipColor} label={visibleTimerState}/>
                        </div>
                        <div className={'chip-and-label'}>
                            <h3 className={'chip-label'}>Timer Mode</h3>
                            <Chip className={'timer-state-chip'} color={timerInfo.timerMode === 'built-in' ? 'primary' : 'secondary'} label={timerInfo.timerMode} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <TimerSettings
                timerInfo={props.timerInfo}
                setTimerInfo={setTimerInfo}
                setCurrentTime={setCurrentTime}
            />
        </div>
    );
};