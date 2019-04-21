import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from './ErrorMessage.jsx';
import { updateForm, updateList, updateWeights } from '../actions/EdgeAction.jsx';
import { updateList as updateSelectedVertexList } from '../actions/ActionPanelAction.jsx';
import { updateList as updateVertexList, updateTree } from '../actions/VertexAction.jsx';
import { updatePreviousList, updateSimulator } from '../actions/DijkstraAction.jsx';
import { initSimulator } from '../reducers/DijkstraReducer.jsx';
import { ADD } from '../reducers/FormActions.jsx';
import BinaryTree from '../structures/BinaryTree.jsx';

class EdgeForm extends React.Component {
	componentDidMount() {
		this.openBtn = document.getElementById('edge-modal-open');
		this.closeBtn = document.getElementById('edge-modal-close');
	}

	onConnectVertexClick() {
		const props = this.props;

		if (props.selectedVertices.length < 2) {
			
			return ;
		}

		this.openBtn.click();

		const form = props.form;

		if (form.action !== ADD) {
			props.dispatch(updateForm({
				...form,
				action: ADD
			}));
		}
	}

	onWeightChange(e) {
		var value = e.target.value;
		var parsedValue = parseInt(value);
		const props = this.props;

		if (isNaN(parsedValue)) {
			if (value !== '-') {
				return ;
			}

			props.dispatch(updateForm({
				...props.form,
				weight: value
			}));

			return ;
		}

		props.dispatch(updateForm({
			...props.form,
			weight: parsedValue
		}));
	}

	validate(form) {
		var flag = true;

		if (form.weight !== null) {
			const weight = form.weight;

			if (weight === 0 || isNaN(weight)) {
				flag = false;
				form.msg = '*Edge weight must not be 0 and must be a numeric character.'
			} else {
				form.msg = '';
			}
		} else {
			flag = false;
			form.msg = '*Edge weight must not be 0 and must be a numeric character.'
		}

		return flag;
	}

	onKeyDown(e) {
		const props = this.props;
		var form = { ...props.form };

		if (e.keyCode === 13) {
			switch (form.action) {
				case ADD : {
					const closeUp = (index1, index2, weight) => {
						weights[index1][index2] = weight;
						weights[index2][index1] = weight;
						props.dispatch(updateList(list));

						selectedVertices.splice(0, 2);
						props.dispatch(updateSelectedVertexList('selectedVertices', selectedVertices));

						vertices[index1].selected = '';
						vertices[index2].selected = '';
						props.dispatch(updateVertexList(vertices));

						form.weight = 1;
						props.dispatch(updateForm(form));
						props.dispatch(updateWeights(weights));
					}

					var selectedVertices = [ ...props.selectedVertices ];

					if (selectedVertices.length < 2) {
						return ;
					}

					if (this.validate(form)) {
						var list = [ ...props.list ];
						const data1 = selectedVertices[0].vertex.data;
						const data2 = selectedVertices[1].vertex.data;
						var vertices = [ ...props.vertices ];
						var weights = [ ...props.weights ];
						const weight = form.weight;

						for (var edge of list) {
							if ((edge.i1 === data1 && edge.i2 === data2) || (edge.i1 === data2 && edge.i2 === data1)) {
								edge.weight = weight;
								closeUp(selectedVertices[0].index, selectedVertices[1].index, weight);

								return ;
							}
						}

						const x1 = selectedVertices[0].vertex.left;
						const y1 = selectedVertices[0].vertex.top;
						const x2 = selectedVertices[1].vertex.left;
						const y2 = selectedVertices[1].vertex.top;

						list.push({
							i1: data1,
							i2: data2,
							x1: x1,
							y1: y1,
							x2: x2,
							y2: y2,
							tx: (x1 + x2) / 2,
							ty: (y1 + y2) / 2,
							weight: form.weight
						});

						closeUp(selectedVertices[0].index, selectedVertices[1].index, weight);
						this.closeBtn.click();
					}

					return ;
				}
				default: return ;
			}
		}
	}

	onDisconnectVertexClick() {
		const props = this.props;

		if (props.selectedVertices.length < 2) {
			
			return ;
		}

		var selectedVertices = props.selectedVertices;
		const vertex1 = selectedVertices[0];
		const vertex2 = selectedVertices[1];
		const data1 = vertex1.vertex.data;
		const data2 = vertex2.vertex.data;
		var edges = [ ...props.list ];
		var pos = null;

		for (var i of edges.keys()) {
			if ((edges[i].i1 === data1 && edges[i].i2 === data2) || (edges[i].i1 === data2 && edges[i].i2 === data1)) {
				pos = i;
				break;
			}		
		}
		
		if (pos === null) {
			return ;
		}

		edges.splice(pos, 1);
		props.dispatch(updateList(edges));

		var weights = [ ...props.weights ];

		weights[vertex1.index][vertex2.index] = Infinity
		weights[vertex2.index][vertex1.index] = Infinity;
		props.dispatch(updateWeights(weights));
	}

	cleanUp() {
		const props = this.props;

		props.dispatch(updateSelectedVertexList('selectedVertices', []));
		props.dispatch(updateList([]));
		props.dispatch(updateWeights([]));
		props.dispatch(updateVertexList([]));
		props.dispatch(updatePreviousList([]));

		if (props.simulatorInterval !== null) {
			clearInterval(props.simulatorInterval);
		}

		props.dispatch(updateSimulator(initSimulator));
		props.dispatch(updateTree(new BinaryTree()))
	}

	render() {
		const form = this.props.form;

		return (
			<div>
				<div className='hidden'
				href='#edge-modal' uk-toggle=''
				id='edge-modal-open'></div>
				<div className='action-icon'
				uk-tooltip='title: Connect two vertices; pos: bottom'
				onClick={ this.onConnectVertexClick.bind(this) }
				><i className='fas fa-arrows-alt-h'>
				</i></div>
				<div className='action-icon action-icon-cross'
				uk-tooltip='title: Disconnect two vertices; pos: bottom'
				onClick={ this.onDisconnectVertexClick.bind(this) }
				><i className='fas fa-arrows-alt-h'>
				</i></div>
				<div className='action-icon'
				uk-tooltip='title: Clear everything; pos: bottom'
				onClick={ this.cleanUp.bind(this) }
				><i className='fas fa-broom'>
				</i></div>
				<div id='edge-modal' className='uk-flex-top'
				uk-modal=''>
					<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical'>
						<button className='uk-modal-close-default'
						type='button' uk-close=''
						id='edge-modal-close'></button>
						<div className='form-control'>
							<input id='weight-input' required='required'
							value={ form.weight }
							onKeyDown={ this.onKeyDown.bind(this) }
							onChange={ this.onWeightChange.bind(this) }
							name='weight' className='uk-input'/>
							<label forhtml='weight-input'>Weight</label>
							<ErrorMessage message={ form.msg } />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const edge = store.edge;

	return {
		form: edge.form,
		list: edge.list,
		weights: edge.weights,
		vertices: store.vertex.list,
		selectedVertices: store.actionPanel.selectedVertices,
		simulatorInterval: store.dijkstra.simulator.interval
	};
}

export default connect(mapStateToProps)(EdgeForm);