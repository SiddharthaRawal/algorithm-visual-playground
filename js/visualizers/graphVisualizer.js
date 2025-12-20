/**
 * Graph Visualizer
 * Renders graph traversal on grid
 */

import { COLORS, GRID_CONFIG } from '../utils/constants.js';

export class GraphVisualizer {
    constructor(gridContainer) {
        this.container = gridContainer;
        this.rows = GRID_CONFIG.ROWS;
        this.cols = GRID_CONFIG.COLS;
        this.nodes = new Map();
        this.startNode = null;
    }
    
    /**
     * Initialize grid
     * @param {Object} start - Start node {row, col}
     */
    initialize(start) {
        this.startNode = start;
        this.container.innerHTML = '';
        this.nodes.clear();
        
        // Set grid template
        this.container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.container.classList.remove('hidden');
        
        // Create nodes
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.createNode(row, col);
                this.container.appendChild(node);
                this.nodes.set(`${row},${col}`, node);
            }
        }
        
        // Mark start node
        if (start) {
            const startKey = `${start.row},${start.col}`;
            const startNodeEl = this.nodes.get(startKey);
            if (startNodeEl) {
                startNodeEl.classList.add('start');
            }
        }
    }
    
    /**
     * Create grid node element
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {HTMLElement} Node element
     */
    createNode(row, col) {
        const node = document.createElement('div');
        node.className = 'grid-node';
        node.dataset.row = row;
        node.dataset.col = col;
        return node;
    }
    
    /**
     * Render current step
     * @param {Object} step - Animation step
     */
    render(step) {
        if (!step) return;
        
        // Reset all nodes except start
        this.nodes.forEach((node, key) => {
            if (!node.classList.contains('start')) {
                node.classList.remove('visited', 'frontier', 'current');
            }
        });
        
        // Mark visited nodes
        if (step.visited) {
            step.visited.forEach(key => {
                const node = this.nodes.get(key);
                if (node && !node.classList.contains('start')) {
                    node.classList.add('visited');
                }
            });
        }
        
        // Mark current node
        if (step.current) {
            const currentKey = `${step.current.row},${step.current.col}`;
            const currentNode = this.nodes.get(currentKey);
            if (currentNode && !currentNode.classList.contains('start')) {
                currentNode.classList.add('current');
            }
        }
        
        // Mark discovered neighbor
        if (step.neighbor) {
            const neighborKey = `${step.neighbor.row},${step.neighbor.col}`;
            const neighborNode = this.nodes.get(neighborKey);
            if (neighborNode && !neighborNode.classList.contains('start')) {
                neighborNode.classList.add('frontier');
            }
        }
    }
    
    /**
     * Clear visualization
     */
    clear() {
        this.container.innerHTML = '';
        this.nodes.clear();
    }
}
