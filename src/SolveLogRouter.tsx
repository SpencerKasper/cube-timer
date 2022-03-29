import {ROUTES} from "./static/constants/routes";
import HomePage from "./pages/AuthenticatedHomePage";
import React, {useEffect} from "react";
import {Route, Switch} from "react-router-dom";
import {Page} from "./components/Page";
import reduxStore from "./redux/redux-store";

export const SolveLogRouter = (props: { user; logOut }) => {
    const {user, logOut} = props;
    useEffect(() => {
        reduxStore.dispatch({
            type: 'signInUserSession/set',
            payload: {user: props.user},
        });
    }, [user]);
    const toRoute = (route, index) => {
        const routeInfo = ROUTES[route];
        const ComponentToRender = routeInfo.component;
        return <Route
            key={`route-${index}`}
            path={routeInfo.route}>

            <Page logOut={logOut}>
                <ComponentToRender user={user}/>
            </Page>
        </Route>;
    };
    return (
        <div className={'app-container'}>
            <Switch>
                <Route exact path='/'>
                    <Page logOut={logOut}>
                        <HomePage />
                    </Page>
                </Route>
                {
                    Object.keys(ROUTES).map(toRoute)
                }
            </Switch>
        </div>
    );
};