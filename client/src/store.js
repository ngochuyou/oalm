import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers/RootReducer.jsx';

var middleware = [ thunk ];

if (process.env.NODE_ENV !== 'production') {
	middleware = [ ...middleware, logger ]
}

export default createStore(rootReducer, applyMiddleware(...middleware));