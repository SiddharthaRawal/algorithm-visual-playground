/**
 * Pathfinding Algorithms
 * Dijkstra and A* implementations
 */

import { PriorityQueue, getNeighbors, manhattanDistance, reconstructPath } from '../utils/helpers.js';

/**
 * Dijkstra's Algorithm
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {Object} start - Start position {row, col}
 * @param {Object} end - End position {row, col}
 * @param {Set} walls - Set of wall positions
 * @returns {Array} Array of animation steps
 */
export function dijkstra(rows, cols, start, end, walls = new Set()) {
    const steps = [];
    const distances = new Map();
    const previous = new Map();
    const visited = new Set();
    const pq = new PriorityQueue();
    
    // Initialize
    const startKey = `${start.row},${start.col}`;
    distances.set(startKey, 0);
    pq.enqueue(start, 0);
    
    steps.push({
        type: 'init',
        start: start,
        end: end,
        description: `Starting Dijkstra's Algorithm from (${start.row}, ${start.col}) to (${end.row}, ${end.col}).`
    });
    
    while (!pq.isEmpty()) {
        const { element: current, priority: currentDist } = pq.dequeue();
        const currentKey = `${current.row},${current.col}`;
        
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        
        steps.push({
            type: 'visit',
            current: current,
            distance: currentDist,
            visited: new Set(visited),
            description: `Visiting (${current.row}, ${current.col}) with distance ${currentDist}.`
        });
        
        // Found destination
        if (current.row === end.row && current.col === end.col) {
            const path = reconstructPath(previous, start, end);
            
            steps.push({
                type: 'path-found',
                path: path,
                distance: currentDist,
                visited: new Set(visited),
                description: `Shortest path found! Distance: ${currentDist}, Path length: ${path.length}`
            });
            
            return steps;
        }
        
        const neighbors = getNeighbors(current.row, current.col, rows, cols);
        
        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            
            if (walls.has(neighborKey) || visited.has(neighborKey)) continue;
            
            const newDist = currentDist + 1; // Assuming uniform edge weight
            const oldDist = distances.get(neighborKey) ?? Infinity;
            
            if (newDist < oldDist) {
                distances.set(neighborKey, newDist);
                previous.set(neighborKey, current);
                pq.enqueue(neighbor, newDist);
                
                steps.push({
                    type: 'update',
                    current: current,
                    neighbor: neighbor,
                    distance: newDist,
                    visited: new Set(visited),
                    description: `Updated distance to (${neighbor.row}, ${neighbor.col}): ${newDist}`
                });
            }
        }
    }
    
    steps.push({
        type: 'no-path',
        visited: new Set(visited),
        description: 'No path exists from start to end.'
    });
    
    return steps;
}

/**
 * A* Algorithm
 * @param {number} rows - Grid rows
 * @param {number} cols - Grid columns
 * @param {Object} start - Start position {row, col}
 * @param {Object} end - End position {row, col}
 * @param {Set} walls - Set of wall positions
 * @returns {Array} Array of animation steps
 */
export function aStar(rows, cols, start, end, walls = new Set()) {
    const steps = [];
    const gScore = new Map(); // Cost from start
    const fScore = new Map(); // gScore + heuristic
    const previous = new Map();
    const visited = new Set();
    const openSet = new PriorityQueue();
    
    const startKey = `${start.row},${start.col}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, manhattanDistance(start, end));
    openSet.enqueue(start, fScore.get(startKey));
    
    steps.push({
        type: 'init',
        start: start,
        end: end,
        heuristic: manhattanDistance(start, end),
        description: `Starting A* from (${start.row}, ${start.col}) to (${end.row}, ${end.col}). Using Manhattan distance heuristic.`
    });
    
    while (!openSet.isEmpty()) {
        const { element: current } = openSet.dequeue();
        const currentKey = `${current.row},${current.col}`;
        
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        
        const g = gScore.get(currentKey);
        const h = manhattanDistance(current, end);
        const f = g + h;
        
        steps.push({
            type: 'visit',
            current: current,
            gScore: g,
            hScore: h,
            fScore: f,
            visited: new Set(visited),
            description: `Visiting (${current.row}, ${current.col}). g=${g}, h=${h}, f=${f}`
        });
        
        // Found destination
        if (current.row === end.row && current.col === end.col) {
            const path = reconstructPath(previous, start, end);
            
            steps.push({
                type: 'path-found',
                path: path,
                distance: g,
                visited: new Set(visited),
                description: `Optimal path found! Cost: ${g}, Path length: ${path.length}`
            });
            
            return steps;
        }
        
        const neighbors = getNeighbors(current.row, current.col, rows, cols);
        
        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.row},${neighbor.col}`;
            
            if (walls.has(neighborKey) || visited.has(neighborKey)) continue;
            
            const tentativeG = g + 1;
            const oldG = gScore.get(neighborKey) ?? Infinity;
            
            if (tentativeG < oldG) {
                gScore.set(neighborKey, tentativeG);
                const h = manhattanDistance(neighbor, end);
                const f = tentativeG + h;
                fScore.set(neighborKey, f);
                previous.set(neighborKey, current);
                openSet.enqueue(neighbor, f);
                
                steps.push({
                    type: 'update',
                    current: current,
                    neighbor: neighbor,
                    gScore: tentativeG,
                    hScore: h,
                    fScore: f,
                    visited: new Set(visited),
                    description: `Updated (${neighbor.row}, ${neighbor.col}): g=${tentativeG}, h=${h}, f=${f}`
                });
            }
        }
    }
    
    steps.push({
        type: 'no-path',
        visited: new Set(visited),
        description: 'No path exists from start to end.'
    });
    
    return steps;
}
