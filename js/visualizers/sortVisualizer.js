/**
 * Sorting Visualizer
 * Renders sorting algorithms on canvas
 */

import { COLORS } from '../utils/constants.js';

export class SortVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.array = [];
        this.currentStep = null;
    }
    
    /**
     * Initialize canvas size
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 40;
        this.canvas.height = container.clientHeight - 40;
    }
    
    /**
     * Set array data
     * @param {number[]} array - Array to visualize
     */
    setArray(array) {
        this.array = array;
        this.resize();
    }
    
    /**
     * Render current step
     * @param {Object} step - Animation step
     */
    render(step) {
        this.currentStep = step;
        this.clear();
        this.drawBars(step);
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw bar chart
     * @param {Object} step - Current animation step
     */
    drawBars(step) {
        if (!step || !step.array) return;
        
        const array = step.array;
        const n = array.length;
        const maxValue = Math.max(...array);
        const barWidth = (this.canvas.width - (n + 1) * 2) / n;
        const heightScale = (this.canvas.height - 60) / maxValue;
        
        for (let i = 0; i < n; i++) {
            const barHeight = array[i] * heightScale;
            const x = i * (barWidth + 2) + 2;
            const y = this.canvas.height - barHeight - 30;
            
            // Determine bar color based on state
            let color = COLORS.DEFAULT;
            
            if (step.sorted && step.sorted.includes(i)) {
                color = COLORS.SORTED;
            } else if (step.indices && step.indices.includes(i)) {
                if (step.type === 'swap') {
                    color = COLORS.SWAPPING;
                } else if (step.type === 'compare') {
                    color = COLORS.COMPARING;
                } else {
                    color = COLORS.CURRENT;
                }
            }
            
            // Draw bar with gradient
            const gradient = this.ctx.createLinearGradient(x, y, x, y + barHeight);
            gradient.addColorStop(0, this.lightenColor(color, 20));
            gradient.addColorStop(1, color);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw border
            this.ctx.strokeStyle = this.darkenColor(color, 10);
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, barWidth, barHeight);
            
            // Draw value on top of bar
            if (n <= 30) {
                this.ctx.fillStyle = '#e4e9f7';
                this.ctx.font = '12px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(array[i], x + barWidth / 2, y - 5);
            }
            
            // Draw index below
            if (n <= 20) {
                this.ctx.fillStyle = '#6b7599';
                this.ctx.font = '10px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(i, x + barWidth / 2, this.canvas.height - 10);
            }
        }
    }
    
    /**
     * Lighten color
     * @param {string} color - Hex color
     * @param {number} percent - Percentage to lighten
     * @returns {string} Lightened color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    
    /**
     * Darken color
     * @param {string} color - Hex color
     * @param {number} percent - Percentage to darken
     * @returns {string} Darkened color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
}
