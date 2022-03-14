import './env'
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.scss';
import HomePage from "./pages/HomePage";
import {ROUTES} from "./static/constants/routes";
import {Amplify} from 'aws-amplify';
import {AmplifyProvider, Authenticator, useTheme, View, Theme} from '@aws-amplify/ui-react';
import RubiksCubeLogo from '../src/static/images/cube.png';

import '@aws-amplify/ui-react/styles.css';

const awsExports = {
    "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": process.env.REACT_APP_USER_POOLS_ID,
    "aws_user_pools_web_client_id": process.env.REACT_APP_POOLS_WEB_CLIENT_ID,
    "oauth": {
        "domain": "cubetimer-dev.auth.us-east-1.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "https://solvelog.com/",
        "redirectSignOut": "https://solvelog.com/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
};
if(!process.env.REACT_APP_IS_LOCAL) {
    Amplify.configure(awsExports);
}

function App() {
    const components = {
        Header() {
            const {tokens} = useTheme();

            return (
                <View textAlign="center" padding={tokens.space.large}>
                    <div className={'login-header'}>
                        <h1>
                            SolveLog
                        </h1>
                        <img
                            alt="Amplify logo"
                            src={RubiksCubeLogo}
                            height={48}
                            width={48}
                        />
                    </div>
                </View>
            );
        },
    };
    const toRoute = (route, index) => {
        const routeInfo = ROUTES[route];
        return <Route
            key={`route-${index}`}
            path={routeInfo.route}>
            {routeInfo.component}
        </Route>;
    };

    const defaultTheme: Theme = {
        name: 'default',
        tokens: {
            fonts: {
                default: {
                    variable: {value: 'Roboto, sans-serif'},
                    static: {value: 'Roboto, sans-serif'},
                },
            },
            colors: {
                font: {inverse: {value: 'black'}},
                background: {
                    primary: {value: '#051014'},
                    secondary: {value: 'white'},
                },
                brand: {
                    primary: {
                        80: {value: '#bcf8ec'},
                    }
                }
            },
        },
    };
    return (
        process.env.REACT_APP_IS_LOCAL ?
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <HomePage user={{attributes:{email: 'spencer.kasper@gmail.com'}}} logOut={() => null}/>
                    </Route>
                    {
                        Object.keys(ROUTES).map(toRoute)
                    }
                </Switch>
            </Router> :
        <AmplifyProvider theme={defaultTheme}>
            <Authenticator components={components} className='authentication-container' loginMechanisms={['email']}
                           socialProviders={[]} signUpAttributes={['email']}>
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
        </AmplifyProvider>
    );
}

export default (App);
