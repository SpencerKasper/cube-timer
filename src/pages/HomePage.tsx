import React from "react";
import {withRouter} from "react-router";
import ScrambleDisplayRow from "../components/ScrambleDisplayRow";
import Timer from "../components/Timer";
import SolveHistory from "../components/SolveHistory";
import SessionStatistics from "../components/SessionStatistics";

const HomePage = () => {
    return (
        <div className={'home-container'}>
            <ScrambleDisplayRow/>
            <div className='solve-history-and-timer-container'>
                <SolveHistory/>
                <Timer/>
                <SessionStatistics />
            </div>
        </div>
    );
};

export default withRouter(HomePage);