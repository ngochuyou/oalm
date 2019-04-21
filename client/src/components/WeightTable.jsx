import React from 'react';
import { connect } from 'react-redux';

class WeightTable extends React.Component {
	render() {
		const props = this.props;
		const vertices = props.vertices;
		const weights = props.weights;

		return (
			<div className='uk-margin uk-margin-top'>
				<h2 className='uk-heading-line'><span>Weights</span></h2>
				<div className='uk-overflow-auto custom-table'>
					<table cellSpacing='0'>
						<thead>
							<tr>
								<th>Vertices</th>
								{
									vertices.map((v, index) => {
										return <th key={ index }>
										{ v.data }</th>;
									})
								}
							</tr>
						</thead>
						<tbody>
							{
								weights.map((ws, index) => {
									return (
										<tr key={ index }>
											<td>{ vertices[index].data }</td>
											{
												ws.map((w, index) => {
													return <td key={ index }
													className={ w }>
													<span>{ w }</span></td>
												})
											}
										</tr>
									)
								})
							}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapsStateToProps = (store) => {
	return {
		weights: store.edge.weights,
		vertices: store.vertex.list
	}
}

export default connect(mapsStateToProps)(WeightTable);