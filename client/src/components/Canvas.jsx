import React from 'react';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arcRadius: 25,
			fontSize: 18,
			vertices: [
				{
					data: 0,
					top: 100,
					left: 100
				},
				{
					data: 1,
					top: 200,
					left: 200
				},
			]
		}
	}

	componentDidMount() {
		this.canvas = document.getElementById('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.cvLeft = this.canvas.offsetLeft;
		this.cvTop = this.canvas.offsetTop;
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		if (!this.canvas) return ;

		const c = this.canvas.getContext('2d');
		const vertices = this.state.vertices;
		const state = this.state;
		const r = state.arcRadius;
		const fontSize = state.fontSize;

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

	click(e) {
		this.setState({
			src: this.canvas.toDataURL('image/png')
		})
	}

	render() {
		return (
			<div>
				<canvas id='canvas' onClick={ this.click.bind(this) }>
				</canvas>
				<img src={ this.state.src }/>
			</div>
		)
	}
}

export default Canvas;