export const initState = {
	principal: null,
	login: {
		form: {
			username: '',
			password: '',
			msgs: {
				username: '',
				password: ''
			}
		},
	},
	signUp: {
		form: {
			username: '',
			name: '',
			password: '',
			msgs: {
				username: '',
				name: '',
				password: ''
			}
		}
	}
}

export default function reducer(state = initState, action) {
	const payload = action.payload;

	switch(action.type) {
		case 'AU-init': {
			return payload;
		}
		case 'AU-update-form' : {
			const name = payload.name;

			return {
				...state,
				[name] : {
					...state[name],
					form: payload.form
				}
			}
		}
		case 'AU-principal-fulfilled' : {
			return {
				...state,
				principal: payload
			}
		}
		default: return state;
	}
}