import {applyMiddleware, combineReducers, compose, createStore} from "redux";
// import {composeWithDevTools} from "redux-devtools-extension";
import {userReducer, userInitialState} from "./userReducer";

import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import {filtersInitialState, filtersReducer} from "./filtersReducer";


export const history = createBrowserHistory()

// let middleware = [
//     routerMiddleware(history)
// ]

export const store = createStore(
    combineReducers({
        user: userReducer,
        filters: filtersReducer,
        router: connectRouter(history)
    }),
    {
        user: userInitialState,
        filters: filtersInitialState
    },
    compose(
        applyMiddleware(routerMiddleware(history))
    )
)