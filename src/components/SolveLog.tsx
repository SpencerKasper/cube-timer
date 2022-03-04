import React from 'react';
import {useSelector} from "react-redux";
import './SolveHistory.css';
import {Solve} from "../redux/reducers/solveReducer";
import solveSelectors from "../redux/selectors/solveSelectors";

const SolveLog = () => {
    const solves = useSelector(solveSelectors.solves);
    return (
        <div className='solve-history-container'>
            <h2 className='solve-history-title'>Log</h2>
            <div className='solves'>
                {solves.map((solve: Solve, index) => {
                    return <div key={index} className='solve-container'>
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
                                {`${(solve.time / 1000).toFixed(2)}`}
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
                    </div>
                })}
            </div>
        </div>
    );
};

export default SolveLog;