export function init(history) {
	return function(dispatch) {
		dispatch({
			type: 'ROOT-init',
			payload: {
				history: history
			}
		})
	}
}