/**
 * Sorting Algorithms
 * Pure algorithm implementations that generate animation steps
 */

import { swap } from '../utils/helpers.js';

/**
 * Generate animation steps for Bubble Sort
 * @param {number[]} arr - Array to sort
 * @returns {Array} Array of animation steps
 */
export function bubbleSort(arr) {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    
    steps.push({
        type: 'init',
        array: [...array],
        description: 'Starting Bubble Sort. Array has ' + n + ' elements.'
    });
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        steps.push({
            type: 'pass',
            array: [...array],
            sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
            description: `Pass ${i + 1}: Bubbling largest element to position ${n - 1 - i}.`
        });
        
        for (let j = 0; j < n - i - 1; j++) {
            // Comparison step
            steps.push({
                type: 'compare',
                array: [...array],
                indices: [j, j + 1],
                sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                description: `Comparing index ${j} (${array[j]}) with index ${j + 1} (${array[j + 1]}).`
            });
            
            if (array[j] > array[j + 1]) {
                // Swap step
                swap(array, j, j + 1);
                steps.push({
                    type: 'swap',
                    array: [...array],
                    indices: [j, j + 1],
                    sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
                    description: `${array[j + 1]} > ${array[j]}, swapping positions.`
                });
                swapped = true;
            }
        }
        
        if (!swapped) {
            steps.push({
                type: 'early-exit',
                array: [...array],
                sorted: Array.from({ length: n }, (_, idx) => idx),
                description: 'No swaps in this pass. Array is sorted!'
            });
            break;
        }
    }
    
    steps.push({
        type: 'complete',
        array: [...array],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        description: 'Bubble Sort complete! All elements are in order.'
    });
    
    return steps;
}

/**
 * Generate animation steps for Insertion Sort
 * @param {number[]} arr - Array to sort
 * @returns {Array} Array of animation steps
 */
export function insertionSort(arr) {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    
    steps.push({
        type: 'init',
        array: [...array],
        description: 'Starting Insertion Sort. Building sorted array from left to right.'
    });
    
    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;
        
        steps.push({
            type: 'select',
            array: [...array],
            indices: [i],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            description: `Selecting element at index ${i} (value: ${key}) to insert into sorted portion.`
        });
        
        while (j >= 0 && array[j] > key) {
            steps.push({
                type: 'compare',
                array: [...array],
                indices: [j, j + 1],
                sorted: Array.from({ length: i }, (_, idx) => idx),
                description: `Comparing ${array[j]} at index ${j} with key ${key}. Shifting right.`
            });
            
            array[j + 1] = array[j];
            
            steps.push({
                type: 'shift',
                array: [...array],
                indices: [j, j + 1],
                sorted: Array.from({ length: i }, (_, idx) => idx),
                description: `Shifted ${array[j + 1]} from index ${j} to index ${j + 1}.`
            });
            
            j--;
        }
        
        array[j + 1] = key;
        
        steps.push({
            type: 'insert',
            array: [...array],
            indices: [j + 1],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
            description: `Inserted ${key} at index ${j + 1}. Sorted portion now has ${i + 1} elements.`
        });
    }
    
    steps.push({
        type: 'complete',
        array: [...array],
        sorted: Array.from({ length: n }, (_, idx) => idx),
        description: 'Insertion Sort complete! All elements inserted in correct order.'
    });
    
    return steps;
}

/**
 * Generate animation steps for Merge Sort
 * @param {number[]} arr - Array to sort
 * @returns {Array} Array of animation steps
 */
export function mergeSort(arr) {
    const steps = [];
    const array = [...arr];
    
    steps.push({
        type: 'init',
        array: [...array],
        description: 'Starting Merge Sort. Dividing array recursively.'
    });
    
    function mergeSortHelper(arr, left, right, depth = 0) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
            type: 'divide',
            array: [...array],
            range: [left, right],
            mid: mid,
            depth: depth,
            description: `Dividing array[${left}...${right}] at index ${mid}.`
        });
        
        mergeSortHelper(arr, left, mid, depth + 1);
        mergeSortHelper(arr, mid + 1, right, depth + 1);
        merge(arr, left, mid, right, depth);
    }
    
    function merge(arr, left, mid, right, depth) {
        const leftArr = array.slice(left, mid + 1);
        const rightArr = array.slice(mid + 1, right + 1);
        
        steps.push({
            type: 'merge-start',
            array: [...array],
            range: [left, right],
            depth: depth,
            description: `Merging subarrays [${left}...${mid}] and [${mid + 1}...${right}].`
        });
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            steps.push({
                type: 'compare',
                array: [...array],
                indices: [left + i, mid + 1 + j],
                description: `Comparing ${leftArr[i]} and ${rightArr[j]}.`
            });
            
            if (leftArr[i] <= rightArr[j]) {
                array[k] = leftArr[i];
                i++;
            } else {
                array[k] = rightArr[j];
                j++;
            }
            
            steps.push({
                type: 'place',
                array: [...array],
                indices: [k],
                description: `Placed ${array[k]} at index ${k}.`
            });
            
            k++;
        }
        
        while (i < leftArr.length) {
            array[k] = leftArr[i];
            steps.push({
                type: 'place',
                array: [...array],
                indices: [k],
                description: `Copying remaining element ${array[k]} to index ${k}.`
            });
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            array[k] = rightArr[j];
            steps.push({
                type: 'place',
                array: [...array],
                indices: [k],
                description: `Copying remaining element ${array[k]} to index ${k}.`
            });
            j++;
            k++;
        }
        
        steps.push({
            type: 'merge-complete',
            array: [...array],
            range: [left, right],
            description: `Merged range [${left}...${right}] is now sorted.`
        });
    }
    
    mergeSortHelper(array, 0, array.length - 1);
    
    steps.push({
        type: 'complete',
        array: [...array],
        sorted: Array.from({ length: array.length }, (_, idx) => idx),
        description: 'Merge Sort complete! All subarrays merged in order.'
    });
    
    return steps;
}
