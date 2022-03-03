import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import HomePage from "./pages/HomePage";
import {ROUTES} from "./static/constants/routes";

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
                <div style={{minHeight: '100vh'}}>
                    <div className={'main-content'}>
                        <Switch>
                            <Route exact path='/'>
                                <HomePage/>
                            </Route>
                            {
                                Object.keys(ROUTES).map(toRoute)
                            }
                        </Switch>
                    </div>
                </div>
            </Router>
    );
}

export default (App);
