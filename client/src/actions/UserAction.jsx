export function updateForm(form) {
	return function(dispatch) {
		dispatch({
			type: 'U-update-form',
			payload: form
		})
	}
}