import {ROUTES} from "./static/constants/routes";
import HomePage from "./pages/AuthenticatedHomePage";
import React from "react";
import {Route, Switch} from "react-router-dom";
import {Page} from "./components/Page";

export const SolveLogRouter = (props: { user; logOut }) => {
    const {user, logOut} = props;
    const toRoute = (route, index) => {
        const routeInfo = ROUTES[route];
        const ComponentToRender = routeInfo.component;
        return <Route
            key={`route-${index}`}
            path={routeInfo.route}>
            <Page logOut={logOut}>
                <ComponentToRender logOut={logOut}/>
            </Page>
        </Route>;
    };
    return (
        <div className={'app-container'}>
            <Switch>
                <Route exact path='/'>
                    <Page logOut={logOut}>
                        <HomePage user={user} logOut={logOut}/>
                    </Page>
                </Route>
                {
                    Object.keys(ROUTES).map(toRoute)
                }
            </Switch>
        </div>
    );
};