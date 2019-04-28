import React from 'react';
import { connect } from 'react-redux';
import { updateList } from '../actions/VertexAction.jsx';
import { updateSimulator } from '../actions/DijkstraAction.jsx';
import { updateList as updateEdgeList } from '../actions/EdgeAction.jsx';

class DijkstraPanel extends React.Component {
	constructor() {
		super();
		this.state = {
			duration: 1
		}
	}

	componentDidMount() {
		this.panel = document.getElementById('panel');
	}

	close() {
		const props = this.props;
		const simulator = props.simulator;

		clearInterval(props.simulator.interval);

		props.dispatch(updateSimulator({
			...simulator,
			className: 'fadeOut',
			interval: null
		}));

		setTimeout(() => {
			props.dispatch(updateSimulator({
				...simulator,
				interval: null,
				on: false
			}));
		}, 150);
	}

	simulate() {
		const props = this.props;
		var simulator = { ...props.simulator };
		var vertexList = [ ...props.vertices ];
		const vertices = vertexList.map((v) => { return v.data });
		const weights = props.weights;
		var edges = [ ...props.edges ];

		switch(simulator.stepType) {
			case 'initial' : {
				if (props.selectedVertices.length === 0) {
					return ;
				}

				var start = props.selectedVertices[0].index;
				var shortestPath = [];
				var unvisited = [];
				var prev = [];

				for (var i of vertices.keys()) {
					if (i === start) {
						shortestPath.push(0);
					} else {
						shortestPath.push(Infinity);
					}

					prev.push('');
					unvisited.push(vertices[i]);
				}

				simulator.start = start;
				simulator.shortestPath = shortestPath;
				simulator.unvisited = unvisited;
				simulator.prev = prev;
				simulator.visited = [];
				simulator.stepType = 'outer-loop-before';
				simulator.msg = "Let's start by initializing the shortest path table with all the distances to all the vertices.\n" + 
				"\tThe distance from the vertex " + vertices[start] + " to itself is 0, every other vertices is Infinity.\n" +
				"\tUnvisited vertices and Visited vertices array so we can track down which vertex is visited and which hasn't.\n" +
				"\tThe 'Previous' column will let us know the path that leads from vertex " + vertices[start] + " to every other vertices.\n" +
				"\tNext step: Find the minimum value in the distances array and start the algorithm from that vertex.\n";
				props.dispatch(updateSimulator(simulator));

				for (var v of vertexList) {
					v.selected = '';
				}

				for (var e of edges) {
					e.selected = '';
				}

				vertexList[start].selected = 'selected';
				props.dispatch(updateList(vertexList));
				props.dispatch(updateEdgeList(edges));

				return ;
			}
			case 'outer-loop-before' : {
				unvisited = simulator.unvisited;
				var min = Infinity;
				var pos = null;
				var tmp;
				const shortestPath = simulator.shortestPath;

				for (i of unvisited) {
					tmp = vertices.indexOf(i);
					if (shortestPath[tmp] < min) {
						min = shortestPath[tmp];
						pos = tmp;
					}
				}

				simulator.start = pos;
				simulator.msg = "The minimum value in the distances array is: " + shortestPath[pos] + " so we will continue from this one.\n";
				simulator.stepType = 'inner-loop';

				props.dispatch(updateSimulator(simulator));

				return ;
			}
			case 'inner-loop' : {
				var s, c;
				var visited = [ ...simulator.visited ];
				
				const I = Infinity;
				const start = simulator.start;
				const oldShortestPath = simulator.shortestPath;

				unvisited = [ ...simulator.unvisited ];
				tmp = weights[start];
				shortestPath = [ ...simulator.shortestPath ];
				prev = [ ...simulator.prev ];

				var neighbors = [];

				for (i of tmp.keys()) {
					if (tmp[i] !== I && tmp[i] !== 0 && visited.indexOf(vertices[i]) === -1) {
						s = shortestPath[i];
						c = shortestPath[start] + tmp[i];
						neighbors.push({
							i: i,
							s: s,
							c: c
						});

						if (c < s) {
							shortestPath[i] = c;
							prev[i] = vertices[start];
						}
					}
				}

				for (e of edges) {
					e.selected = '';
				}

				simulator.shortestPath = shortestPath;
				simulator.prev = prev;
				simulator.msg = "We will now find the neighbor vertices of the vertex " + vertices[start] + ". " +
				"If the distances from the vertex " + vertices[start] + " plus the weight(cost) to these neighbor vertices is lesser than their current value (in the shortest path table) we will update those distances.\n" + 
				"In this case: " + (neighbors.length !== 0 ? neighbors.map((n) => {
					vertexList[n.i].selected = 'neighbors';

					for (e of edges) {
						if ('' + e.i1 + e.i2 === '' + vertices[start] + vertices[n.i] || '' + e.i2 + e.i1 === '' + vertices[start] + vertices[n.i]) {
							e.selected = 'selected-line';
							break;
						}
					}

					return "\n Current cost of " + vertices[n.i] + " is " + n.s + " and the cost calculated is " + oldShortestPath[start] + " + " + tmp[n.i]  + " = " + n.c + ".";
				}) : "\tThere are no neighbors.\n" );

				simulator.msg += "\n\tThis is called the 'RELAXATION' process, we will also write the vertex " + vertices[start] + " into the Previous table if the RELAXATION process was done to it's neighbors.\n" + 
				"\tBefore finshing this step, we will push the current vertex into the Visited array so we can be aware that we have already visited this vertex and won't be visiting it anymore.\n" +
				"\tAt the end of this step, we will get the result like above.\n" + 
				"\tThis process will be continued until the next minimum value of the shortest path table can not be found (only Infinity values left or the Unvisited array in empty).\n";
				simulator.stepType = 'outer-loop-after';
				visited.push(vertices[start]);
				unvisited.splice(unvisited.indexOf(vertices[start]), 1);
				simulator.visited = visited;
				simulator.unvisited = unvisited;

				props.dispatch(updateSimulator(simulator));
				props.dispatch(updateList(vertexList));
				props.dispatch(updateEdgeList(edges));

				return ;
			}
			case 'outer-loop-after' : {
				unvisited = simulator.unvisited;
				min = Infinity;
				pos = null;

				const shortestPath = simulator.shortestPath;

				for (i of unvisited) {
					tmp = vertices.indexOf(i);
					
					if (shortestPath[tmp] < min) {
						min = shortestPath[tmp];
						pos = tmp;
					}
				}

				if (pos === null) {
					simulator.start = null;
					simulator.stepType = 'initial';
					simulator.msg = 'As you can see in the shortest path table, the next minimum value can not be found, so this will be the final step of the Algorithm.\n' +
					'\tIf your graph contains any vertices that are not connected to any other vertices, you will see that despite there are still some unvisited vertices, ' +
					'the algorithm can not be applied on these vertices because it can not find it\'s next minimum value in the shortest path table due to their disconnections.\n';
				} else {
					simulator.start = pos;
					simulator.stepType = 'inner-loop';

					for (v of vertexList) {
						v.selected = '';
					}

					vertexList[pos].selected = 'selected';
					simulator.msg = 'Continue finding minimum value of the shortest path table we have the value ' + shortestPath[pos] +
					' and we will continue the process.\n' +
					'Of course we will not be checking the values of the vertices that are visited anymore, this way only will we be able to find the next minimum value.\n';
					props.dispatch(updateList(vertexList));
				}

				props.dispatch(updateSimulator(simulator));

				return ;
			}
			default : break;
		}
	}

