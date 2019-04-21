import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from './ErrorMessage.jsx';
import { updateForm, updateUser } from '../actions/UserAction.jsx';
import { fromString } from '../structures/DateTimeFormatter.js';
import { validate } from '../actions/AuthAction.jsx';

class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: false,
			confirm: false,
			confirmValue: ''
		}
	}

	onChange(e) {
		const props = this.props;

		props.dispatch(updateForm({
			...props.form,
			[e.target.name]: e.target.value
		}));
	}

	togglePassword() {
		var password = this.state.password;
		const props = this.props;

		if (!password) {
			props.dispatch(updateForm({
				...props.form,
				password: '',
				nPassword: '',
				rePassword: ''
			}));
		} else {
			props.dispatch(updateForm({
				...props.form,
				password: undefined,
				nPassword: undefined,
				rePassword: undefined
			}));
		}

		this.setState({
			password: !password,
			confirm: false
		});
	}

	async update() {
		const props = this.props;
		const form = props.form;

		if (!this.state.password) {
			this.setState({
				confirm: true
			});

			return ;
		}

		const result = validate({
			...form,
			username: props.principal.user.username
		});

		props.dispatch(updateForm(result.form));

		if (result.ok) {
			const res = await props.dispatch(updateUser({
				...props.principal,
				user: {
					...props.principal.user,
					name: form.name,
					password: form.nPassword
				}
			}, form.password));

			if (res !== null) {
				if (res.status === 200) {
					props.history.push('/login');
				}
			}
		}
	}

	onConfirmChange(e) {
		this.setState({
			confirmValue: e.target.value
		});
	}

	async onConfirm(e) {
		if (e.keyCode === 13) {
			const props = this.props;
			const user = props.principal.user;
			const result = validate({
				...props.form,
				username: user.username,
				password: this.state.confirmValue
			});
			
			if (result.ok) {
				const form = result.form;
				const res = await props.dispatch(updateUser({
					...props.principal,
					user: {
						...user,
						name: form.name,
						password: form.password
					}
				}, form.password));

				if (res !== null) {
					if (res.status === 200) {
						props.history.push('/login');
					}
				}
			}
		}
	}

	render() {
		const props = this.props;
		const form = props.form;
		const user = props.principal.user;
		const state = this.state;

		const password = ( state.password ?	
			(
				<div>
					<div className='form-control'>
						<input required='required' type='password'
						name='password' id='info-password' value={ form.password }
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='info-password'>Old Password</label>
						<ErrorMessage message={ form.msgs.password } />
					</div>
					<div className='form-control'>
						<input required='required' type='password'
						name='nPassword' id='info-nPassword' value={ form.nPassword }
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='info-nPassword'>New Password</label>
						<ErrorMessage message={ form.msgs.nPassword } />
					</div>
					<div className='form-control'>
						<input required='required' type='password'
						name='rePassword' id='info-rePassword' value={ form.rePassword }
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='info-rePassword'>Reenter New Password</label>
						<ErrorMessage message={ form.msgs.rePassword } />
					</div>
				</div>
			) : null
		)

		const confirm = ( state.confirm ? 
			(
				<div className='form-control'>
					<input required='required' type='password'
					name='password' id='info-password'
					value={ state.confirmValue }
					onChange={ this.onConfirmChange.bind(this) }
					onKeyDown={ this.onConfirm.bind(this) }/>
					<label forhtml='info-password'>Password</label>
				</div>
			) : null
		)

		return (
			<div>
				<h2 className='uk-heading uk-heading-line'>
				<span>Account Informations</span></h2>
				<div className='uk-width-1-2'>
					<div className='form-control'>
						<input required='required'
						className='uk-disabled' readOnly name='username'
						value={ user.username }/>
					</div>
					<div className='form-control'>
						<input required='required'
						name='name' id='info-name' value={ form.name }
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='#info-name'>Name</label>
						<ErrorMessage message={ form.msgs.name } />
					</div>
					<div className='uk-margin-top'>
						<a href='#p' onClick={ this.togglePassword.bind(this) }
						><i>Change password</i></a>
						{ confirm }
						{ password }
					</div>
					<p className='uk-text-meta'>Joined on { fromString(user.joinDate) }</p>
					<button className='uk-button uk-button-primary'
					onClick={ this.update.bind(this) }>
					Update</button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		principal: store.auth.principal,
		form: store.user.form,
		history: store._root.history
	}
}

export default connect(mapStateToProps)(Account);