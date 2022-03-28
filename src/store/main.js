import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {userReducer, userInitialState} from "./userReducer";

import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'


export const history = createBrowserHistory()

// let middleware = [
//     routerMiddleware(history)
// ]

export const store = createStore(
    combineReducers({
        user: userReducer,
        router: connectRouter(history)
    }),
    {
        user: userInitialState
    },
    composeWithDevTools()
  // compose(
    //     applyMiddleware(routerMiddleware(history))
    // )
)