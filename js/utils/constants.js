/**
 * Application Constants
 * Centralized configuration and algorithm metadata
 */

export const ALGORITHM_INFO = {
    'bubble-sort': {
        name: 'Bubble Sort',
        category: 'sorting',
        description: 'Bubble Sort repeatedly steps through the array, compares adjacent elements and swaps them if they are in wrong order. The pass through the array is repeated until the array is sorted.',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        useCase: 'Educational purposes and nearly sorted small datasets. Not recommended for production due to poor performance on large datasets.',
        pseudocode: `function bubbleSort(array):
    n = length(array)
    for i from 0 to n-1:
        swapped = false
        for j from 0 to n-i-2:
            if array[j] > array[j+1]:
                swap(array[j], array[j+1])
                swapped = true
        if not swapped:
            break`
    },
    'insertion-sort': {
        name: 'Insertion Sort',
        category: 'sorting',
        description: 'Insertion Sort builds the final sorted array one item at a time. It iterates through an array and at each iteration, removes one element, finds its correct position in the sorted portion, and inserts it there.',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        useCase: 'Small datasets, nearly sorted data, or online algorithms where data arrives in real-time. Efficient for small arrays and adaptive to already sorted data.',
        pseudocode: `function insertionSort(array):
    for i from 1 to length(array)-1:
        key = array[i]
        j = i - 1
        while j >= 0 and array[j] > key:
            array[j+1] = array[j]
            j = j - 1
        array[j+1] = key`
    },
    'merge-sort': {
        name: 'Merge Sort',
        category: 'sorting',
        description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves. It guarantees O(n log n) performance.',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n)',
        useCase: 'Large datasets requiring guaranteed O(n log n) performance, external sorting, linked lists, and when stability is required. Used in production systems.',
        pseudocode: `function mergeSort(array, left, right):
    if left < right:
        mid = (left + right) / 2
        mergeSort(array, left, mid)
        mergeSort(array, mid+1, right)
        merge(array, left, mid, right)

function merge(array, left, mid, right):
    // Merge two sorted subarrays`
    },
    'bfs': {
        name: 'Breadth-First Search',
        category: 'graph',
        description: 'BFS explores a graph level by level using a queue. It visits all neighbors of a node before moving to the next level. Guarantees shortest path in unweighted graphs.',
        timeBest: 'O(V + E)',
        timeAvg: 'O(V + E)',
        timeWorst: 'O(V + E)',
        space: 'O(V)',
        useCase: 'Finding shortest path in unweighted graphs, level-order traversal, web crawling, social network analysis, and GPS navigation.',
        pseudocode: `function BFS(graph, start):
    queue = new Queue()
    visited = new Set()
    queue.enqueue(start)
    visited.add(start)
    
    while queue is not empty:
        node = queue.dequeue()
        process(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)`
    },
    'dfs': {
        name: 'Depth-First Search',
        category: 'graph',
        description: 'DFS explores a graph by going as deep as possible down each branch before backtracking. It uses a stack (or recursion) and is memory efficient for deep graphs.',
        timeBest: 'O(V + E)',
        timeAvg: 'O(V + E)',
        timeWorst: 'O(V + E)',
        space: 'O(V)',
        useCase: 'Detecting cycles, topological sorting, maze solving, finding connected components, and path finding when any path is acceptable.',
        pseudocode: `function DFS(graph, node, visited):
    visited.add(node)
    process(node)
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            DFS(graph, neighbor, visited)`
    },
    'dijkstra': {
        name: "Dijkstra's Algorithm",
        category: 'pathfinding',
        description: "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a priority queue to always explore the closest unvisited node.",
        timeBest: 'O((V + E) log V)',
        timeAvg: 'O((V + E) log V)',
        timeWorst: 'O((V + E) log V)',
        space: 'O(V)',
        useCase: 'GPS navigation, network routing protocols, social network recommendations, and any scenario requiring shortest path in weighted graphs with non-negative weights.',
        pseudocode: `function dijkstra(graph, start):
    dist = array of infinity
    dist[start] = 0
    pq = new PriorityQueue()
    pq.add(start, 0)
    
    while pq is not empty:
        node = pq.extractMin()
        
        for neighbor, weight in graph[node]:
            newDist = dist[node] + weight
            if newDist < dist[neighbor]:
                dist[neighbor] = newDist
                pq.add(neighbor, newDist)`
    },
    'astar': {
        name: 'A* Algorithm',
        category: 'pathfinding',
        description: 'A* is an informed search algorithm that finds the shortest path using a heuristic function. It combines the actual distance from start (g) with estimated distance to goal (h) to prioritize promising paths.',
        timeBest: 'O(E)',
        timeAvg: 'O(E)',
        timeWorst: 'O(b^d)',
        space: 'O(V)',
        useCase: 'Video game pathfinding, robot navigation, map applications when a clear goal exists. More efficient than Dijkstra when good heuristic is available.',
        pseudocode: `function aStar(graph, start, goal):
    openSet = {start}
    cameFrom = {}
    gScore = {start: 0}
    fScore = {start: heuristic(start, goal)}
    
    while openSet is not empty:
        current = node in openSet with lowest fScore
        if current == goal:
            return reconstructPath(cameFrom, current)
        
        openSet.remove(current)
        for neighbor in graph[current]:
            tentativeG = gScore[current] + dist(current, neighbor)
            if tentativeG < gScore[neighbor]:
                cameFrom[neighbor] = current
                gScore[neighbor] = tentativeG
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)`
    },
    'tree-preorder': {
        name: 'Preorder Traversal',
        category: 'recursion',
        description: 'Preorder traversal visits nodes in the order: Root → Left → Right. Used for creating a copy of the tree or prefix expression evaluation.',
        timeBest: 'O(n)',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(h)',
        useCase: 'Creating a copy of the tree, prefix notation, serialization, expression tree evaluation.',
        pseudocode: `function preorder(node):
    if node is null:
        return
    visit(node)
    preorder(node.left)
    preorder(node.right)`
    },
    'tree-inorder': {
        name: 'Inorder Traversal',
        category: 'recursion',
        description: 'Inorder traversal visits nodes in the order: Left → Root → Right. For Binary Search Trees, this produces values in ascending sorted order.',
        timeBest: 'O(n)',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(h)',
        useCase: 'Getting sorted values from BST, infix expression evaluation, binary search tree validation.',
        pseudocode: `function inorder(node):
    if node is null:
        return
    inorder(node.left)
    visit(node)
    inorder(node.right)`
    },
    'tree-postorder': {
        name: 'Postorder Traversal',
        category: 'recursion',
        description: 'Postorder traversal visits nodes in the order: Left → Right → Root. Used for deleting trees or postfix expression evaluation.',
        timeBest: 'O(n)',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(h)',
        useCase: 'Deleting/freeing tree nodes, postfix notation, calculating directory sizes, expression tree evaluation.',
        pseudocode: `function postorder(node):
    if node is null:
        return
    postorder(node.left)
    postorder(node.right)
    visit(node)`
    }
};

