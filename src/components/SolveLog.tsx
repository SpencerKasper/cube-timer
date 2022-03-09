import React from 'react';
import {useSelector} from "react-redux";
import './SolveLog.css';
import {Solve} from "../redux/reducers/solveReducer";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Card, CardContent, Paper} from "@mui/material";
import {TimeFormatter} from "../utils/TimeFormatter";

const SolveLog = () => {
    const solves = useSelector(solveSelectors.solves);
    const timeFormatter = new TimeFormatter();
    return (
        <div className='solve-history-container'>
            <h2 className='solve-history-title'>Log</h2>
            <div className='solves'>
                {solves.map((solve: Solve, index) => {
                    return <Card key={index} variant='outlined'>
                        <CardContent className='solve-container'>
                            <div className='label-and-time'>
                                <p className='label'>
                                    Solve:
                                </p>
                                <p>
                                    {solve.number}
                                </p>

                            </div>
                            <div className='label-and-time'>
                                <p className='label'>
                                    Time:
                                </p>
                                <p>
                                    {timeFormatter.getFullTime(solve.time)}
                                </p>
                            </div>
                            <div className='label-and-time'>
                                <p className='label'>
                                    Scramble:
                                </p>
                                <p>
                                    {solve.scramble}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                })}
            </div>
        </div>
    );
};

export default SolveLog;