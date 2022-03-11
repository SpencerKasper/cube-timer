import './env'
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import HomePage from "./pages/HomePage";
import {ROUTES} from "./static/constants/routes";
import Amplify from "aws-amplify";
import {Authenticator} from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

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
            <Authenticator className='authentication-container' loginMechanisms={['email']} socialProviders={['google']} signUpAttributes={['email']}>
                {({signOut, user}) => (
                    <Router>
                        <Switch>
                            <Route exact path='/'>
                                <HomePage user={user} logOut={signOut}/>
                            </Route>
                            {
                                Object.keys(ROUTES).map(toRoute)
                            }
                        </Switch>
                    </Router>
                )}
            </Authenticator>
    );
}

export default (App);
