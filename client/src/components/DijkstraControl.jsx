import React from 'react';
import { connect } from 'react-redux';
import { updateShortestPath, updateSimulator } from '../actions/DijkstraAction.jsx';

class DijkstraControl extends React.Component {
	toggleSimulator() {
		const props = this.props;
		const simulator = props.simulator;

		if (simulator.on) {
			props.dispatch(updateSimulator({
				...simulator,
				className: 'fadeOut'
			}));

			setTimeout(() => {
				props.dispatch(updateSimulator({
					...simulator,
					on: false
				}));
			}, 150);
		} else {
			props.dispatch(updateSimulator({
				...simulator,
				on: true
			}));
		}

		return ;
	}

	dijkstra() {
		const props = this.props;

		if (props.selectedVertices.length === 0) {
			return ;
		}

		var start = props.selectedVertices[0].index;
		const I = Infinity;
		const vertices = props.vertices.map((v) => { return v.data });
		const weights = props.weights;
		var shortestPath = [];
		var unvisited = [];
		var prev = [];

		for (var i of vertices.keys()) {
			if (i === start) {
				shortestPath.push(0);
			} else {
				shortestPath.push(I);
			}

			prev.push(null);
			unvisited.push(vertices[i]);
		}

		var visited = [];
		var s, c, min, pos, tmp;
		const after = () => {
			visited.push(vertices[start]);
			unvisited.splice(unvisited.indexOf(vertices[start]), 1);
			
			min = Infinity;
			pos = null;
			
			for (i of unvisited) {
				tmp = vertices.indexOf(i);
				if (shortestPath[tmp] < min) {
					min = shortestPath[tmp];
					pos = tmp;
				}
			}

			start = pos;
		}

		while (unvisited.length !== 0) {
			if (start === null) {
				after();
				break;
			}

			tmp = weights[start];

			for (i of tmp.keys()) {
				if (tmp[i] !== I && tmp[i] !== 0 && visited.indexOf(vertices[i]) === -1) {
					s = shortestPath[i];
					c = shortestPath[start] + tmp[i];

					if (c < s) {
						shortestPath[i] = c;
						prev[i] = vertices[start];
					}
				}
			}

			after();
		}
		
		var details = [];
		var t;

		for (i of prev.keys()) {
			details.push([]);

			if (prev[i] === null) {
				details[i].push('');
				continue;
			}

			tmp = details[i];
			tmp.push(vertices[i]);
			t = prev[i];

			while ( t !== null) {
				tmp.push(t);
				t = prev[vertices.indexOf(t)];
			}
			
			details[i] = tmp.reverse();
		}
		
		props.dispatch(updateShortestPath(shortestPath, details));
	}

	render() {
		return (
			<div>
				<button className='uk-button uk-button-primary'
				>Dijkstra</button>
				<div uk-dropdown=''>
					<div className='action-button'
					uk-tooltip='title: Run Dijkstra; pos: bottom'
					onClick={ this.dijkstra.bind(this) }
					><i className='far fa-play-circle uk-margin-small-right'>
					</i> Run</div>
					<div className='action-button'
					uk-tooltip='title: Simulate Dijkstra; pos: bottom'
					onClick={ this.toggleSimulator.bind(this) }
					><i className='fas fa-film uk-margin-small-right'>
					</i> Simulate</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return {
		simulator: store.dijkstra.simulator,
		selectedVertices: store.actionPanel.selectedVertices,
		vertices: store.vertex.list,
		weights: store.edge.weights,
	}
}

export default connect(mapStateToProps)(DijkstraControl);