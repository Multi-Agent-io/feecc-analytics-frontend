import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import { userReducer, userInitialState } from './userReducer';

export const history = createBrowserHistory();

// let middleware = [
//     routerMiddleware(history)
// ]

export const store = createStore(
  combineReducers({
    user: userReducer,
    router: connectRouter(history),
  }),
  {
    user: userInitialState,
  },
  composeWithDevTools(),
  // compose(
  //     applyMiddleware(routerMiddleware(history))
  // )
);
