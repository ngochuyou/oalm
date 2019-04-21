import { combineReducers } from 'redux';
import vertex from './VertexReducer.jsx';
import edge from './EdgeReducer.jsx';
import actionPanel from './ActionPanelReducer.jsx';
import dijkstra from './DijkstraReducer.jsx';
import auth from './AuthReducer.jsx';
import graph from './GraphReducer.jsx';
import user from './UserReducer.jsx';

const initState = {
	history: null
}

function _root(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'ROOT-init' : {
			return {
				...state,
				history: payload.history	
			}
		}
		default: return state
	}
}

export default combineReducers({
	 _root, vertex, edge,
	 actionPanel, dijkstra, auth,
	 graph, user
});
