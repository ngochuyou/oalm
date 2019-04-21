import { backendURI } from '../keys.js';
import { appendTime } from '../structures/DateTimeFormatter.js';

export function init(state) {
	return function(dispatch) {
		dispatch({
			type: 'AU-init',
			payload: state
		})
	}
}

export function updateForm(name, form) {
	return function(dispatch) {
		dispatch({
			type: 'AU-update-form',
			payload: {
				name: name,
				form: form
			}
		})
	}
}

export function signUp(form, history) {
	return async function(dispatch) {
		const validation = validate(form);
		
		dispatch({
			type: 'AU-update-form',
			payload: {
				name: 'signUp',
				form: validation.form
			}
		});

		if (validation.ok) {
			const form = validation.form;
			const usernameCheckResult = await auth(form.username, 'mypassword');
			
			if (usernameCheckResult.status !== 404) {
				dispatch({
					type: 'AU-update-form',
					payload: {
						name: 'signUp',
						form: {
							...form,
							msgs: {
								...form.msgs,
								username: '*This username has already been used.'
							}
						}
					}
				});

				return ;
			}

			const result = await fetch(backendURI + '/api/users', {
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify({
					username: form.username,
					name: form.name,
					password: form.password
				}),
				headers: {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json',
				}
			})
			.then(
				res => {
					if (res.status === 200) {
						return res.json();
					}

					return false;
				},
				err => console.log(err)
			);

			if (result !== false) {
				dispatch({
					type: 'AU-principal-fulfilled',
					payload: result
				});

				history.push('/');
			}
		}
	}
}

export function authorize(form, history) {
	return async function(dispatch) {
		const validation = validate(form);
		
		dispatch({
			type: 'AU-update-form',
			payload: {
				name: 'login',
				form: validation.form
			}
		});

		if (validation.ok) {
			const authz = await auth(form.username, form.password);

			if (authz === undefined) {
				return ;
			}

			if (authz.status === 404) {
				dispatch({
					type: 'AU-update-form',
					payload: {
						name: 'login',
						form: {
							...validation.form,
							msgs: {
								...validation.form.msgs,
								username: '*Unable to find your username.'	
							}
						}
					}
				});

				return ;
			}

			if (authz.status === 400) {
				dispatch({
					type: 'AU-update-form',
					payload: {
						name: 'login',
						form: {
							...validation.form,
							msgs: {
								...validation.form.msgs,
								password: '*Invalid credentials.'
							}
						}
					}
				});

				return ;
			}

			dispatch({
				type: 'AU-principal-fulfilled',
				payload: authz.res
			});

			const user = authz.res.user;

			dispatch({
				type: 'U-update-form',
				payload: {
					name: user.name,
					msgs: {
						name: ''
					}
				}
			});
				
			document.cookie = 'GRAPH_USERNAME=' + authz.res.user.username + '; expires=' + appendTime(new Date(), 1).toUTCString();

			history.push('/');
		}
	}
}

export function autoAuth() {
	return async function(dispatch) {
		const username = document.cookie.replace(/(?:(?:^|.*;\s*)GRAPH_USERNAME\s*=\s*([^;]*).*$)|^.*$/, "$1");
		
		if (username !== null) {
			const authz = await auth(username, null);
			
			if (authz.status === 200) {
				dispatch({
					type: 'AU-principal-fulfilled',
					payload: authz.res
				});

				const user = authz.res.user;

				dispatch({
					type: 'U-update-form',
					payload: {
						name: user.name,
						msgs: {
							name: ''
						}
					}
				});
			}

			return authz;
		}
	}
}

function validate(form) {
	if (!form) return { ok: false, form: form };

	if (form.username === null || form.name === null || form.password === null) {
		return {
			ok: false,
			form: form
		}
	};

	const msgs = form.msgs;
	var flag = true;

	if (form.username.length < 8 || form.username.length > 32) {
		msgs.username = '*Username must have the length between 8 and 32.';
		flag = false;
	} else {
		msgs.username = '';
	}

	if (form.name !== undefined) {
		if (form.name.length < 1 || form.name.length > 32) {
			msgs.name = '*Name must have the length between 1 and 32.';
			flag = false;
		} else {
			msgs.name = '';
		}
	}

	if (form.password.length < 8  || form.password.length > 50) {
		msgs.password = '*Password must have the length between 8 and 50.';
		flag = false;
	} else {
		msgs.password = '';
	}

	return {
		ok: flag,
		form: form
	}
}

async function auth(username, password) {
	return await fetch(backendURI + '/api/auth', {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			username: username,
			password: password
		}),
		headers: {
			'Content-Type' : 'application/json',
			'Accept' : 'application/json',
		}
	})
	.then(
		async res => {
			return {
				status: res.status,
				res: await res.json()
			}
		},
		err => console.log(err)
	)
}