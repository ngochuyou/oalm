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
		this.canvas = document.getElementById('canvas');
	}	

	// canvas init
	clearCanvas() {
		if (!this.canvas) {
			return ;
		}
		
		// find the maximum size of graph
		var maxY = 0, maxX = 0;
		const vertices = this.props.vertices;

		for (var v of vertices) {
			if (v.top > maxY) {
				maxY = v.top;
			}

			if (v.left > maxX) {
				maxX = v.left;
			}
		}

		const c = this.canvas.getContext('2d');

		// set canvas's size
		this.canvas.width = maxX + 50;
		this.canvas.height = maxY + 50;
		c.fillStyle = "#FFF";
    	c.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawCanvas() {
		if (!this.canvas) {
			return;
		};

		this.clearCanvas();

		const props = this.props;
		const c = this.canvas.getContext('2d');
		const vertices = props.vertices;
		const edges = props.edges;
		// radius and font size
		const r = 25;
		const fontSize = 18;

		for (var e of edges) {
			c.beginPath();
			c.lineWidth = '2';
			c.strokeStyle = 'black';
		    c.moveTo(e.x1, e.y1);
		    c.lineTo(e.x2, e.y2);
		    c.stroke();
		}

		for (var v of vertices) {
			c.fillStyle = '#ce7b5b';
			c.beginPath();
			c.arc(v.left, v.top, r, 0, 2 * Math.PI);
			c.fill();
			c.font = fontSize + 'px Arial';
			c.fillStyle = 'white';
			c.fillText(v.data, v.left - 5, v.top + 7);
		}
	}

	load(graph) {
		this.props.dispatch(load(graph));
	}

	loadGraphs() {
		const props = this.props;

		props.dispatch(loadGraphs(props.principal));
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

	save() {
		// draw graph on canvas
		this.drawCanvas();
		// capture graph image, returned value is in blob type
		this.canvas.toBlob(async (blob) => {
			const props = this.props;
			// save
			const res = await save(props.principal, [ ...props.vertices ], [ ...props.edges ], {
				...props.graphInfo,
				img: blob
			});

			if (res) {
				if (res.json) {
					props.dispatch(updateGraphInfo({
						...props.graphInfo,
						img: res.json.img,
						msg: res.json.msg
					}));
				}
			}
		}, 'image/jpeg', 0.5);
	}

	new() {
		// cannot reuse this.save() since toBlob() returns void
		this.drawCanvas();
		this.canvas.toBlob(async (blob) => {
			const props = this.props;
			// save
			const res = await save(props.principal, [ ...props.vertices ], [ ...props.edges ], {
				...props.graphInfo,
				img: blob
			});

			if (res) {
				if (res.json) {
					// load empty graph to panel and update init info
					props.dispatch(load({
						vertices: [],
						edges: [],
						_id: null,
						img: '',
						msg: res.json.msg,
						name: 'untitled'
					}));
				}
			}
		}, 'image/jpeg', 0.5);
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
				<div className='action-icon'
				uk-tooltip='title: New graph; pos: bottom'
				onClick={ this.new.bind(this) }
				><i className='far fa-file'>
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
										<div className='uk-text-center'>
											<img src={ g.img } uk-img='' alt=''
											className='img-fit'/>
										</div>
										<div>
											<p className='uk-text-primary uk-text-bold'>{ g.name }</p>
											<p className='uk-text-meta'>{ fromLongTime(g.createdDate) }</p>
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
				<canvas id='canvas' className='hidden'></canvas>
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