import React, {useEffect} from "react";
import {withRouter} from "react-router";
import ScrambleDisplayRow from "../components/ScrambleDisplay";
import Timer from "../components/Timer";
import SolveLog from "../components/SolveLog";
import SessionStatistics from "../components/SessionStatistics";
import reduxStore from "../redux/redux-store";
import RubiksCubeIcon from '../static/images/cube.png';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const HomePage = (props) => {
    useEffect(() => {
        reduxStore.dispatch({
            type: 'signInUserSession/set',
            payload: {user: props.user},
        });
    }, [props.user]);
    return (
        <div className={'home-container'}>
            <ToastContainer />
            <div className='scramble-display-row'>
                <div className='logo'>
                    <h1 className='logo-title'>
                        SolveLog
                    </h1>
                    <div>
                        <img src={RubiksCubeIcon} width={48} height={48}/>
                    </div>
                </div>
                <ScrambleDisplayRow/>
                <div className='log-out-and-user-name'>
                    <p className='user-name'>{props.user.attributes.email}</p>
                    <p className='log-out' onClick={() => props.logOut()}>Log Out</p>
                </div>
            </div>
            <div className='solve-history-and-timer-container'>
                <SolveLog/>
                <Timer/>
                <SessionStatistics/>
            </div>
        </div>
    );
};

export default withRouter(HomePage);