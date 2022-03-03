import React from "react";
import {withRouter} from "react-router";

const HomePage = () => {
    return (
        <div className={'home-container'}>
            Hello World!
        </div>
    );
};

export default withRouter(HomePage);