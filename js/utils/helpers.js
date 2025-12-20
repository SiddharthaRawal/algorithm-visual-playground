/**
 * Utility Helper Functions
 * Pure functions for common operations
 */

/**
 * Generate random array of specified size
 * @param {number} size - Array length
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number[]} Random array
 */
export function generateRandomArray(size, min = 10, max = 500) {
    return Array.from({ length: size }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * Create delay for animation timing
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Resolves after delay
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Map speed slider value to milliseconds
 * Inverse relationship: higher speed = lower delay
 * @param {number} speedValue - Slider value (1-100)
 * @returns {number} Delay in milliseconds
 */
export function speedToDelay(speedValue) {
    // Map 1-100 to 1000ms-10ms (logarithmic scale for better UX)
    return Math.floor(1000 / speedValue);
}

/**
 * Swap two elements in array
 * @param {Array} arr - Array to modify
 * @param {number} i - First index
 * @param {number} j - Second index
 */
export function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * Calculate Manhattan distance (for A* heuristic)
 * @param {Object} nodeA - {row, col}
 * @param {Object} nodeB - {row, col}
 * @returns {number} Manhattan distance
 */
export function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

/**
 * Calculate Euclidean distance
 * @param {Object} nodeA - {row, col}
 * @param {Object} nodeB - {row, col}
 * @returns {number} Euclidean distance
 */
export function euclideanDistance(nodeA, nodeB) {
    return Math.sqrt(
        Math.pow(nodeA.row - nodeB.row, 2) + 
        Math.pow(nodeA.col - nodeB.col, 2)
    );
}

/**
 * Get node neighbors in grid (4-directional)
 * @param {number} row - Current row
 * @param {number} col - Current column
 * @param {number} rows - Total rows
 * @param {number} cols - Total columns
 * @returns {Array} Array of {row, col} neighbors
 */
export function getNeighbors(row, col, rows, cols) {
    const neighbors = [];
    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];
    
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            neighbors.push({ row: newRow, col: newCol });
        }
    }
    
    return neighbors;
}

/**
 * Generate binary tree structure
 * @param {number} maxDepth - Maximum depth of tree
 * @returns {Object} Tree root node
 */
export function generateBinaryTree(maxDepth = 4) {
    let nodeId = 1;
    
    function createNode(depth) {
        if (depth > maxDepth) return null;
        
        return {
            id: nodeId++,
            value: nodeId - 1,
            left: createNode(depth + 1),
            right: createNode(depth + 1)
        };
    }
    
    return createNode(1);
}

/**
 * Calculate tree node positions for visualization
 * @param {Object} root - Tree root
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {Map} Map of node.id -> {x, y}
 */
export function calculateTreePositions(root, canvasWidth, canvasHeight) {
    const positions = new Map();
    const verticalGap = 80;
    
    function traverse(node, x, y, horizontalGap) {
        if (!node) return;
        
        positions.set(node.id, { x, y });
        
        if (node.left) {
            traverse(node.left, x - horizontalGap, y + verticalGap, horizontalGap / 2);
        }
        
        if (node.right) {
            traverse(node.right, x + horizontalGap, y + verticalGap, horizontalGap / 2);
        }
    }
    
    traverse(root, canvasWidth / 2, 50, canvasWidth / 4);
    return positions;
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Format complexity notation with proper styling
 * @param {string} complexity - Complexity string (e.g., "O(n log n)")
 * @returns {string} Formatted HTML
 */
export function formatComplexity(complexity) {
    return complexity
        .replace(/O\(/g, '<span class="complexity-o">O(</span>')
        .replace(/\)/g, '<span class="complexity-paren">)</span>');
}

/**
 * Reconstruct path from parent map (for pathfinding)
 * @param {Map} parentMap - Map of node -> parent node
 * @param {Object} start - Start node
 * @param {Object} end - End node
 * @returns {Array} Path from start to end
 */
export function reconstructPath(parentMap, start, end) {
    const path = [];
    let current = end;
    
    while (current) {
        path.unshift(current);
        const key = `${current.row},${current.col}`;
        current = parentMap.get(key);
        
        if (current && current.row === start.row && current.col === start.col) {
            path.unshift(start);
            break;
        }
    }
    
    return path;
}

/**
 * Priority Queue implementation for pathfinding algorithms
 */
export class PriorityQueue {
    constructor() {
        this.values = [];
    }
    
    enqueue(element, priority) {
        this.values.push({ element, priority });
        this.sort();
    }
    
    dequeue() {
        return this.values.shift();
    }
    
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
    
    isEmpty() {
        return this.values.length === 0;
    }
}

/**
 * Queue implementation for BFS
 */
export class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        return this.items.shift();
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}
