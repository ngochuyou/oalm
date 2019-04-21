const initState = {
	graphInfo: {
		id: null,
		name: 'untitled',
		msg: ''
	},
	graphs: [],
	form: {
		target: null,
		name: ''
	}
}

export default function reducer(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'G-update-info' : {
			return {
				...state,
				graphInfo : payload
			};
		}
		case 'G-update-list' : {
			return {
				...state,
				graphs : payload
			};
		}
		case 'G-update-form' : {
			return {
				...state,
				form : payload
			};
		}
		default: return state;
	}
}