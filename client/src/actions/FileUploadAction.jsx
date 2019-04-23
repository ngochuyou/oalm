import { backendURI } from '../keys.js';

export async function uploadBlob(principal, blob) {
	var form = new FormData();

	form.append('file', new File([blob], 'img'));

	return await fetch(backendURI + '/api/files?ext=jpeg', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'x-auth-token' : principal.token
		},
		body: form
	})
	.then(
		res => {
			return res
		}
	)
}

export async function getFile(principal, filename) {
	return await fetch(backendURI + '/api/files/' + filename, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'x-auth-token' : principal.token
		}
	})
	.then(
		res => {
			return res
		}
	)
}