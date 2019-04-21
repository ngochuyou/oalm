import React from 'react';
import { connect } from 'react-redux';
import ErrorMessage from './ErrorMessage.jsx';
import { updateForm, updateList, updateTree } from '../actions/VertexAction.jsx';
import { updateList as updateSelectedVertexList } from '../actions/ActionPanelAction.jsx';
import { updateList as updateEdgeList, updateWeights } from '../actions/EdgeAction.jsx';
import { updatePreviousList } from '../actions/DijkstraAction.jsx';
import { ADD, EDIT } from '../reducers/FormActions.jsx';

class VertexForm extends React.Component {
	componentDidMount() {
		this.openBtn = document.getElementById('vertex-modal-open');
		this.closeBtn = document.getElementById('vertex-modal-close');
	}

	onAddVertexClick() {
		this.openBtn.click();

		const props = this.props;

		if (props.form.action !== ADD) {
			props.dispatch(updateForm({
				...props.form,
				action: ADD
			}));
		}
	}

	onDataChange(e) {
		var value = e.target.value;
		var parsedValue = parseInt(value);

		if (!isNaN(parsedValue)) {
			value = parsedValue;
		}

		const props = this.props;

		props.dispatch(updateForm({
			...props.form,
			data: value
		}));
	}

	validate(form) {
		var result = true;

		if (form.data === null) {
			result = false;
			form.msg = '*Data must not be empty.';
		} else {
			if (form.data.length === 0) {
				result = false;
				form.msg = '*Data must not be empty.';
			} else {
				form.msg = '';
			}
		}

		return result;
	}

	onKeyDown(e) {
		if (e.keyCode === 13) {
			const props = this.props;
			var form = { ...props.form };
			const data = form.data;
			var tree = props.tree;

			switch(form.action) {
				case ADD: {
					if (this.validate(form)) {
						if (!tree.contains(data)) {
							tree.add(form.data);
							props.dispatch(updateList([
								...props.list, {
									data: form.data,
									top: 100,
									left: 100
								}
							]));

							var previous = [ ...props.previous ];

							previous.push([]);
							props.dispatch(updatePreviousList(previous));
							props.dispatch(updateTree(tree));

							var weights = [ ...props.weights ];

							weights.push([]);

							const length = weights.length;

							for (var i = 0; i < length - 1; i++) {
								weights[i].push(Infinity);
							}

							for (var j = 0; j < length; j++) {
								weights[length - 1].push(Infinity);
							}

							weights[length-1][length-1] = 0;
							props.dispatch(updateWeights(weights));

							form.msg = '';
							form.data = '';
						} else {
							form.msg = '*This data has already exsited in the graph.';
						}
					}

					props.dispatch(updateForm(form));

					return ;
				}
				case EDIT: {
					var selectedVertices = [ ...props.selectedVertices ];

					if (selectedVertices.length === 0) {
						return ;
					}

					if (this.validate(form)) {	
						const index = selectedVertices[0].index;
						var list = [ ...props.list ];
						
						if (tree.contains(list[index].data)) {
							if (!tree.contains(data)) {
								const vertex = list[index];
								const oldData = vertex.data;

								tree.remove(oldData);
								tree.add(data);
								props.dispatch(updateTree(tree));

								selectedVertices.splice(0, 1);
								props.dispatch(updateSelectedVertexList('selectedVertices', selectedVertices));

								var edges = [ ...props.edges ];

								for (var edge of edges) {
									if (edge.i1 === oldData) {
										edge.i1 = data;

										continue;
									}

									if (edge.i2 === oldData) {
										edge.i2 = data;
									}
								}

								props.dispatch(updateEdgeList(edges));

								vertex.data = data;
								vertex.selected = '';
								props.dispatch(updateList(list));

								form.msg = '';
								form.data = '';
							} else {
								form.msg = '*This data has already exsited in the tree graph.';
							}
						} else {
							form.msg = '*The data you are trying to edit does not exsit in the graph.';
						}
					}

					props.dispatch(updateForm(form));
					this.closeBtn.click();

					return ;
				}
				default: return ;
			}
		}
	}

