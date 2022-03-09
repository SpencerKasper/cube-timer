import React from 'react';
import './SessionStatistics.css';
import {useSelector} from "react-redux";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Solve} from "../redux/reducers/solveReducer";
import {Card, CardContent} from "@mui/material";
import {TimeFormatter} from "../utils/TimeFormatter";
import {AverageTimeStatistic} from "../utils/stats/AverageTimeStatistic";

const SessionStatistics = () => {
    const solves: Solve[] = useSelector(solveSelectors.solves);
    const solveTimes = solves.map(solve => solve.time);
    const mostRecentFiveSolves = solveTimes.length > 4 ? solveTimes.slice(0, 5) : solveTimes;
    const mostRecentTwelveSolves = solveTimes.length > 11 ? solveTimes.slice(0, 12) : solveTimes;
    const averageOf5Stat = new AverageTimeStatistic(mostRecentFiveSolves);
    const averageOf12Stat = new AverageTimeStatistic(mostRecentTwelveSolves);
    const timeFormatter = new TimeFormatter();
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
                            {solveTimes.length > 4 ? timeFormatter.getFullTime(averageOf5Stat.getStatValue()) : '-'}
                        </p>
                    </div>
                    <div className='stat'>
                        <p className='stat-label'>
                            Average of 12:
                        </p>
                        <p>
                            {solveTimes.length > 12 ? timeFormatter.getFullTime(averageOf12Stat.getStatValue()) : '-'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SessionStatistics;