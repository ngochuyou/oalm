import React from 'react';
import VertexForm from './VertexForm.jsx';
import EdgeForm from './EdgeForm.jsx';
import DijkstraControl from './DijkstraControl.jsx';
import GraphControl from './GraphControl.jsx';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ActionPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hidden: true
		}
	}

	render() {
		var saveLoadControl = null;
		var principalControl = null;
		var principal;
		const props = this.props;

		if ((principal = props.principal) !== null) {
			saveLoadControl = ( <GraphControl /> );
			principalControl = (
				<div>	
					<p className='uk-margin-remove padding-x'><Link to='/me'>
					{ principal.user.name }
					</Link></p>
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
				<div className='action-panel'
				uk-sticky='animation: uk-animation-slide-top'
				style={{ zIndex: 101 }}>
					<div>
						<div className='uk-position-relative'
						>{ principalControl }</div>
						{ saveLoadControl }
						<VertexForm />
						<EdgeForm />
						<DijkstraControl />
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