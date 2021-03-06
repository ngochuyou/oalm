import React from 'react';
import { connect } from 'react-redux';
import Account from '../components/Account.jsx';
import { logout } from '../actions/AuthAction.jsx';
import { init } from '../actions/RootAction.jsx';
import { autoAuth } from '../actions/AuthAction.jsx';

class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0,
			tabs: ['ls', '']
		}
	}

	async componentWillMount() {
		const props = this.props;
		
		props.dispatch(init(props.history));
		
		const result = await props.dispatch(autoAuth());

		if (!result) return ;
		if (result.status !== 200) {
			props.history.push('/login');
		}
		document.title = 'User page';
	}

	switchTab(index) {
		if (this.state.selectedTab === index) {
			return ;
		}

		var tabs = ['', ''];

		tabs[index] = 'ls';

		this.setState({
			selectedTab: index,
			tabs: tabs
		});
	}

	async logout() {
		const res = await logout(this.props.principal);

		if (res !== null) {
			if (res.status === 200) {
				this.props.history.push('/login');

				return;
			}
		}
	}

	render() {
		if (this.props.principal === null) {
			return null;
		}
			
		const user = this.props.principal.user;
		var tab = null;
		const state = this.state;

		switch(state.selectedTab) {
			case 0: {
				tab = <Account />;
				break;
			}
			default: tab = null;
		}

		return (
			<div className='uk-grid-collapse full-grid' uk-grid=''>
				<div className='uk-width-1-4 uk-padding-small sidebar'>
					<h3 className='uk-text-truncate'><i className='fas fa-igloo uk-margin-right'>
					</i><span className='uk-text-bold'
					>{ user.username + '\t' }</span>
					<span className='uk-text-meta'>{ user.name }</span></h3>
					<div className='uk-margin-medium-left'>
						<ul uk-nav='' uk-switcher='' className='pointer'>
							<li onClick={ this.switchTab.bind(this, 0) }>
								<div>
									<i className={ 'fas fa-info ' + state.tabs[0] }></i>
								</div>
								<span className='item-name'>Account</span>
							</li>
							<li onClick={ () => this.props.history.push('/') }>
								<div><i className='fab fa-connectdevelop'></i></div>
								<span className='item-name'>My Graphs</span>
							</li>
							<li onClick={ this.logout.bind(this) }>
								<div><i className='fas fa-sign-out-alt'></i></div>
								<span className='item-name'>Log out</span>
							</li>
						</ul>
					</div>
				</div>
				<div className='uk-width-3-4 uk-padding'>
					{ tab }
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		principal: store.auth.principal
	}
}

export default connect(mapStateToProps)(UserPage);