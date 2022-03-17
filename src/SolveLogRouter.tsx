import {ROUTES} from "./static/constants/routes";
import HomePage from "./pages/AuthenticatedHomePage";
import React from "react";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Header} from "./components/Header";

export const SolveLogRouter = (props: { user; logOut }) => {
    const {user, logOut} = props;
    const toRoute = (route, index) => {
        const routeInfo = ROUTES[route];
        return <Route
            key={`route-${index}`}
            path={routeInfo.route}>
            {routeInfo.component}
        </Route>;
    };
    return (
        <>
            <Header logOut={logOut}/>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <HomePage user={user} logOut={logOut}/>
                    </Route>
                    {
                        Object.keys(ROUTES).map(toRoute)
                    }
                </Switch>
            </Router>
            </>
    );
};