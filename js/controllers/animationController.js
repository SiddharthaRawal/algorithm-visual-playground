/**
 * Animation Controller
 * Manages playback state and step progression
 */

import { speedToDelay, delay } from '../utils/helpers.js';

export class AnimationController {
    constructor() {
        this.steps = [];
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 50;
        this.onStepChange = null; // Callback for step updates
    }
    
    /**
     * Load algorithm steps
     * @param {Array} steps - Array of animation steps
     */
    loadSteps(steps) {
        this.steps = steps;
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
    }
    
    /**
     * Get current step
     * @returns {Object} Current step
     */
    getCurrentStep() {
        return this.steps[this.currentStepIndex] || null;
    }
    
    /**
     * Play animation
     */
    async play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        
        while (this.isPlaying && this.currentStepIndex < this.steps.length) {
            if (this.isPaused) {
                await delay(100);
                continue;
            }
            
            const step = this.getCurrentStep();
            if (this.onStepChange) {
                this.onStepChange(step, this.currentStepIndex);
            }
            
            await delay(speedToDelay(this.speed));
            
            this.currentStepIndex++;
        }
        
        if (this.currentStepIndex >= this.steps.length) {
            this.isPlaying = false;
            this.currentStepIndex = this.steps.length - 1;
        }
    }
    
    /**
     * Pause animation
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Resume animation
     */
    resume() {
        this.isPaused = false;
    }
    
    /**
     * Stop animation
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
    }
    
    /**
     * Step forward one step
     */
    stepForward() {
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            const step = this.getCurrentStep();
            if (this.onStepChange) {
                this.onStepChange(step, this.currentStepIndex);
            }
        }
    }
    
    /**
     * Step backward one step
     */
    stepBackward() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            const step = this.getCurrentStep();
            if (this.onStepChange) {
                this.onStepChange(step, this.currentStepIndex);
            }
        }
    }
    
    /**
     * Reset to first step
     */
    reset() {
        this.stop();
        this.currentStepIndex = 0;
        const step = this.getCurrentStep();
        if (this.onStepChange) {
            this.onStepChange(step, this.currentStepIndex);
        }
    }
    
    /**
     * Set playback speed
     * @param {number} speed - Speed value (1-100)
     */
    setSpeed(speed) {
        this.speed = Math.max(1, Math.min(100, speed));
    }
    
    /**
     * Check if at last step
     * @returns {boolean}
     */
    isAtEnd() {
        return this.currentStepIndex >= this.steps.length - 1;
    }
    
    /**
     * Check if at first step
     * @returns {boolean}
     */
    isAtStart() {
        return this.currentStepIndex === 0;
    }
    
    /**
     * Get progress percentage
     * @returns {number} Progress (0-100)
     */
    getProgress() {
        if (this.steps.length === 0) return 0;
        return Math.round((this.currentStepIndex / (this.steps.length - 1)) * 100);
    }
}
