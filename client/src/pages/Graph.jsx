import React from 'react';
import Panel from '../components/Panel.jsx';
import ActionPanel from '../components/ActionPanel.jsx';
import DijkstraPanel from '../components/DijkstraPanel.jsx';

class Graph extends React.Component {
	componentWillMount() {
		document.title = 'Graph';
	}

	render() {
		return (
			<div>
				<ActionPanel />
				<div className='panel-container'>
					<Panel />
				</div>
				<DijkstraPanel />
			</div>
		);
	}
}

export default Graph;