	autoPlay() {
		const props = this.props;
		const simulator = props.simulator;

		if (props.selectedVertices.length === 0 || simulator.interval !== null) {
			return ;
		}

		props.dispatch(updateSimulator({
			...simulator,
			interval: setInterval(() => {
				this.simulate();
			}, simulator.duration * 1000)
		}));
	}

	pause() {
		const props = this.props;

		clearInterval(props.simulator.interval);

		props.dispatch(updateSimulator({
			...props.simulator,
			interval: null
		}));
	}

	onChange(e) {
		this.setState({
			duration: e.target.value
		});
	}

	setDuration() {
		const props = this.props;

		props.dispatch(updateSimulator({
			...props.simulator,
			duration: this.state.duration
		}));
	}

	highlight(index) {
		const rect = this.panel.getBoundingClientRect();

		window.scrollTo(rect.top + window.scrollY, rect.left + window.scrollX);

		const props = this.props;
		const selectedPrevious = props.previous[index];
		var newSelectedList = [];
		var vertices = [...props.vertices];
		var verticesData = [];
		var t;
		var selectedPreviousInPairs = [];

		for (var v of vertices) {
			v.selected = '';
			verticesData.push(v.data);
		}

		var lastIndex = selectedPrevious.length - 1;

		for (var i of selectedPrevious.keys()) {
			t = verticesData.indexOf(selectedPrevious[i]);

			if (t === -1) {
				return ;
			}

			vertices[t].selected = 'selected';
			newSelectedList.push({
				index: t,
				vertex: vertices[t]
			});

			if (i === lastIndex) {
				continue;
			}

			selectedPreviousInPairs.push('' + selectedPrevious[i] + selectedPrevious[i + 1]);
		}

		var edges = [ ...props.edges ];

		for (var e of edges) {
			e.selected = '';
			if (selectedPreviousInPairs.indexOf('' + e.i1 + e.i2) !== -1 || selectedPreviousInPairs.indexOf('' + e.i2 + e.i1) !== -1) {
				e.selected = 'selected-line';
			}
		}

		props.dispatch(updateEdgeList(edges));
	}

