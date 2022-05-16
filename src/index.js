import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store } from "./store/main";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./store/main";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <ConnectedRouter history={ history }>
        <SnackbarProvider maxSnack={5}>
          <App/>
        </SnackbarProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
