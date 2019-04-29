import React, { Component } from 'react';
import Graph from './pages/Graph.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import UserPage from './pages/UserPage.jsx';
import { Route, withRouter } from 'react-router-dom' ;

class App extends Component {
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

export default withRouter(App);