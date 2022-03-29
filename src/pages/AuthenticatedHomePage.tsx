import React, {useEffect} from "react";
import {withRouter} from "react-router";
import Timer from "../components/Timer";
import SolveLog from "../components/SolveLog";
import SessionStatistics from "../components/SessionStatistics";
import 'react-toastify/dist/ReactToastify.css';

const AuthenticatedHomePage = () => {
    return (
        <div className='solve-history-and-timer-container'>
            <SolveLog/>
            <Timer/>
            <SessionStatistics/>
        </div>
    );
};

export default withRouter(AuthenticatedHomePage);