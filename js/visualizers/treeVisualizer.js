/**
 * Tree Visualizer
 * Renders binary tree traversals on canvas
 */

import { COLORS } from '../utils/constants.js';
import { calculateTreePositions } from '../utils/helpers.js';

export class TreeVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tree = null;
        this.positions = null;
    }
    
    /**
     * Initialize with tree data
     * @param {Object} tree - Binary tree root
     */
    initialize(tree) {
        this.tree = tree;
        this.resize();
        this.positions = calculateTreePositions(tree, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Resize canvas
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 40;
        this.canvas.height = container.clientHeight - 40;
    }
    
    /**
     * Render current step
     * @param {Object} step - Animation step
     */
    render(step) {
        this.clear();
        if (!this.tree || !this.positions) return;
        
        // Draw edges first
        this.drawEdges(this.tree, step);
        
        // Draw nodes
        this.drawNodes(this.tree, step);
        
        // Draw call stack
        if (step.callStack && step.callStack.length > 0) {
            this.drawCallStack(step.callStack);
        }
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw tree edges recursively
     * @param {Object} node - Current node
     * @param {Object} step - Animation step
     */
    drawEdges(node, step) {
        if (!node) return;
        
        const pos = this.positions.get(node.id);
        
        if (node.left) {
            const leftPos = this.positions.get(node.left.id);
            const isActive = step.node && 
                           (step.node.id === node.id || step.node.id === node.left.id) &&
                           step.direction === 'left';
            
            this.drawEdge(pos.x, pos.y, leftPos.x, leftPos.y, isActive);
            this.drawEdges(node.left, step);
        }
        
        if (node.right) {
            const rightPos = this.positions.get(node.right.id);
            const isActive = step.node && 
                           (step.node.id === node.id || step.node.id === node.right.id) &&
                           step.direction === 'right';
            
            this.drawEdge(pos.x, pos.y, rightPos.x, rightPos.y, isActive);
            this.drawEdges(node.right, step);
        }
    }
    
    /**
     * Draw single edge
     * @param {number} x1 - Start x
     * @param {number} y1 - Start y
     * @param {number} x2 - End x
     * @param {number} y2 - End y
     * @param {boolean} active - Is edge active
     */
    drawEdge(x1, y1, x2, y2, active) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = active ? COLORS.CURRENT : '#2a3458';
        this.ctx.lineWidth = active ? 3 : 2;
        this.ctx.stroke();
    }
    
    /**
     * Draw tree nodes recursively
     * @param {Object} node - Current node
     * @param {Object} step - Animation step
     */
    drawNodes(node, step) {
        if (!node) return;
        
        const pos = this.positions.get(node.id);
        let color = COLORS.DEFAULT;
        
        // Determine node color based on step
        if (step.node && step.node.id === node.id) {
            if (step.type === 'visit') {
                color = COLORS.CURRENT;
            } else if (step.type === 'recurse') {
                color = COLORS.COMPARING;
            }
        } else if (step.type === 'return' && step.node && step.node.id === node.id) {
            color = COLORS.VISITED;
        }
        
        // Check if node was visited in previous steps
        // (This would require tracking visited nodes in state)
        
        this.drawNode(pos.x, pos.y, node.value, color);
        
        if (node.left) this.drawNodes(node.left, step);
        if (node.right) this.drawNodes(node.right, step);
    }
    
    /**
     * Draw single node
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {*} value - Node value
     * @param {string} color - Node color
     */
    drawNode(x, y, value, color) {
        const radius = 25;
        
        // Draw circle with gradient
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, this.lightenColor(color, 30));
        gradient.addColorStop(1, color);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw border
        this.ctx.strokeStyle = this.darkenColor(color, 20);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw value
        this.ctx.fillStyle = '#e4e9f7';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(value, x, y);
    }
    
    /**
     * Draw call stack visualization
     * @param {Array} callStack - Array of function calls
     */
    drawCallStack(callStack) {
        const x = this.canvas.width - 220;
        const y = 20;
        const width = 200;
        const itemHeight = 30;
        
        // Draw container
        this.ctx.fillStyle = 'rgba(21, 27, 61, 0.9)';
        this.ctx.fillRect(x, y, width, callStack.length * itemHeight + 40);
        this.ctx.strokeStyle = '#2a3458';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, callStack.length * itemHeight + 40);
        
        // Draw title
        this.ctx.fillStyle = '#a0a8c5';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Call Stack', x + 10, y + 20);
        
        // Draw stack frames
        callStack.forEach((call, index) => {
            const frameY = y + 40 + index * itemHeight;
            
            // Frame background
            this.ctx.fillStyle = '#1e2749';
            this.ctx.fillRect(x + 10, frameY, width - 20, itemHeight - 5);
            this.ctx.strokeStyle = COLORS.CURRENT;
            this.ctx.strokeRect(x + 10, frameY, width - 20, itemHeight - 5);
            
            // Frame text
            this.ctx.fillStyle = '#e4e9f7';
            this.ctx.font = '11px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(call, x + 15, frameY + 18);
        });
    }
    
    /**
     * Lighten color helper
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
     * Darken color helper
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
