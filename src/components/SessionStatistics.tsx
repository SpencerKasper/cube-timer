import React from 'react';
import './SessionStatistics.css';
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Solve} from "../redux/reducers/solveReducer";
import {Card, CardContent} from "@mui/material";
import {AverageTimeStatistic} from "../utils/stats/AverageTimeStatistic";
import {StatValue} from "./StatValue";
import {FastestTimeStatistic} from "../utils/stats/FastestTimeStatistic";

const SessionStatistics = () => {
    const solves: Solve[] = useSelector(solveSelectors.solves);
    const solveTimes = solves.map(solve => solve.time);

    const fastestTimeStat = new FastestTimeStatistic(solveTimes);
    const onStatClick = () => {
        const fastestTimeAsMilliseconds = fastestTimeStat.getStatValueBeforeFormat();
        const solve = solves.find(item => item.time === fastestTimeAsMilliseconds)
        if (solve) {
            document.getElementById(`solve-item-${solve.number}`).scrollIntoView({behavior: 'smooth'});
        }
    };
    return (
        <div className='session-statistics-container'>
            <h2 className='session-stats-title'>Session Statistics</h2>
            <Card className='stats' variant='outlined'>
                <CardContent className={'stats-container'}>
                    <StatValue statistic={new AverageTimeStatistic(solveTimes, 5)}/>
                    <StatValue statistic={new AverageTimeStatistic(solveTimes, 12)}/>
                    <StatValue statistic={new AverageTimeStatistic(solveTimes, 50)}/>
                    <StatValue statistic={new AverageTimeStatistic(solveTimes, 100)}/>
                    <StatValue
                        overrideLabelInStat='Average of All'
                        overrideDescriptionInStat='This is the average of all of the times in the log.'
                        statistic={new AverageTimeStatistic(solveTimes)}
                    />
                    <StatValue onStatClick={onStatClick}
                               onStatClickDescription={'Click to scroll to this solve in the solve log.'}
                               statistic={fastestTimeStat}/>
                </CardContent>
            </Card>
        </div>
    );
}

export default SessionStatistics;