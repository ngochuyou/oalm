export function updateForm(form) {
	return function(dispatch) {
		dispatch({
			type: 'ED-update-form',
			payload: form
		})
	}
}

export function updateList(list) {
	return function(dispatch) {
		dispatch({
			type: 'ED-update-list',
			payload: list
		})
	}
}

export function updateWeights(weights) {
	return function(dispatch) {
		dispatch({
			type: 'ED-update-weights',
			payload: weights
		})
	}
}