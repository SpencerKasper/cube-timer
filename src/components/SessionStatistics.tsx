import React from 'react';
import './SessionStatistics.css';
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Solve} from "../redux/reducers/solveReducer";
import {Card, CardContent} from "@mui/material";
import {AverageTimeStatistic} from "../utils/stats/AverageTimeStatistic";
import {StatValue} from "./StatValue";

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
    return (
        <div className='session-statistics-container'>
            <h2 className='session-stats-title'>Session Statistics</h2>
            <Card className='stats' variant='outlined'>
                <CardContent>
                    <StatValue
                        label='Average of Last 5'
                        description='This is the average of 5 with the fastest and slowest time removed.  The remaining 3 times are averaged together.'
                        statistic={averageOf5Stat}
                    />
                    <StatValue
                        label='Average of Last 12'
                        description='This is the average of 12 with the fastest and slowest time removed.  The remaining 10 times are averaged together.'
                        statistic={averageOf12Stat}
                    />
                    <StatValue
                        label='Average of All'
                        description='This is the average of all of the times in the log.'
                        statistic={averageOfAllSolvesStat}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default SessionStatistics;