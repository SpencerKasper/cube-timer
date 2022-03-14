import React from 'react';
import './SessionStatistics.css';
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Solve} from "../redux/reducers/solveReducer";
import {Card, CardActionArea, CardContent, Chip} from "@mui/material";
import {AverageTimeStatistic} from "../utils/stats/AverageTimeStatistic";
import {StatValue} from "./StatValue";
import {FastestTimeStatistic} from "../utils/stats/FastestTimeStatistic";

const SessionStatistics = () => {
    const solves: Solve[] = useSelector(solveSelectors.solves);
    const solveTimes = solves.map(solve => solve.time);
    const withoutMinOrMax = (listOfNumbers: number[]) => {
        return listOfNumbers
            .sort((a, b) => a > b ? -1 : 1)
            .filter((item, index) => index !== 0 && index !== listOfNumbers.length - 1);
    }

    const mostRecentFiveSolves = solveTimes.length > 4 ? withoutMinOrMax(solveTimes.slice(0, 5)) : solveTimes;
    const mostRecentTwelveSolves = solveTimes.length > 11 ? withoutMinOrMax(solveTimes.slice(0, 12)) : solveTimes;
    const averageOf5Stat = new AverageTimeStatistic(mostRecentFiveSolves);
    const averageOf12Stat = new AverageTimeStatistic(mostRecentTwelveSolves);
    const averageOfAllSolvesStat = new AverageTimeStatistic(solveTimes);
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
                <CardContent>
                    <StatValue statistic={averageOf5Stat}/>
                    <StatValue statistic={averageOf12Stat}/>
                    <StatValue
                        overrideLabelInStat='Average of All'
                        overrideDescriptionInStat='This is the average of all of the times in the log.'
                        statistic={averageOfAllSolvesStat}
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