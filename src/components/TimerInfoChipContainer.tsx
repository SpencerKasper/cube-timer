import React, {useEffect, useState} from "react";
import {Card, CardContent, Chip} from "@mui/material";
import {TimerInfo} from "./SettingsRow";
import './TimerInfoChipContainer.css';
import SessionSelectionDropDown from "./drop-downs/SessionSelectionDropDown";
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import reduxStore from "../redux/redux-store";

export function TimerInfoChipContainer(props: { timerInfo: TimerInfo }) {
    const {timerInfo} = props;
    const [chipColor, setChipColor] = useState('success' as 'success' | 'warning' | 'error' | 'primary');
    const [visibleTimerState, setVisibleTimerState] = useState(timerInfo.timerState);
    const selectedSession = useSelector(solveSelectors.selectedSession);
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

    const chipClassName = ['running', 'inspecting'].includes(timerInfo.timerState) ? 'timer-state-chip blink' : 'timer-state-chip';
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
        return 'primary';
    };

    return <div className={"timer-info-chip-container"}>
        <Card className={'timer-info-chip-card'}>
            <CardContent className={"timer-info-card-content"}>
                <div className={"chip-and-label"}>
                    <h3 className={"chip-label"}>Timer State</h3>
                    <Chip className={chipClassName} color={chipColor}
                          label={visibleTimerState}/>
                </div>
                <SessionSelectionDropDown onChange={async (session) => {
                    reduxStore.dispatch({
                        type: 'solves/set-selected-session',
                        payload: {selectedSession: session}
                    });
                }}/>
                <div className={"chip-and-label"}>
                    <h3 className={"chip-label"}>Timer Mode</h3>
                    <Chip className={"timer-state-chip"}
                          color={timerInfo.timerMode === "built-in" ? "primary" : "secondary"}
                          label={timerInfo.timerMode}/>
                </div>
            </CardContent>
        </Card>
    </div>;
}