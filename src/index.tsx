import './env';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import './static/scss/_Default.scss';
import reduxStore from "./redux/redux-store";
import {MuiThemeProvider} from "@material-ui/core";
import {createTheme} from "@mui/material";
const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#bcf8ec'
        },
        secondary: {
            main: '#051014'
        }
    }
});
ReactDOM.render(
    <Provider store={reduxStore}>
        <MuiThemeProvider theme={muiTheme}>
            <App />
        </MuiThemeProvider>
    </Provider>,
  document.getElementById("root")
);
