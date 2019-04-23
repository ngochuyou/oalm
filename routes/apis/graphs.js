const router = require('express').Router();
const auth = require('../../middleware/auth.js');
const upload = require('../../middleware/upload.js');

const Graph = require('../../models/Graph.js');
const User = require('../../models/User.js');
const auditor = require('../../models/auditors/graph-auditor.js');

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
					name: req.body.name,
					img: req.body.img
				});
			} else {
				graph = new Graph({
					vertices: translation.vertices,
					edges: translation.edges,
					uId: user.id,
					_id: oGraph.id,
					name: req.body.name,
					img: req.body.img
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
						img: graph.img,
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