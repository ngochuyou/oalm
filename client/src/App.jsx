import React, { Component } from 'react';
import Graph from './pages/Graph.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import UserPage from './pages/UserPage.jsx';
import { Route, withRouter } from 'react-router-dom' ;
import { connect } from 'react-redux';
import { init } from './actions/RootAction.jsx';
import { autoAuth } from './actions/AuthAction.jsx';

class App extends Component {
	async componentWillMount() {
		const props = this.props;
		
		props.dispatch(init(props.history));
		
		const result = await props.dispatch(autoAuth());

		if (result.status !== 200) {
			props.history.push('/login');
		}
	}

	render() {
		return (
			<div className='container'>
				<Route path='/' exact
				render={ (props) => <Graph { ...props }/>}/>
				<Route path='/login' exact
				render={ (props) => <RegistrationPage { ...props }/>}/>
				<Route path='/me' exact
				render={ (props) => <UserPage { ...props }/>}/>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		principal: store.auth.principal
	}
}

export default withRouter(connect(mapStateToProps)(App));