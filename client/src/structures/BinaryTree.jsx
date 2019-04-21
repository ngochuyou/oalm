class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}

class BinaryTree {
	constructor() {
		this.root = null;
	}

	add(data) {
		const node = this.root;

		if (node === null) {
			this.root = new Node(data);
		} else {
			const inner = (node) => {
				if (data === node.data) {

					return ;
				}

				if (data < node.data) {
					if (node.left === null) {
						node.left = new Node(data);
					} else {
						inner(node.left, data);
					}
				} else {
					if (node.right === null) {
						node.right = new Node(data);
					} else {
						inner(node.right, data);
					}
				}
			}

			inner(node);
		}
	}

	display() {
		const inner = (node) => {
			if (node === null) {
				return;
			}
			
			inner(node.left);
			console.log(node.data);
			inner(node.right);
		}

		inner(this.root);
	}

	findMin(_root) {
		if (_root === null) {
			return null;
		}

		var node = _root;

		while(node.left !== null) {
			node = node.left;
		}

		return node.data;
	}

	remove(data) {
		const removeNode = (node, data) => {
			if (node === null) {
				return null;
			}

			if (data === node.data) {
				if (node.left === null && node.right === null) {
					return null;
				}

				if (node.left === null) {
					return node.right;
				}

				if (node.right === null) {
					return node.left;
				}

				var tempNode = node.right;

				while(tempNode.left !== null) {
					console.log('finding left');
					tempNode = tempNode.left;
				}

				node.data = tempNode.data;
				node.right = removeNode(node.right, tempNode.data);

				return node;
			} else {
				if (data < node.data) {
					node.left = removeNode(node.left, data);

					return node;
				} else {
					node.right = removeNode(node.right, data);

					return node;
				}
			}
		}

		this.root = removeNode(this.root, data);
	}

	contains(data) {
		var result = false;
		const search = (node) => {
			if (node === null) {

				return ;
			}

			if (data === node.data) {
				result = true;

				return ;
			} else {
				if (data < node.data) {
					if (node.left !== null) {
						search(node.left);
					}
				} else {
					if (node.right !== null) {
						search(node.right);
					}
				}
			}
		}
		
		search(this.root);

		return result;
	}
}

export default BinaryTree;