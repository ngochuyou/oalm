import React from 'react';
import { connect } from 'react-redux';
import { updateForm, signUp } from '../actions/AuthAction.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

class SignUpForm extends React.Component {
	onChange(e) {
		const props = this.props;

		props.dispatch(updateForm('signUp', {
			...props.form,
			[e.target.name]: e.target.value
		}));
	}

	signUp() {
		const props = this.props;

		props.dispatch(signUp({ ...props.form }, props.history));
	}

	render() {
		const form = this.props.form;
		const msgs = form.msgs;

		return (
			<div>
				<button className='uk-position-medium uk-position-top-right'
				onClick={ this.props.toggleSignUpForm }
				uk-close=''></button>
				<h1><i className='fas fa-file-signature uk-margin-right'>
				</i></h1>
				<h3 className='uk-text-muted'>Sign Up</h3>
				<div className='form-control'>
					<input required='required' id='signUp-form-username'
					value={ form.username } name='username'
					onChange={ this.onChange.bind(this) }/>
					<label forhtml='signUp-form-username'>Username</label>
					<ErrorMessage message={ msgs.username }/>
				</div>
				<div className='form-control uk-margin'>
					<input required='required' id='signUp-form-name'
					value={ form.name } name='name'
					onChange={ this.onChange.bind(this) }/>
					<label forhtml='signUp-form-name'>Name</label>
					<ErrorMessage message={ msgs.name }/>
				</div>
				<div className='form-control uk-margin'>
					<input required='required' id='signUp-form-password'
					value={ form.password } name='password'
					type='password' onChange={ this.onChange.bind(this) }/>
					<label forhtml='signUp-form-password'>Password</label>
					<ErrorMessage message={ msgs.password }/>
				</div>
				<div className='uk-margin'>
					<button className='uk-button uk-button-primary'
					onClick={ this.signUp.bind(this) }
					>Sign Up</button>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		history: store._root.history,
		form: store.auth.signUp.form
	}
}

export default connect(mapStateToProps)(SignUpForm);