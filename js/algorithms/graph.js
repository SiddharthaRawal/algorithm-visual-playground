/**
 * Graph Traversal Algorithms
 * BFS and DFS implementations for grid-based graphs
 */

import { Queue, getNeighbors } from '../utils/helpers.js';

/**
 * Breadth-First Search
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {Object} start - Start position {row, col}
 * @param {Set} walls - Set of wall positions as "row,col"
 * @returns {Array} Array of animation steps
 */
export function bfs(rows, cols, start, walls = new Set()) {
    const steps = [];
    const visited = new Set();
    const queue = new Queue();
    
    queue.enqueue(start);
    visited.add(`${start.row},${start.col}`);
    
    steps.push({
        type: 'init',
        current: start,
        visited: new Set(visited),
        description: `Starting BFS from (${start.row}, ${start.col}). Using queue for level-order traversal.`
    });
    
    while (!queue.isEmpty()) {
        const current = queue.dequeue();
        
        steps.push({
            type: 'visit',
            current: current,
            visited: new Set(visited),
            description: `Visiting node (${current.row}, ${current.col}). Checking neighbors.`
        });
        
        const neighbors = getNeighbors(current.row, current.col, rows, cols);
        
        for (const neighbor of neighbors) {
            const key = `${neighbor.row},${neighbor.col}`;
            
            if (!visited.has(key) && !walls.has(key)) {
                visited.add(key);
                queue.enqueue(neighbor);
                
                steps.push({
                    type: 'discover',
                    current: current,
                    neighbor: neighbor,
                    visited: new Set(visited),
                    queueSize: queue.size(),
                    description: `Discovered neighbor (${neighbor.row}, ${neighbor.col}). Added to queue.`
                });
            }
        }
    }
    
    steps.push({
        type: 'complete',
        visited: new Set(visited),
        description: `BFS complete! Visited ${visited.size} nodes in level order.`
    });
    
    return steps;
}

/**
 * Depth-First Search
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {Object} start - Start position {row, col}
 * @param {Set} walls - Set of wall positions as "row,col"
 * @returns {Array} Array of animation steps
 */
export function dfs(rows, cols, start, walls = new Set()) {
    const steps = [];
    const visited = new Set();
    
    steps.push({
        type: 'init',
        current: start,
        visited: new Set(visited),
        description: `Starting DFS from (${start.row}, ${start.col}). Exploring depth-first.`
    });
    
    function dfsHelper(node, depth = 0) {
        const key = `${node.row},${node.col}`;
        
        if (visited.has(key) || walls.has(key)) return;
        
        visited.add(key);
        
        steps.push({
            type: 'visit',
            current: node,
            visited: new Set(visited),
            depth: depth,
            description: `Visiting node (${node.row}, ${node.col}) at depth ${depth}.`
        });
        
        const neighbors = getNeighbors(node.row, node.col, rows, cols);
        
        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            
            if (!visited.has(neighborKey) && !walls.has(neighborKey)) {
                steps.push({
                    type: 'discover',
                    current: node,
                    neighbor: neighbor,
                    visited: new Set(visited),
                    depth: depth + 1,
                    description: `Exploring neighbor (${neighbor.row}, ${neighbor.col}) recursively.`
                });
                
                dfsHelper(neighbor, depth + 1);
                
                steps.push({
                    type: 'backtrack',
                    current: neighbor,
                    parent: node,
                    visited: new Set(visited),
                    description: `Backtracking from (${neighbor.row}, ${neighbor.col}) to (${node.row}, ${node.col}).`
                });
            }
        }
    }
    
    dfsHelper(start);
    
    steps.push({
        type: 'complete',
        visited: new Set(visited),
        description: `DFS complete! Explored ${visited.size} nodes depth-first.`
    });
    
    return steps;
}
