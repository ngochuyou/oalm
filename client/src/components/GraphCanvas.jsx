import React from 'react';

class GraphCanvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arcRadius: 25,
			fontSize: 18
		}
	}

	componentDidMount() {
		this.canvas = document.getElementById('canvas');

		if (!this.canvas) {
			return ;
		}
		
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

		this.canvas.width = maxX + 50;
		this.canvas.height = maxY + 50;
		c.fillStyle = "#FFF";
    	c.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.componentDidUpdate();
	}

	componentDidUpdate() {
		if (!this.canvas) {
			return;
		};
			
		const props = this.props;
		const c = this.canvas.getContext('2d');
		const vertices = props.vertices;
		const edges = props.edges;
		const state = this.state;
		const r = state.arcRadius;
		const fontSize = state.fontSize;

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

		if (props.onLoaded !== null) {
			if (typeof props.onLoaded === 'function') {
				this.canvas.toBlob((blob) => {
					props.onLoaded(blob);
				}, 'image/jpeg', 0.5);
			}
		}
	}

	render() {
		return (
			<div>
				<canvas id='canvas' className={ this.props.class }></canvas>
			</div>
		)
	}
}

export default GraphCanvas;