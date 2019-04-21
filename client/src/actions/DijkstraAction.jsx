export function updateShortestPath(list, prev) {
	return function(dispatch) {
		dispatch({
			type: 'DS-update-shortest-path',
			payload: {
				shortestPath: list,
				previous: prev
			}
		});
	}
}

export function updatePreviousList(list) {
	return function(dispatch) {
		dispatch({
			type: 'DS-update-prev',
			payload: list
		});
	}
}

export function updateSimulator(dijkstra) {
	return function(dispatch) {
		dispatch({
			type: 'DS-update-simulator',
			payload: dijkstra
		});
	}
}