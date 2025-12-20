/**
 * Pathfinding Visualizer
 * Renders pathfinding algorithms on grid with walls
 */

import { COLORS, GRID_CONFIG } from '../utils/constants.js';

export class PathVisualizer {
    constructor(gridContainer) {
        this.container = gridContainer;
        this.rows = GRID_CONFIG.ROWS;
        this.cols = GRID_CONFIG.COLS;
        this.nodes = new Map();
        this.walls = new Set();
        this.startNode = null;
        this.endNode = null;
        this.isDrawing = false;
    }
    
    /**
     * Initialize grid with start and end
     * @param {Object} start - Start node {row, col}
     * @param {Object} end - End node {row, col}
     */
    initialize(start, end) {
        this.startNode = start;
        this.endNode = end;
        this.walls.clear();
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
        
        // Mark start and end
        this.markSpecialNodes();
        
        // Add random walls
        this.generateRandomWalls(0.2);
        
        // Setup wall drawing
        this.setupWallDrawing();
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
     * Mark start and end nodes
     */
    markSpecialNodes() {
        if (this.startNode) {
            const startKey = `${this.startNode.row},${this.startNode.col}`;
            const startEl = this.nodes.get(startKey);
            if (startEl) startEl.classList.add('start');
        }
        
        if (this.endNode) {
            const endKey = `${this.endNode.row},${this.endNode.col}`;
            const endEl = this.nodes.get(endKey);
            if (endEl) endEl.classList.add('end');
        }
    }
    
    /**
     * Generate random walls
     * @param {number} density - Wall density (0-1)
     */
    generateRandomWalls(density) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const key = `${row},${col}`;
                const startKey = `${this.startNode.row},${this.startNode.col}`;
                const endKey = `${this.endNode.row},${this.endNode.col}`;
                
                if (key !== startKey && key !== endKey && Math.random() < density) {
                    this.walls.add(key);
                    const node = this.nodes.get(key);
                    if (node) node.classList.add('wall');
                }
            }
        }
    }
    
    /**
     * Setup wall drawing interaction
     */
    setupWallDrawing() {
        this.container.addEventListener('mousedown', () => {
            this.isDrawing = true;
        });
        
        this.container.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
        
        this.nodes.forEach((node, key) => {
            node.addEventListener('mouseenter', () => {
                if (this.isDrawing && !node.classList.contains('start') && !node.classList.contains('end')) {
                    this.toggleWall(key, node);
                }
            });
            
            node.addEventListener('click', () => {
                if (!node.classList.contains('start') && !node.classList.contains('end')) {
                    this.toggleWall(key, node);
                }
            });
        });
    }
    
    /**
     * Toggle wall state
     * @param {string} key - Node key
     * @param {HTMLElement} node - Node element
     */
    toggleWall(key, node) {
        if (this.walls.has(key)) {
            this.walls.delete(key);
            node.classList.remove('wall');
        } else {
            this.walls.add(key);
            node.classList.add('wall');
        }
    }
    
    /**
     * Render current step
     * @param {Object} step - Animation step
     */
    render(step) {
        if (!step) return;
        
        // Reset all nodes except start, end, walls
        this.nodes.forEach((node, key) => {
            if (!node.classList.contains('start') && 
                !node.classList.contains('end') && 
                !node.classList.contains('wall')) {
                node.classList.remove('visited', 'frontier', 'current', 'path');
            }
        });
        
        // Mark visited nodes
        if (step.visited) {
            step.visited.forEach(key => {
                const node = this.nodes.get(key);
                if (node && !node.classList.contains('start') && !node.classList.contains('end')) {
                    node.classList.add('visited');
                }
            });
        }
        
        // Mark current node
        if (step.current) {
            const currentKey = `${step.current.row},${step.current.col}`;
            const currentNode = this.nodes.get(currentKey);
            if (currentNode) {
                currentNode.classList.add('current');
            }
        }
        
        // Mark neighbor being explored
        if (step.neighbor) {
            const neighborKey = `${step.neighbor.row},${step.neighbor.col}`;
            const neighborNode = this.nodes.get(neighborKey);
            if (neighborNode) {
                neighborNode.classList.add('frontier');
            }
        }
        
        // Mark final path
        if (step.path) {
            step.path.forEach(node => {
                const key = `${node.row},${node.col}`;
                const pathNode = this.nodes.get(key);
                if (pathNode && !pathNode.classList.contains('start') && !pathNode.classList.contains('end')) {
                    pathNode.classList.add('path');
                }
            });
        }
    }
    
    /**
     * Get walls set
     * @returns {Set} Set of wall positions
     */
    getWalls() {
        return this.walls;
    }
    
    /**
     * Clear visualization
     */
    clear() {
        this.container.innerHTML = '';
        this.nodes.clear();
        this.walls.clear();
    }
}