export const COLORS = {
    DEFAULT: '#3b4770',
    COMPARING: '#f59e0b',
    SWAPPING: '#ef4444',
    SORTED: '#10b981',
    CURRENT: '#5b8dee',
    VISITED: '#7c3aed',
    PATH: '#10b981',
    WALL: '#1e2749',
    START: '#10b981',
    END: '#ef4444',
    FRONTIER: '#f59e0b'
};

export const LEGEND_ITEMS = {
    sorting: [
        { color: COLORS.DEFAULT, label: 'Unsorted' },
        { color: COLORS.COMPARING, label: 'Comparing' },
        { color: COLORS.SWAPPING, label: 'Swapping' },
        { color: COLORS.SORTED, label: 'Sorted' },
        { color: COLORS.CURRENT, label: 'Current' }
    ],
    graph: [
        { color: COLORS.DEFAULT, label: 'Unvisited' },
        { color: COLORS.CURRENT, label: 'Current' },
        { color: COLORS.VISITED, label: 'Visited' },
        { color: COLORS.START, label: 'Start Node' }
    ],
    pathfinding: [
        { color: COLORS.DEFAULT, label: 'Unvisited' },
        { color: COLORS.WALL, label: 'Wall' },
        { color: COLORS.START, label: 'Start' },
        { color: COLORS.END, label: 'End' },
        { color: COLORS.FRONTIER, label: 'Exploring' },
        { color: COLORS.VISITED, label: 'Visited' },
        { color: COLORS.PATH, label: 'Shortest Path' }
    ],
    recursion: [
        { color: COLORS.DEFAULT, label: 'Unvisited' },
        { color: COLORS.CURRENT, label: 'Visiting' },
        { color: COLORS.VISITED, label: 'Visited' }
    ]
};

export const ANIMATION_SPEEDS = {
    MIN: 1,
    MAX: 100,
    DEFAULT: 50
};

export const GRID_CONFIG = {
    ROWS: 20,
    COLS: 40,
    NODE_SIZE: 25
};
