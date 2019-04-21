export function updateList(listName, list) {
	return function(dispatch) {
		dispatch({
			type: 'AP-update-selected-list',
			payload: {
				listName: listName,
				list: list
			}
		})
	}
}