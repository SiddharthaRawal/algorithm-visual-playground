/**
 * UI Controller
 * Manages DOM updates and user interactions
 */

import { ALGORITHM_INFO, LEGEND_ITEMS } from '../utils/constants.js';

export class UIController {
    constructor() {
        this.elements = {
            // Algorithm info
            algoTitle: document.getElementById('algo-title'),
            algoDescription: document.getElementById('algo-description'),
            timeBest: document.getElementById('time-best'),
            timeAvg: document.getElementById('time-avg'),
            timeWorst: document.getElementById('time-worst'),
            spaceComplexity: document.getElementById('space-complexity'),
            useCase: document.getElementById('use-case-text'),
            
            // Step info
            stepExplanation: document.getElementById('step-explanation'),
            pseudocode: document.getElementById('pseudocode'),
            
            // Legend
            legendItems: document.getElementById('legend-items'),
            
            // Controls
            btnPlay: document.getElementById('btn-play'),
            btnPause: document.getElementById('btn-pause'),
            btnStep: document.getElementById('btn-step'),
            btnReset: document.getElementById('btn-reset'),
            speedSlider: document.getElementById('speed-slider'),
            speedValue: document.getElementById('speed-value'),
            
            // Configuration
            algorithmSelect: document.getElementById('algorithm-select'),
            dataSize: document.getElementById('data-size'),
            sizeValue: document.getElementById('size-value'),
            
            // Category buttons
            categoryBtns: document.querySelectorAll('.category-btn'),
            
            // Canvas/Grid
            canvas: document.getElementById('visualization-canvas'),
            gridContainer: document.getElementById('grid-container')
        };
        
        this.currentAlgorithm = null;
    }
    
    /**
     * Update algorithm information panel
     * @param {string} algorithmId - Algorithm identifier
     */
    updateAlgorithmInfo(algorithmId) {
        const info = ALGORITHM_INFO[algorithmId];
        if (!info) return;
        
        this.currentAlgorithm = algorithmId;
        
        this.elements.algoTitle.textContent = info.name;
        this.elements.algoDescription.textContent = info.description;
        this.elements.timeBest.textContent = info.timeBest;
        this.elements.timeAvg.textContent = info.timeAvg;
        this.elements.timeWorst.textContent = info.timeWorst;
        this.elements.spaceComplexity.textContent = info.space;
        this.elements.useCase.textContent = info.useCase;
        
        this.updatePseudocode(info.pseudocode);
        this.updateLegend(info.category);
    }
    
    /**
     * Update pseudocode display
     * @param {string} code - Pseudocode text
     */
    updatePseudocode(code) {
        this.elements.pseudocode.innerHTML = `<code>${this.escapeHtml(code)}</code>`;
    }
    
    /**
     * Highlight specific line in pseudocode
     * @param {number} lineNumber - Line to highlight (1-based)
     */
    highlightPseudocodeLine(lineNumber) {
        const code = this.elements.pseudocode.querySelector('code');
        if (!code) return;
        
        const lines = code.textContent.split('\n');
        const highlightedHtml = lines.map((line, index) => {
            if (index === lineNumber - 1) {
                return `<span class="highlight">${this.escapeHtml(line)}</span>`;
            }
            return this.escapeHtml(line);
        }).join('\n');
        
        code.innerHTML = highlightedHtml;
    }
    
    /**
     * Update legend based on category
     * @param {string} category - Algorithm category
     */
    updateLegend(category) {
        const items = LEGEND_ITEMS[category] || [];
        this.elements.legendItems.innerHTML = '';
        
        items.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.backgroundColor = item.color;
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            this.elements.legendItems.appendChild(legendItem);
        });
    }
    
    /**
     * Update step explanation
     * @param {string} text - Explanation text
     */
    updateStepExplanation(text) {
        this.elements.stepExplanation.textContent = text;
    }
    
    /**
     * Update control button states
     * @param {Object} state - Button states
     */
    updateControlButtons(state) {
        const { isPlaying, isPaused, canStep, canReset } = state;
        
        this.elements.btnPlay.disabled = isPlaying && !isPaused;
        this.elements.btnPause.disabled = !isPlaying || isPaused;
        this.elements.btnStep.disabled = isPlaying && !isPaused;
        this.elements.btnReset.disabled = !canReset;
        
        // Update play/pause button text
        if (isPlaying && !isPaused) {
            this.elements.btnPlay.innerHTML = '<span class="icon">▶</span> Playing...';
        } else {
            this.elements.btnPlay.innerHTML = '<span class="icon">▶</span> Play';
        }
        
        if (isPaused) {
            this.elements.btnPause.innerHTML = '<span class="icon">▶</span> Resume';
        } else {
            this.elements.btnPause.innerHTML = '<span class="icon">⏸</span> Pause';
        }
    }
    
    /**
     * Show canvas, hide grid
     */
    showCanvas() {
        this.elements.canvas.classList.remove('hidden');
        this.elements.gridContainer.classList.add('hidden');
    }
    
    /**
     * Show grid, hide canvas
     */
    showGrid() {
        this.elements.canvas.classList.add('hidden');
        this.elements.gridContainer.classList.remove('hidden');
    }
    
    /**
     * Update size display
     * @param {number} size - Current size value
     */
    updateSizeDisplay(size) {
        this.elements.sizeValue.textContent = size;
    }
    
    /**
     * Update speed display
     * @param {number} speed - Current speed value
     */
    updateSpeedDisplay(speed) {
        this.elements.speedValue.textContent = speed;
    }
    
    /**
     * Get current algorithm selection
     * @returns {string} Algorithm ID
     */
    getCurrentAlgorithm() {
        return this.elements.algorithmSelect.value;
    }
    
    /**
     * Get current data size
     * @returns {number} Size value
     */
    getDataSize() {
        return parseInt(this.elements.dataSize.value);
    }
    
    /**
     * Get current speed
     * @returns {number} Speed value
     */
    getSpeed() {
        return parseInt(this.elements.speedSlider.value);
    }
    
    /**
     * Set active category button
     * @param {string} category - Category name
     */
    setActiveCategory(category) {
        this.elements.categoryBtns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    /**
     * Filter algorithm dropdown by category
     * @param {string} category - Category name
     */
    filterAlgorithmsByCategory(category) {
        const options = this.elements.algorithmSelect.querySelectorAll('option');
        let firstVisible = null;
        
        options.forEach(option => {
            if (option.dataset.category === category) {
                option.style.display = 'block';
                if (!firstVisible) firstVisible = option;
            } else {
                option.style.display = 'none';
            }
        });
        
        // Select first visible option
        if (firstVisible) {
            this.elements.algorithmSelect.value = firstVisible.value;
        }
    }
    
    /**
     * Escape HTML for safe display
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Show notification message
     * @param {string} message - Message text
     * @param {string} type - Message type (info, success, error)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--bg-elevated);
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--accent-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'primary'});
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
