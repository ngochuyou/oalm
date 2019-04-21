const express = require('express');
const router = express.Router();

const Graph = require('../../models/Graph.js');
const User = require('../../models/User.js');

const auth = require('../../middleware/auth.js');

const auditor = {
	translate: (vertices, edges, name) => {
		if (!vertices || !edges) {

			return null;
		}

		var translatedVertices = [];
		var translatedEdges = [];

		for (var v of vertices) {
			translatedVertices.push({
				data: v.data,
				top: v.top,
				left: v.left
			});
		}

		for (var e of edges) {
			translatedEdges.push({
				v1: e.v1,
				v2: e.v2,
				tx: e.tx,
				ty: e.ty,
				weight: e.weight
			});
		}

		return {
			vertices: translatedVertices,
			edges: translatedEdges
		}
	},
	auditArrays: (graph) => {
		// audit amount
		const vertices = graph.vertices;
		const edges = graph.edges;

		if (!vertices || !edges) {
			return false;
		}
		
		var verticesData = [];

		for (var v of vertices) {
			if (v.data === undefined || v.top  === undefined || v.left === undefined) {
				
				return false;
			}
			
			if (verticesData.indexOf(v.data) !== -1) {
				return false;
			}

			verticesData.push(v.data);
		}

		var v1, v2, i1, i2, vertex, d1, d2;
		var edgesInPairs = [];

		for (var e of edges) {
			v1 = e.v1;
			v2 = e.v2;

			if (!v1 || !v2) {
				return false;
			}
			
			if ((d1 = v1.data) === undefined || (d2 = v2.data) === undefined || v1.top === undefined || v2.top === undefined || v1.left === undefined || v2.left === undefined || e.tx === undefined || e.ty === undefined || e.weight === undefined) {
				return false;
			}

			if (edgesInPairs.indexOf('' + d1 + d2) !== -1 || edgesInPairs.indexOf('' + d2 + d1) !== -1) {
				return false;
			}

			if ((i1 = verticesData.indexOf(d1)) === -1 || (i2 = verticesData.indexOf(d2)) === -1) {
				return false;
			} else {
				v = vertices[i1];

				if (v.top !== v1.top || v.left !== v1.left) {
					return false;
				}

				v = vertices[i2];

				if (v.top !== v2.top || v.left !== v2.left) {
					return false;
				}
			}

			edgesInPairs.push('' + d1 + d2);
		}
		
		return true;
	}
}

// @route GET api/graphs
// @desc GET all graphs of specific user
// @access Private

router.get('/', auth, (req, res) => {
	User.findById(req.user.id)
		.then(user => {
			if (!user) {
				return res.status(400).json({ msg: 'Invalid user.' })
			}

			Graph.find({ uId: req.user.id })
				.select('-uId')
				.then(list => {
					return res.status(200).json(list)
				});
		})
});

// @route POST api/graphs
// @desc POST a graph
// @access Private

router.post('/', auth, async (req, res) => {
	User.findById(req.user.id)
		.then(async function(user) {
			if (!user) {
				return res.status(400).json({ msg: 'Invalid user.' })
			}

			var oGraph = null;
			
			if (req.body.id !== null) {
				oGraph = await Graph.findById(req.body.id)
					.then(graph => {
						return graph;
					})
			}

			if (oGraph === null) {
				const count = await Graph.countDocuments({ uId: req.user.id })
					.then(c => { return c });

				if (count >= 3) {
					return res.status(400).json({ msg: 'Maximum amount of graphs reached. '});
				}
			}
			
			const translation = auditor.translate(req.body.vertices, req.body.edges);

			if (translation === null) {
				return res.status(400).json({ msg: 'Invalid graph datas.' })
			}

			var graph;

			if (oGraph === null) {
				graph = new Graph({
					vertices: translation.vertices,
					edges: translation.edges,
					uId: user.id,
					name: req.body.name
				});
			} else {
				graph = new Graph({
					vertices: translation.vertices,
					edges: translation.edges,
					uId: user.id,
					_id: oGraph.id,
					name: req.body.name
				});
			}

			if (!auditor.auditArrays(graph)) {
				return res.status(400).json({ msg: 'Invalid graph datas.' })
			}

			const query = { _id: graph.id };
			const options = { upsert: true, new: true, setDefaultsOnInsert: true };

			Graph.findOneAndUpdate(query, graph, options)
				.then(graph => {
					return res.status(200).json({
						vertices: graph.vertices,
						edges: graph.edges,
						createdDate: graph.createdDate,
						name: graph.name,
						msg: 'Saved ' + graph.name
					})	
				});
		})
});

// @route DELETE api/graphs
// @desc DELETE a graph
// @access Private

router.delete('/', auth, (req, res) => {
	const id = req.body.id;

	if (!id) {
		return res.status(400).json({ msg: 'Bad request.' });
	}

	Graph.findById(id)
		.then(graph => {
			if (graph === null) {
				return res.status(404).json({ msg: 'Graph not found.' })
			}

			var uId = req.user.id;
			
			if (uId !== graph.uId.toString()) {
				return res.status(400).json({ msg: 'You don\'t have permission to make changes to this graph.' })
			}

			Graph.findByIdAndRemove(graph.id, (err, graph) => {

				return res.status(200).json({ msg: 'Removed graph ' + graph.name });
			});
		})
});

module.exports = router;