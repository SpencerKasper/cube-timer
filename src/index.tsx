import './env';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import './static/scss/_Default.scss';
import reduxStore from "./redux/redux-store";
import {createTheme, ThemeProvider} from "@mui/material";
const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#bcf8ec',
            contrastText: '#000000'
        },
        secondary: {
            main: '#051014',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#BFF7BC',
            contrastText: '#000000'
        },
        warning: {
            main: '#F8EBBA',
            contrastText: '#000000',
        },
        error: {
            main: '#F8BAC6',
            contrastText: '#000000'
        }
    }
});
ReactDOM.render(
    <Provider store={reduxStore}>
        <ThemeProvider theme={muiTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
  document.getElementById("root")
);
