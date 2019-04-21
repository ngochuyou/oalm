import React from 'react';

class ErrorMessage extends React.Component {
	render() {
		return (
			<span className='uk-text-danger'>{ this.props.message }</span>
		);
	}
}

export default ErrorMessage;