	onEditVertexClick() {
		const props = this.props;

		if (props.selectedVertices.length === 0) {
			return ;
		}

		this.openBtn.click();

		if (props.form.action !== EDIT) {
			props.dispatch(updateForm({
				...props.form,
				action: EDIT
			}));
		}
	}

	onRemoveVertexClick() {
		const props = this.props;

		if (props.selectedVertices.length === 0) {
			return ;
		}
		
		var selectedVertices = props.selectedVertices;
		var list = [ ...props.list ];
		var tree = props.tree;
		var selectedIndexes = [];
		var selectedDatas = [];
		var index;
		var newEdges = [];
		var edges = props.edges;
		var weights = props.weights;
		var previous = [ ...props.previous ];

		for (const v of selectedVertices) {
			index = v.index;
			tree.remove(list[index].data);
			selectedIndexes.push(index);
			selectedDatas.push(v.vertex.data);
			previous.splice(0, 1);
		}

		props.dispatch(updatePreviousList(previous));

		var newList = [];

		for (var i of list.keys()) {
			if (selectedIndexes.indexOf(i) !== -1)	{
				continue;
			}

			newList.push(list[i]);
		}

		props.dispatch(updateList(newList));

		for (var edge of edges) {
			if ((selectedDatas.indexOf(edge.i1) !== -1) || (selectedDatas.indexOf(edge.i2) !== -1)) {

				continue;
			}

			newEdges.push(edge);
		}

		props.dispatch(updateEdgeList(newEdges));

		var newWeights = [];
		var length = 0;

		for (i of weights.keys()) {
			if (selectedIndexes.indexOf(i) !== -1) {
				continue;
			}

			newWeights.push([]);

			for (var j of weights[i].keys()) {
				if (selectedIndexes.indexOf(j) !== -1) {
					continue;
				}
				newWeights[length].push(weights[i][j]);
			}
			
			length += 1;
		}

		props.dispatch(updateWeights(newWeights));
		props.dispatch(updateTree(tree));
		props.dispatch(updateSelectedVertexList('selectedVertices', []));
	}

	render() {
		const form = this.props.form;

		return (
			<div>
				<div className='hidden'
				href='#vertex-modal' uk-toggle=''
				id='vertex-modal-open'></div>
				<div className='action-icon'
				uk-tooltip='title: Add a Vertex; pos: bottom'
				onClick={ this.onAddVertexClick.bind(this) }
				><i className='fas fa-plus'>
				</i></div>
				<div className='action-icon'
				uk-tooltip='title: Edit a Vertex; pos: bottom'
				onClick={ this.onEditVertexClick.bind(this) }
				><i className='fas fa-pen'></i></div>
				<div className='action-icon'
				uk-tooltip='title: Remove Vertex; pos: bottom'
				onClick={ this.onRemoveVertexClick.bind(this) }
				><i className='fas fa-eraser'></i></div>
				<div id='vertex-modal' className='uk-flex-top'
				uk-modal=''>
					<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical'>
						<button className='uk-modal-close-default'
						type='button' uk-close=''
						id='vertex-modal-close'></button>
						<div className='form-control'>
							<input id='data-input' required='required'
							value={ form.data }
							onKeyDown={ this.onKeyDown.bind(this) }
							onChange={ this.onDataChange.bind(this) }
							name='data' className='uk-input'/>
							<label forhtml='data-input'>Data</label>
							<ErrorMessage message={ form.msg } />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	const vertex = store.vertex;
	const edge = store.edge;

	return {
		form: vertex.form,
		list: vertex.list,
		tree: vertex.tree,
		selectedVertices: store.actionPanel.selectedVertices,
		edges: edge.list,
		weights: edge.weights,
		previous: store.dijkstra.previous
	}
}

export default connect(mapStateToProps)(VertexForm);