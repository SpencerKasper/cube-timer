import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import './SolveLog.css';
import {Solve} from "../redux/reducers/solveReducer";
import solveSelectors from "../redux/selectors/solveSelectors";
import {Card, CardContent, Paper} from "@mui/material";
import {TimeFormatter} from "../utils/TimeFormatter";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore from "../redux/redux-store";

const SolveLog = () => {
    const getSolves = async () => {
        const response = await axios.get<{ body: { solves: Solve[] } }>(`${UrlHelper.getScrambleApiDomain()}solves`);
        reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}})
    };
    useEffect(() => {
        getSolves();
    }, []);
    const solves = useSelector(solveSelectors.solves);
    const timeFormatter = new TimeFormatter();
    return (
        <div className='solve-history-container'>
            <h2 className='solve-history-title'>Log</h2>
            <div className='solves'>
                {solves.sort((a, b) => a > b ? 1 : -1).map((solve: Solve, index) => {
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