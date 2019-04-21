const initState = {
	shortestPath: [],
	previous: [],
	simulator: {
		on: false,
		shortestPath: [],
		prev: [],
		stepType: 'initial',
		msg: '',
		unvisited: [],
		visited: [],
		className: '',
		interval: null,
		duration: 1
	}
}

export const initSimulator = initState.simulator;

export default function reducer(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'DS-update-shortest-path' : {
			return {
				...state,
				shortestPath: payload.shortestPath,
				previous: payload.previous
			}
		}
		case 'DS-update-prev' : {
			return {
				...state,
				previous: payload
			}
		}
		case 'DS-update-simulator' : {
			return {
				...state,
				simulator: payload
			};
		}
		default: return state;
	}
}