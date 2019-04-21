import React from 'react';
import VertexForm from './VertexForm.jsx';
import EdgeForm from './EdgeForm.jsx';
import DijkstraControl from './DijkstraControl.jsx';
import GraphControl from './GraphControl.jsx';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ActionPanel extends React.Component {
	render() {
		var saveLoadControl = null;
		var principalControl = null;
		var principal;
		const props = this.props;

		if ((principal = props.principal) !== null) {
			saveLoadControl = (<GraphControl />);
			principalControl = (
				<div>
					<p className='uk-margin-remove'><Link to='/me'>
					{ principal.user.username }
					</Link></p>
					<p className='uk-margin-remove uk-text-primary'>{ props.msg }</p>
				</div>
			)
		} else {
			principalControl = (
				<Link to='/login'><button className='uk-button uk-button-default'>
				Login</button></Link>
			)
		}

		return (
			<div>
				<div className='action-panel uk-grid-collapse'
				uk-sticky='animation: uk-animation-slide-top'
				uk-grid='' style={{ zIndex: 101 }}>
					<div className='uk-width-4-5'>
						{ saveLoadControl }
						<VertexForm />
						<EdgeForm />
						<DijkstraControl />
					</div>
					<div className='uk-width-1-5 uk-text-right'>
						<div className='uk-margin-right'>
							{ principalControl }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		principal: store.auth.principal,
		msg: store.graph.graphInfo.msg
	}
}

export default connect(mapStateToProps)(ActionPanel);