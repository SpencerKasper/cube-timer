import './env';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import './static/scss/_Default.scss';
import reduxStore from "./redux/redux-store";

ReactDOM.render(
    <Provider store={reduxStore}>
      <App />
    </Provider>,
  document.getElementById("root")
);