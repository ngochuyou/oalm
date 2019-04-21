import BinaryTree from '../structures/BinaryTree.jsx';
import { ADD } from '../reducers/FormActions.jsx';

export const initState = {
	tree: new BinaryTree(),
	list: [],
	form: {
		data: '',
		msg: '',
		action: ADD
	}
}

export default function reducer(state = { ...initState }, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'VT-update-form': {
			return {
				...state,
				form: payload
			}
		}
		case 'VT-update-list' : {
			return {
				...state,
				list: payload
			}
		}
		case 'VT-update-tree' : {
			return {
				...state,
				tree: payload
			}
		}
		default: return state;
	}
}