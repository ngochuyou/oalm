const initState = {
	selectedVertices: []
}

export default function reducer(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'AP-update-selected-list' : {
			return {
				...state,
				[payload.listName] : payload.list
			};
		}
		default: return state;
	}
}