/**
 * Recursion Algorithms
 * Tree traversal implementations with call stack visualization
 */

/**
 * Preorder Traversal (Root -> Left -> Right)
 * @param {Object} root - Tree root node
 * @returns {Array} Array of animation steps
 */
export function preorderTraversal(root) {
    const steps = [];
    const callStack = [];
    
    steps.push({
        type: 'init',
        description: 'Starting Preorder Traversal: Root → Left → Right'
    });
    
    function traverse(node, depth = 0) {
        if (!node) {
            steps.push({
                type: 'null-node',
                callStack: [...callStack],
                depth: depth,
                description: 'Reached null node. Returning.'
            });
            return;
        }
        
        callStack.push(`preorder(${node.value})`);
        
        // Visit root
        steps.push({
            type: 'visit',
            node: node,
            phase: 'root',
            callStack: [...callStack],
            depth: depth,
            description: `Visiting node ${node.value} (Root phase).`
        });
        
        // Traverse left
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'left',
            callStack: [...callStack],
            description: `Recursing left from node ${node.value}.`
        });
        traverse(node.left, depth + 1);
        
        // Traverse right
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'right',
            callStack: [...callStack],
            description: `Recursing right from node ${node.value}.`
        });
        traverse(node.right, depth + 1);
        
        callStack.pop();
        
        steps.push({
            type: 'return',
            node: node,
            callStack: [...callStack],
            description: `Returning from node ${node.value}.`
        });
    }
    
    traverse(root);
    
    steps.push({
        type: 'complete',
        description: 'Preorder Traversal complete!'
    });
    
    return steps;
}

/**
 * Inorder Traversal (Left -> Root -> Right)
 * @param {Object} root - Tree root node
 * @returns {Array} Array of animation steps
 */
export function inorderTraversal(root) {
    const steps = [];
    const callStack = [];
    
    steps.push({
        type: 'init',
        description: 'Starting Inorder Traversal: Left → Root → Right'
    });
    
    function traverse(node, depth = 0) {
        if (!node) {
            steps.push({
                type: 'null-node',
                callStack: [...callStack],
                depth: depth,
                description: 'Reached null node. Returning.'
            });
            return;
        }
        
        callStack.push(`inorder(${node.value})`);
        
        // Traverse left
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'left',
            callStack: [...callStack],
            description: `Recursing left from node ${node.value}.`
        });
        traverse(node.left, depth + 1);
        
        // Visit root
        steps.push({
            type: 'visit',
            node: node,
            phase: 'root',
            callStack: [...callStack],
            depth: depth,
            description: `Visiting node ${node.value} (Root phase).`
        });
        
        // Traverse right
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'right',
            callStack: [...callStack],
            description: `Recursing right from node ${node.value}.`
        });
        traverse(node.right, depth + 1);
        
        callStack.pop();
        
        steps.push({
            type: 'return',
            node: node,
            callStack: [...callStack],
            description: `Returning from node ${node.value}.`
        });
    }
    
    traverse(root);
    
    steps.push({
        type: 'complete',
        description: 'Inorder Traversal complete! (Values in sorted order for BST)'
    });
    
    return steps;
}

/**
 * Postorder Traversal (Left -> Right -> Root)
 * @param {Object} root - Tree root node
 * @returns {Array} Array of animation steps
 */
export function postorderTraversal(root) {
    const steps = [];
    const callStack = [];
    
    steps.push({
        type: 'init',
        description: 'Starting Postorder Traversal: Left → Right → Root'
    });
    
    function traverse(node, depth = 0) {
        if (!node) {
            steps.push({
                type: 'null-node',
                callStack: [...callStack],
                depth: depth,
                description: 'Reached null node. Returning.'
            });
            return;
        }
        
        callStack.push(`postorder(${node.value})`);
        
        // Traverse left
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'left',
            callStack: [...callStack],
            description: `Recursing left from node ${node.value}.`
        });
        traverse(node.left, depth + 1);
        
        // Traverse right
        steps.push({
            type: 'recurse',
            node: node,
            direction: 'right',
            callStack: [...callStack],
            description: `Recursing right from node ${node.value}.`
        });
        traverse(node.right, depth + 1);
        
        // Visit root
        steps.push({
            type: 'visit',
            node: node,
            phase: 'root',
            callStack: [...callStack],
            depth: depth,
            description: `Visiting node ${node.value} (Root phase - after children).`
        });
        
        callStack.pop();
        
        steps.push({
            type: 'return',
            node: node,
            callStack: [...callStack],
            description: `Returning from node ${node.value}.`
        });
    }
    
    traverse(root);
    
    steps.push({
        type: 'complete',
        description: 'Postorder Traversal complete! (Useful for tree deletion)'
    });
    
    return steps;
}
