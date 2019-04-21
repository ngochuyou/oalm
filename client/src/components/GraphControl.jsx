import React from 'react';
import {
	load, save, loadGraphs,
	deleteGraph, updateGraphInfo, updateForm
} from '../actions/GraphAction.jsx';
import { connect } from 'react-redux';
import { fromLongTime } from '../structures/DateTimeFormatter.js';

class SaveLoadControl extends React.Component {
	componentDidMount() {
		this.graphLoadCloseBtn = document.getElementById('graph-load-control-close');
		this.graphDeleteCloseBtn = document.getElementById('graph-delete-control-close');
	}

	load(graph) {
		this.props.dispatch(load(graph));
	}

	loadGraphs() {
		const props = this.props;

		props.dispatch(loadGraphs(props.principal));
	}

	save() {
		const props = this.props;
		const graphInfo = props.graphInfo;

		props.dispatch(save({ ...props.principal }, [ ...props.vertices ], [ ...props.edges ], { ...graphInfo }));
	}

	onGraphNameChange(e) {
		this.props.dispatch(updateGraphInfo({
			...this.props.graphInfo,
			name: e.target.value
		}));
	}

	delete(g) {
		const props = this.props;

		props.dispatch(updateForm({
			...props.form,
			target: g,
			name: ''
		}));
	}

	onChange(e) {
		const props = this.props;
		var value = e.target.value;

		props.dispatch(updateForm({
			...props.form,
			name: value
		}));

		const target = props.form.target;

		if (value === target.name) {
			props.dispatch(deleteGraph(props.principal, { ...props.graphInfo }, target._id, () => {
				this.graphLoadCloseBtn.click();
				this.graphDeleteCloseBtn.click();
			}));
		}
	}

	render() {
		const props = this.props;
		const graphs = props.graphs;

		return (
			<div>
				<div className='action'>
					<input name='name' className='uk-input'
					onChange={ this.onGraphNameChange.bind(this) }
					value={ props.graphInfo.name }/>
				</div>
				<div className='action-icon'
				uk-tooltip='title: Save graph; pos: bottom'
				onClick={ this.save.bind(this) }
				><i className='fas fa-save'>
				</i></div>
				<div className='action-icon'
				uk-tooltip='title: My graphs; pos: bottom'
				href='#graph-load-control' uk-toggle=''
				onClick={ this.loadGraphs.bind(this) }
				><i className='fas fa-folder-open'>
				</i></div>
				<div id='graph-load-control' className='uk-flex-top' uk-modal=''>
					<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-xxlarge'
					uk-overflow-auto=''>
						<button className='uk-modal-close-default'
						id='graph-load-control-close'
						type='button' uk-close=''></button>
						<h2 className='uk-heading-line uk-text-center'>
						<span>My Graphs</span></h2>
						{
							graphs.map((g, index) => {
								return (
									<div className='uk-card uk-card-default uk-child-width-1-3@s uk-margin uk-grid-collapse uk-padding'
									key={ index } uk-grid=''>
										<div>
											<span className='uk-text-primary uk-text-bold'>{ g.name }</span>
										</div>
										<div>
											<span className='uk-text-meta'>{ fromLongTime(g.createdDate) }</span>
										</div>
										<div className='uk-text-right'>
											<div className='uk-button uk-button-text uk-margin-right'
											href='#graph-delete-control' uk-toggle=''
											onClick={ this.delete.bind(this, g) }
											>Delete</div>
											<div className='uk-button uk-button-text'
											onClick={ this.load.bind(this, g) }
											>Load</div>	
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
				<div id='graph-delete-control' className='uk-flex-top' uk-modal=''>
					<div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical'
					uk-overflow-auto=''>
						<button className='uk-modal-close-default'
						id='graph-delete-control-close'
						type='button' uk-close=''></button>
						<h2 className='uk-heading-line uk-text-center'>
						Confirm action</h2>
						<p className='uk-text-meta'>
						Enter graph name</p>
						<div className='form-control'>
							<input id='graph-delete-confirm' required='required'
							value={ props.form.name }
							onChange={ this.onChange.bind(this) }
							name='data' className='uk-input'/>
							<label forhtml='graph-delete-confirm'>Graph name</label>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	const graph = store.graph;

	return {
		principal: store.auth.principal,
		vertices: store.vertex.list,
		edges: store.edge.list,
		graphInfo: graph.graphInfo,
		graphs: graph.graphs,
		form: graph.form
	}
}

export default connect(mapStateToProps)(SaveLoadControl);