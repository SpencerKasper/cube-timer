import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import './SolveLog.css';
import {Solve} from "../redux/reducers/solveReducer";
import solveSelectors from "../redux/selectors/solveSelectors";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore from "../redux/redux-store";
import {SolveCard} from "./SolveCard";
import {Card, CardContent} from "@mui/material";

const SolveLog = () => {
    const getSolves = async () => {
        const response = await axios.get<{ body: { solves: Solve[] } }>(`${UrlHelper.getScrambleApiDomain()}solves`);
        reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}})
    };
    useEffect(() => {
        getSolves();
    }, []);
    const solves = useSelector(solveSelectors.solves);
    return (
        <div className='solve-history-container'>
            <h2 className='solve-history-title'>Log</h2>
            <div className='solves'>
                {solves.length ? solves.sort((a, b) => a.number > b.number ? -1 : 1).map((solve: Solve, index) => {
                        return <SolveCard key={index}
                                          solve={solve}/>
                    }) :
                    <Card>
                        <CardContent>
                            No Solves Yet! Press the spacebar to start the timer...
                        </CardContent>
                    </Card>}
            </div>
        </div>
    );
};

export default SolveLog;