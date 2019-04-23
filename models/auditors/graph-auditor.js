module.exports = {
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