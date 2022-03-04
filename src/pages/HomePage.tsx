import React from "react";
import {withRouter} from "react-router";
import ScrambleDisplayRow from "../components/ScrambleDisplayRow";
import Timer from "../components/Timer";
import {useSelector} from "react-redux";
import {ReduxStore} from "../redux/redux-store";

const HomePage = () => {
    return (
        <div className={'home-container'}>
            <ScrambleDisplayRow/>
            <Timer />
        </div>
    );
};

export default withRouter(HomePage);