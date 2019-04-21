import { backendURI } from '../keys.js';

export function updateForm(form) {
	return function(dispatch) {
		dispatch({
			type: 'U-update-form',
			payload: form
		})
	}
}

export function updateUser(principal, password) {
	return async function(dispatch) {
		if (!principal) {

			return null;	
		}

		if (!principal.user) {
			return null;
		}

		return await fetch(backendURI + '/api/users', {
			method: 'PUT',
			mode: 'cors',
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json',
				'x-auth-token' : principal.token
			},
			body: JSON.stringify({
				user: principal.user,
				password: password
			})
		})
		.then(
			async res => {
				return {
					status: res.status,
					json: await res.json()
				}
			}
		)
	}
}