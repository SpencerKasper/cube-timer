import React from 'react';
import './SessionStatistics.css';
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Solve} from "../redux/reducers/solveReducer";
import {Card, CardContent} from "@mui/material";

const SessionStatistics = () => {
    const solves: Solve[] = useSelector(solveSelectors.solves);
    const solveTimes = solves.map(solve => solve.time);
    const mostRecentFiveSolves = solveTimes.length > 4 ? solveTimes.slice(0, 5) : solveTimes;
    const mostRecentTwelveSolves = solveTimes.length > 11 ? solveTimes.slice(0, 12) : solveTimes;

    function getSumOfSolveTimesWithoutMaxOrMin(times) {
        return times
            .sort((a, b) => a > b ? -1 : 1)
            .filter((item, index) => index !== 0 && index !== times.length - 1)
            .reduce((acc, curr) => {
                return acc + curr;
            }, 0);
    }

    const sumOfMostRecentFiveWithoutMaxOrMin = getSumOfSolveTimesWithoutMaxOrMin(mostRecentFiveSolves);
    const averageOf5 = solves.length > 4 ?
        (sumOfMostRecentFiveWithoutMaxOrMin / 3000).toFixed(2).toString() :
        '-';
    const averageOf12 = solves.length > 11 ?
        (getSumOfSolveTimesWithoutMaxOrMin(mostRecentTwelveSolves) / 10000).toFixed(2).toString() :
        '-';
    return (
        <div className='session-statistics-container'>
            <h2 className='session-stats-title'>Session Statistics</h2>
            <Card className='stats' variant='outlined'>
                <CardContent>
                    <div className='stat'>
                        <p className='stat-label'>
                            Average of 5:
                        </p>
                        <p>
                            {averageOf5}
                        </p>
                    </div>
                    <div className='stat'>
                        <p className='stat-label'>
                            Average of 12:
                        </p>
                        <p>
                            {averageOf12}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SessionStatistics;