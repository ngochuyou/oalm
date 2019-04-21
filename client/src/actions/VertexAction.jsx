export function updateForm(form) {
	return function(dispatch) {
		dispatch({
			type: 'VT-update-form',
			payload: form
		})
	}
}

export function updateList(list) {
	return function(dispatch) {
		dispatch({
			type: 'VT-update-list',
			payload: list
		})
	}
}

export function updateTree(tree) {
	return function(dispatch) {
		dispatch({
			type: 'VT-update-tree',
			payload: tree
		})
	}
}