import React from 'react';
import { connect } from 'react-redux';
import { updateForm, init, authorize, autoAuth } from '../actions/AuthAction.jsx';
import { initState } from '../reducers/AuthReducer.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import SignUpForm from '../components/SignUpForm.jsx';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signUp: false
		}
	}

	async componentWillMount() {
		const props = this.props;
		props.dispatch(init(initState));

		const result = await props.dispatch(autoAuth());

		if (result.status === 200) {
			props.history.push('/');
		}
	}

	onChange(e) {
		const props = this.props;

		props.dispatch(updateForm('login', {
			...props.form,
			[e.target.name]: e.target.value
		}));
	}

	toggleSignUpForm() {
		const props = this.props;
		const signUp = this.state.signUp;

		if (!signUp) {
			props.dispatch(updateForm('signUp', initState.signUp.form));
		}

		this.setState({
			signUp: !signUp
		});
	}

	auth() {
		const props = this.props;

		props.dispatch(authorize({ ...props.form }, props.history));
	}

	render() {
		const form = this.props.form;
		const signUp = this.state.signUp;

		return (
			<div className='uk-grid-collapse height-screen'
			uk-grid=''>
				<div className={ ( !signUp ? 'uk-width-2-3' : 'uk-width-1-3' ) + ' transition uk-position-relative' }
				style={ { minHeight: '100vh' } }>
					<div className='logo-large'>
						<i className='fab fa-connectdevelop spin uk-margin-right'>
						</i>
					</div>
				</div>
				<div className='uk-width-1-3 uk-padding transition box-shadow'>
					<h1><i className='fab fa-connectdevelop uk-margin-right'>
					</i>Graph</h1>
					<h3 className='uk-text-muted'>Login</h3>
					<div className='form-control'>
						<input required='required' value={ form.username }
						id='login-form-username' name='username'
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='login-form-username'>Username</label>
						<ErrorMessage message={ form.msgs.username }/>
					</div>
					<div className='form-control uk-margin'>
						<input required='required' value={ form.password }
						id='login-form-password' name='password' type='password'
						onChange={ this.onChange.bind(this) }/>
						<label forhtml='login-form-password'>Password</label>
						<ErrorMessage message={ form.msgs.password }/>
					</div>
					<div className='uk-margin uk-column-1-2' uk-column=''>
						<button className='uk-button uk-button-primary'
						onClick={ this.auth.bind(this) }
						>Login</button>
						<div className='uk-text-right'>
							<p className='uk-text-primary pointer'
							onClick={ this.toggleSignUpForm.bind(this) }>Sign up</p>
						</div>
					</div>
				</div>
				{
					!signUp ? null :
					(
						<div className='uk-width-1-3 uk-padding transition'>
							<SignUpForm toggleSignUpForm={ this.toggleSignUpForm.bind(this) }/>
						</div>
					)
				}
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	const auth = store.auth;

	return {
		principal: auth.principal,
		form: auth.login.form,
		signUpForm: auth.signUp.form
	}
}

export default connect(mapStateToProps)(Login);