import React from 'react';
import Panel from '../components/Panel.jsx';
import ActionPanel from '../components/ActionPanel.jsx';
import WeightTable from '../components/WeightTable.jsx';
import DijkstraPanel from '../components/DijkstraPanel.jsx';

class Graph extends React.Component {
	componentWillMount() {
		document.title = 'Graph';
	}

	render() {
		return (
			<div>
				<ActionPanel />
				<div className='uk-padding-small uk-position-relative'>
					<div className='panel-container'>
						<Panel />
					</div>
					<div className='uk-grid-collapse uk-child-width-1-2@m' uk-grid=''>
						<div>
							<WeightTable />
						</div>
						<div>
							<DijkstraPanel />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Graph;