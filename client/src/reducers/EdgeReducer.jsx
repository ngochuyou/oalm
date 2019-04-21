import { ADD } from '../reducers/FormActions.jsx';

const initState = {
	list: [],
	form: {
		weight: 1,
		msg: '',
		action: ADD
	},
	weights: []
}

export default function reducer(state = { ...initState }, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'ED-update-form' : {
			return {
				...state,
				form: payload
			}
		}
		case 'ED-update-list' : {
			return {
				...state,
				list: payload
			}
		}
		case 'ED-update-weights' : {
			return {
				...state,
				weights: payload
			}
		}
		default: return state;
	}
}