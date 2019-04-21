class Tree {
	constructor(data) {
		if (data === undefined) {
			data = 0;
		}
		this.data = data;
		this.children = [];
	}

	push(data, nodeNumber) {
		if (this.data === nodeNumber) {
			this.children = [ ...this.children, new Tree(data) ];

			return this;
		}

		for (var child of this.children) {
			child = child.push(data, nodeNumber);
		}

		return this;
	}

	contains(data) {
		var result = false;
		const inner = (obj) => {
			if (obj.data === data) {
				result = true;
			}

			obj.children.forEach((child) => {
				inner(child);
			})
		};
		
		inner(this);
		
		return result;
	}
}

export default Tree;