	render() {
		const props = this.props;
		const vertices = props.vertices;
		const shortestPath = props.shortestPath;
		const previous = props.previous;
		var dijkstraSimulator = null;

		if (props.simulator.on) {
			const simulator = props.simulator;

			dijkstraSimulator = (
				<div className= { 'dijkstra-simulator action-panel ' + simulator.className}>
					<button uk-close=''
					className='uk-position-top-right uk-position-small'
					onClick={ this.close.bind(this) }></button>
					<div className='control'>
						<div className='action-icon'
						uk-tooltip='title: Next step; pos: bottom'
						onClick={ this.simulate.bind(this) }
						><i className='fas fa-step-forward'>
						</i></div>
						<div className='action-icon'
						uk-tooltip='title: Auto play; pos: bottom'
						onClick={ this.autoPlay.bind(this) }
						><i className='fas fa-play'>
						</i></div>
						<div className='action-icon'
						uk-tooltip='title: Pause; pos: bottom'
						onClick={ this.pause.bind(this) }
						><i className='fas fa-pause'>
						</i></div>
						<div><input id='playback-speed' className='uk-input' type='number'
						onChange={ this.onChange.bind(this) }
						value={ this.state.duration }/></div>
						{
							simulator.interval === null ? (
								<div><button className='uk-button uk-button-default'
								uk-tooltip='title: Set step duration(s); pos: bottom'
								onClick={ this.setDuration.bind(this) }>Set</button></div>
							) :
							null
						}
					</div>
					<div className='path-track'>
						<table className='uk-table uk-table-hover uk-table-divider custom-table-a'>
							<thead>
								<tr>
									<th className='uk-table-shrink'>Vertices</th>
									<th>Shortest Path</th>
									<th className='uk-table-expand'>Previous</th>
								</tr>
							</thead>
							<tbody>
							{
								vertices.map((v, index) => {
									const simshortestPath = simulator.shortestPath;

									return (
										<tr key={ index} 
										className={ simulator.visited.indexOf(v.data) }>
											<td>
											{ v.data }</td>
											<td className={ simshortestPath[index] }>
											<span>{ simshortestPath[index] }
											</span></td>
											<td>{ simulator.prev[index] }</td>
										</tr>
									);
								})
							}
							</tbody>
						</table>
					</div>
					<div className='visit-track'>
						<div>
							<div className='uk-text-meta'>Unvisited</div>
							{
								simulator.unvisited.map((u, index) => {
									return u + ' ';
								})
							}
						</div>
						<div>
							<div className='uk-text-meta'>Visited</div>
							{
								simulator.visited.map((v, index) => {
									return v + ' ';
								})
							}	
						</div>
					</div>
					<div className='console'>
						{ simulator.msg }
					</div>
				</div>
			)
		}

		return (
			<div className='uk-margin uk-margin-top'>
				<hr className='uk-divider-icon'></hr>
				<div className='flow-auto'
				style={{ maxHeight: '500px'}}>
					<table className='uk-table uk-table-hover uk-table-divider custom-table-a'>
						<thead>
							<tr>
								<th className='uk-table-shrink'>Vertices</th>
								<th>Shortest Distance</th>
								<th className='uk-table-expand'>Paths</th>
							</tr>
						</thead>
						<tbody>
						{
							vertices.map((v, index) => {
								return (
									<tr key={ index}
									onClick={ this.highlight.bind(this, index) }>
										<td>{ v.data }</td>
										<td className={ shortestPath[index] }>
										<span>{ shortestPath[index] }
										</span></td>
										<td>
											{
												previous[index].map((p) => {
													return (p + '\t');
												})
											}
										</td>
									</tr>
								);
							})
						}
						</tbody>
					</table>
				</div>
				{ dijkstraSimulator }
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const dijkstra = store.dijkstra;
	const edge = store.edge;

	return {
		shortestPath: dijkstra.shortestPath,
		previous: dijkstra.previous,
		vertices: store.vertex.list,
		simulator: dijkstra.simulator,
		weights: edge.weights,
		edges: edge.list,
		selectedVertices: store.actionPanel.selectedVertices
	}
}

export default connect(mapStateToProps)(DijkstraPanel);