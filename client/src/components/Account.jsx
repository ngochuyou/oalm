import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from './ErrorMessage.jsx';
import { updateForm } from '../actions/UserAction.jsx';
import { fromString } from '../structures/DateTimeFormatter.js';

class Account extends React.Component {
	onChange(e) {
		const props = this.props;

		props.dispatch(updateForm({
			...props.form,
			[e.target.name]: e.target.value
		}));
	}

	render() {
		const props = this.props;
		const form = props.form;
		const user = props.principal.user;

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
					<p className='uk-text-meta'>Joined on { fromString(user.joinDate) }</p>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		principal: store.auth.principal,
		form: store.user.form
	}
}

export default connect(mapStateToProps)(Account);