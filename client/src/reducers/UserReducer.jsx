const initState = {
	form: {
		name: '',
		joinDate: '',
		msgs: {
			name: ''
		}
	}
}

export default function reducer(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'U-update-form' : {
			return {
				...state,
				form: payload
			}
		}
		default: return state;
	}
}