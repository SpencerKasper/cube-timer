import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import HomePage from "./pages/HomePage";
import {ROUTES} from "./static/constants/routes";
import ScrambleDisplayRow from "./components/ScrambleDisplayRow";

function App() {
    const toRoute = (route, index) => {
        const routeInfo = ROUTES[route];
        return <Route
            key={`route-${index}`}
            path={routeInfo.route}>
            {routeInfo.component}
        </Route>;
    };

    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <HomePage/>
                </Route>
                {
                    Object.keys(ROUTES).map(toRoute)
                }
            </Switch>
        </Router>
    );
}

export default (App);
