import React from 'react';
import { connect } from 'react-redux';
import { updateList } from '../actions/ActionPanelAction.jsx';
import { updateList as updateVertexList } from '../actions/VertexAction.jsx';
import { updateList as updateEdgeList } from '../actions/EdgeAction.jsx';
import { updateSimulator } from '../actions/DijkstraAction.jsx';

class Panel extends React.Component {
	onVertexClicked(index, vertex) {
		const props = this.props;
		var simulator = { ...props.simulator };

		if (simulator.interval !== null) {
			return ;
		}

		var selectedVertices = [ ...props.selectedVertices ];
		var list = [ ...props.list ];

		for (const i of selectedVertices.keys()) {
			if (selectedVertices[i].index === index) {
				list[index].selected = '';
				selectedVertices.splice(i, 1);

				props.dispatch(updateVertexList(list));
				props.dispatch(updateList('selectedVertices', selectedVertices));

				return ;
			}
		}

		list[index].selected = 'selected';
		selectedVertices.push({
			index: index,
			vertex: vertex
		});

		props.dispatch(updateVertexList(list));
		props.dispatch(updateList('selectedVertices', selectedVertices));

		if (simulator.on) {
			props.dispatch(updateSimulator({
				...simulator,
				stepType: 'initial'
			}));
		}
	}

	onDragEnd(index, event) {
		const props = this.props;
		var list = [ ...props.list ];
		const rect = event.currentTarget.parentNode.getBoundingClientRect();
		const panelX = window.scrollX + rect.left;
		const panelY = window.scrollY + rect.top;
		const top = event.pageY - panelY;
		const left = event.pageX - panelX;
		const vertex = list[index];
		
		vertex.top = top;
		vertex.left = left;
		props.dispatch(updateVertexList(list));

		var edges = [ ...props.edges ];
		const data = vertex.data;

		for (var e of edges) {
			if (e.i1 === data || e.i2 === data) {
				if (e.i1 === data) {
					e.x1 = left;
					e.y1 = top;
				} else {
					e.x2 = left;
					e.y2 = top;
				}
				e.tx = (e.x1 + e.x2) / 2;
				e.ty = (e.y1 + e.y2) / 2;
			}
		}

		props.dispatch(updateEdgeList(edges));
	}

	onKeyDown(e) {
		if (e.keyCode === 27 && !this.props.simulator.on) {
			const props = this.props;
			var vertices = [ ...props.list];

			for (var v of vertices) {
				v.selected = '';
			}

			props.dispatch(updateVertexList(vertices));
			props.dispatch(updateList('selectedVertices', []));

			var edges = [ ...props.edges ];

			for (e of edges) {
				e.selected = '';
			}
		}
	}

	onDragStart(e) {
		e.dataTransfer.setData('mozilla', 'make-draggable');
	}

	render() {
		const props = this.props;
		const list = props.list;
		const edges = props.edges;

		return (
			<div className='panel' tabIndex='1'
			id='panel' onKeyDown={ this.onKeyDown.bind(this) }>
				{
					list.map((v, index) => {
						return (
							<div className={ 'node ' + v.selected } key={ index }
							draggable='true'
							onDragStart={ this.onDragStart.bind(this) }
							onDragEnd={ this.onDragEnd.bind(this, index) }
							style={{ top: v.top, left: v.left }}
							onClick={ this.onVertexClicked.bind(this, index, v) }>
							{ v.data }</div>
						);
					})
				}
				<svg>
				{
					edges.map((e, index) => {
						return (
							<line key={ index } x1={ e.x1 } x2={ e.x2 }
							y1={ e.y1 } y2={ e.y2 }
							className={ e.selected }></line>
						);
					})
				}
				{
					edges.map((e, index) => {
						return (
							<text key={ index } x={ e.tx } y={ e.ty }
							>{ e.weight }</text>
						);
					})
				}
				</svg>
			</div>
		);
	}
}

const mapStateToProps = (store) => {

	return {
		list: store.vertex.list,
		selectedVertices: store.actionPanel.selectedVertices,
		edges: store.edge.list,
		simulator: store.dijkstra.simulator
	};
}

export default connect(mapStateToProps)(Panel);