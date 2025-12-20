/**
 * Main Application Entry Point
 * Orchestrates all components and handles application lifecycle
 */

import { UIController } from './controllers/uiController.js';
import { AnimationController } from './controllers/animationController.js';
import { SortVisualizer } from './visualizers/sortVisualizer.js';
import { GraphVisualizer } from './visualizers/graphVisualizer.js';
import { PathVisualizer } from './visualizers/pathVisualizer.js';
import { TreeVisualizer } from './visualizers/treeVisualizer.js';
import { bubbleSort, insertionSort, mergeSort } from './algorithms/sorting.js';
import { bfs, dfs } from './algorithms/graph.js';
import { dijkstra, aStar } from './algorithms/pathfinding.js';
import { preorderTraversal, inorderTraversal, postorderTraversal } from './algorithms/recursion.js';
import { generateRandomArray, generateBinaryTree } from './utils/helpers.js';
import { GRID_CONFIG } from './utils/constants.js';

/**
 * Main Application Class
 */
class AlgorithmPlayground {
    constructor() {
        // Initialize controllers
        this.ui = new UIController();
        this.animation = new AnimationController();
        
        // Initialize visualizers
        this.sortVisualizer = new SortVisualizer(this.ui.elements.canvas);
        this.graphVisualizer = new GraphVisualizer(this.ui.elements.gridContainer);
        this.pathVisualizer = new PathVisualizer(this.ui.elements.gridContainer);
        this.treeVisualizer = new TreeVisualizer(this.ui.elements.canvas);
        
        // State
        this.currentCategory = 'sorting';
        this.currentAlgorithm = 'bubble-sort';
        this.currentData = null;
        this.currentVisualizer = null;
        
        // Setup
        this.setupEventListeners();
        this.initializeApp();
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Category buttons
        this.ui.elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleCategoryChange(btn.dataset.category);
            });
        });
        
        // Algorithm selection
        this.ui.elements.algorithmSelect.addEventListener('change', () => {
            this.handleAlgorithmChange();
        });
        
        // Data size slider
        this.ui.elements.dataSize.addEventListener('input', (e) => {
            this.ui.updateSizeDisplay(e.target.value);
        });
        
        this.ui.elements.dataSize.addEventListener('change', () => {
            this.initializeAlgorithm();
        });
        
        // Speed slider
        this.ui.elements.speedSlider.addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.ui.updateSpeedDisplay(speed);
            this.animation.setSpeed(speed);
        });
        
        // Control buttons
        this.ui.elements.btnPlay.addEventListener('click', () => {
            this.handlePlay();
        });
        
        this.ui.elements.btnPause.addEventListener('click', () => {
            this.handlePause();
        });
        
        this.ui.elements.btnStep.addEventListener('click', () => {
            this.handleStep();
        });
        
        this.ui.elements.btnReset.addEventListener('click', () => {
            this.handleReset();
        });
        
        // Animation step callback
        this.animation.onStepChange = (step, index) => {
            this.handleStepChange(step, index);
        };
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * Initialize application
     */
    initializeApp() {
        this.ui.updateAlgorithmInfo(this.currentAlgorithm);
        this.ui.setActiveCategory(this.currentCategory);
        this.ui.filterAlgorithmsByCategory(this.currentCategory);
        this.ui.updateSizeDisplay(this.ui.getDataSize());
        this.ui.updateSpeedDisplay(this.ui.getSpeed());
        this.animation.setSpeed(this.ui.getSpeed());
        
        this.initializeAlgorithm();
    }
    
    /**
     * Handle category change
     * @param {string} category - New category
     */
    handleCategoryChange(category) {
        this.currentCategory = category;
        this.ui.setActiveCategory(category);
        this.ui.filterAlgorithmsByCategory(category);
        this.handleAlgorithmChange();
    }
    
    /**
     * Handle algorithm change
     */
    handleAlgorithmChange() {
        this.currentAlgorithm = this.ui.getCurrentAlgorithm();
        this.ui.updateAlgorithmInfo(this.currentAlgorithm);
        this.initializeAlgorithm();
    }
    
    /**
     * Initialize algorithm with fresh data
     */
    initializeAlgorithm() {
        this.animation.stop();
        
        const size = this.ui.getDataSize();
        const category = this.getCategoryForAlgorithm(this.currentAlgorithm);
        
        // Generate appropriate data
        switch (category) {
            case 'sorting':
                this.initializeSorting(size);
                break;
            case 'graph':
                this.initializeGraph();
                break;
            case 'pathfinding':
                this.initializePathfinding();
                break;
            case 'recursion':
                this.initializeRecursion();
                break;
        }
        
        this.updateControlButtonStates();
    }
    
    /**
     * Initialize sorting visualization
     * @param {number} size - Array size
     */
    initializeSorting(size) {
        this.ui.showCanvas();
        this.currentData = generateRandomArray(size);
        this.currentVisualizer = this.sortVisualizer;
        this.sortVisualizer.setArray(this.currentData);
        
        // Generate steps
        let steps = [];
        switch (this.currentAlgorithm) {
            case 'bubble-sort':
                steps = bubbleSort(this.currentData);
                break;
            case 'insertion-sort':
                steps = insertionSort(this.currentData);
                break;
            case 'merge-sort':
                steps = mergeSort(this.currentData);
                break;
        }
        
        this.animation.loadSteps(steps);
        this.renderCurrentStep();
    }
    
    /**
     * Initialize graph visualization
     */
    initializeGraph() {
        this.ui.showGrid();
        const start = { row: 10, col: 20 };
        this.currentVisualizer = this.graphVisualizer;
        this.graphVisualizer.initialize(start);
        
        // Generate steps
        let steps = [];
        switch (this.currentAlgorithm) {
            case 'bfs':
                steps = bfs(GRID_CONFIG.ROWS, GRID_CONFIG.COLS, start);
                break;
            case 'dfs':
                steps = dfs(GRID_CONFIG.ROWS, GRID_CONFIG.COLS, start);
                break;
        }
        
        this.animation.loadSteps(steps);
        this.renderCurrentStep();
    }
    
    /**
     * Initialize pathfinding visualization
     */
    initializePathfinding() {
        this.ui.showGrid();
        const start = { row: 10, col: 5 };
        const end = { row: 10, col: 35 };
        this.currentVisualizer = this.pathVisualizer;
        this.pathVisualizer.initialize(start, end);
        
        // Generate steps
        const walls = this.pathVisualizer.getWalls();
        let steps = [];
        switch (this.currentAlgorithm) {
            case 'dijkstra':
                steps = dijkstra(GRID_CONFIG.ROWS, GRID_CONFIG.COLS, start, end, walls);
                break;
            case 'astar':
                steps = aStar(GRID_CONFIG.ROWS, GRID_CONFIG.COLS, start, end, walls);
                break;
        }
        
        this.animation.loadSteps(steps);
        this.renderCurrentStep();
    }
    
    /**
     * Initialize recursion visualization
     */
    initializeRecursion() {
        this.ui.showCanvas();
        const tree = generateBinaryTree(4);
        this.currentVisualizer = this.treeVisualizer;
        this.treeVisualizer.initialize(tree);
        
        // Generate steps
        let steps = [];
        switch (this.currentAlgorithm) {
            case 'tree-preorder':
                steps = preorderTraversal(tree);
                break;
            case 'tree-inorder':
                steps = inorderTraversal(tree);
                break;
            case 'tree-postorder':
                steps = postorderTraversal(tree);
                break;
        }
        
        this.animation.loadSteps(steps);
        this.renderCurrentStep();
    }
    
    /**
     * Handle play button
     */
    async handlePlay() {
        if (this.animation.isPaused) {
            this.animation.resume();
        } else {
            await this.animation.play();
        }
        this.updateControlButtonStates();
    }
    
    /**
     * Handle pause button
     */
    handlePause() {
        if (this.animation.isPlaying && !this.animation.isPaused) {
            this.animation.pause();
        } else {
            this.animation.resume();
        }
        this.updateControlButtonStates();
    }
    
    /**
     * Handle step button
     */
    handleStep() {
        this.animation.stepForward();
        this.updateControlButtonStates();
    }
    
    /**
     * Handle reset button
     */
    handleReset() {
        this.animation.reset();
        this.updateControlButtonStates();
    }
    
    /**
     * Handle step change during animation
     * @param {Object} step - Current step
     * @param {number} index - Step index
     */
    handleStepChange(step, index) {
        this.renderCurrentStep();
        this.updateControlButtonStates();
    }
    
    /**
     * Render current animation step
     */
    renderCurrentStep() {
        const step = this.animation.getCurrentStep();
        if (!step) return;
        
        // Update visualization
        if (this.currentVisualizer) {
            this.currentVisualizer.render(step);
        }
        
        // Update step explanation
        this.ui.updateStepExplanation(step.description || 'Processing...');
    }
    
    /**
     * Update control button states
     */
    updateControlButtonStates() {
        this.ui.updateControlButtons({
            isPlaying: this.animation.isPlaying,
            isPaused: this.animation.isPaused,
            canStep: !this.animation.isAtEnd(),
            canReset: true
        });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        if (this.currentVisualizer === this.sortVisualizer) {
            this.sortVisualizer.resize();
            this.renderCurrentStep();
        } else if (this.currentVisualizer === this.treeVisualizer) {
            this.treeVisualizer.resize();
            this.renderCurrentStep();
        }
    }
    
    /**
     * Get category for algorithm
     * @param {string} algorithmId - Algorithm ID
     * @returns {string} Category
     */
    getCategoryForAlgorithm(algorithmId) {
        const option = this.ui.elements.algorithmSelect.querySelector(`option[value="${algorithmId}"]`);
        return option ? option.dataset.category : 'sorting';
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AlgorithmPlayground();
    console.log('🚀 Algorithm Visual Playground initialized');
});
