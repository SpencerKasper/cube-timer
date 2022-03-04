import React from "react";
import {withRouter} from "react-router";
import ScrambleDisplayRow from "../components/ScrambleDisplay";
import Timer from "../components/Timer";
import SolveLog from "../components/SolveLog";
import SessionStatistics from "../components/SessionStatistics";

const HomePage = () => {
    return (
        <div className={'home-container'}>
            <div className='scramble-display-row'>
                <div className='logo'>
                    <h1 className='logo-title'>
                        SolveLog
                    </h1>
                </div>
                <ScrambleDisplayRow/>
                <div style={{width: '25%'}}/>
            </div>
            <div className='solve-history-and-timer-container'>
                <SolveLog/>
                <Timer/>
                <SessionStatistics />
            </div>
        </div>
    );
};

export default withRouter(HomePage);