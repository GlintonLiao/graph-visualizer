## Context and Introduction

The project is a graph visualization tool with functionalities to add nodes and edges, determine edge values, display minimum spanning trees, and show the shortest path progressively. Here are some key features:

1. **Algorithm Demonstrations:** For computer science students, developers, or anyone learning about graph algorithms, visualizing concepts is precious. The tool would aid in understanding complex algorithms by demonstrating them visually, making abstract concepts more tangible.
2. **Educational Aid:** In academic settings, educators can use the tool to illustrate graph-related algorithms, and teach students about concepts like Dijkstra's algorithm, Prim's algorithm for minimum spanning trees, and more. Visual representation often enhances comprehension.
3. **Visualization Comprehension:** Graph algorithms, especially complex ones like Dijkstra's or algorithms dealing with minimum spanning trees, can be challenging to understand purely through code or text explanations. Visualization bridges this gap and makes these concepts more accessible.
4. **Interactive Learning:** Users can actively interact with the tool, adding nodes, creating edges, and observing how algorithms work in real-time. This interactive learning experience enhances understanding.
5. **Debugging and Validation:** For developers, visually inspecting the results of graph-related algorithms helps in debugging and validating their code. They can verify their implementations visually, which might need to be more apparent from numerical or text outputs.
6. **Tool for Presentations and Demonstrations:** Presenting algorithms in conferences, academic settings, or team meetings becomes more engaging and understandable with visual aids. The tool can be used to create compelling presentations.

In summary, this graph visualization tool serves as an educational aid, a development tool, and a means of visually comprehending complex graph-related algorithms. Its importance lies in bridging the gap between theoretical algorithm concepts and their practical understanding by providing an interactive, visual representation of graph operations and algorithms.

## Analysis

### Project Structure

1. **Tech Stack:**
    - **Frontend Framework:** next.js based on React
    - **State Management:** React Hooks (useState, useRef)
    - **UI Components:** Custom components (GraphTable, Viewer), Ant Design components (Dropdown, InputNumber, Button, message)
    - **Styling:** Tailwind CSS classes, inline styles
    - **Visualization Libraries:** SVG for rendering graphs
    - **Async Operations:** Promises for delaying execution
2. **File Structure and Components:**
    - **Viewer Component:** Responsible for rendering the graph, handling node and edge interactions, and implementing algorithms.
    - **GraphTable Component:** Not provided in the code block, but mentioned in the **`props`** object. Its functionality is not clear without the implementation.
    

### **Data Flow and Visualization:**

1. **State Management:**
    - State is managed using the **`useState`** hook for various aspects of the application (nodes, edges, activeNodeId, activeEdgeId, etc.).
    - The state is passed down to child components via props to maintain a single source of truth.
2. **User Interaction:**
    - User interactions, such as adding nodes, creating edges, selecting nodes/edges, changing the mode, etc., trigger state updates.
    - The **`Viewer`** component handles these interactions and modifies the state accordingly.
3. **Algorithms:**
    - The algorithms (Dijkstra's and Prim's) are triggered by user actions (e.g., clicking a button).
    - They operate on the current state of nodes and edges and update the state to reflect the progress and results of the algorithms.
4. **Graph Rendering:**
    - Nodes and edges are rendered using SVG elements.
    - Visual styles (colors, sizes) are controlled by state attributes (**`selected`**, **`visited`**, etc.).
5. **Algorithm Visualization:**
    - During algorithm execution, nodes and edges are highlighted to represent their status.
    - Delayed execution and visual updates provide a step-by-step visualization of the algorithms.

### **Move Node or Edge on the Viewer:**

1. **Mouse Event Handling:**
    - The **`activeMoveEvent`** function is triggered when a node is clicked with the left mouse button.
    - It sets the **`activeNodeIdRef.current`** to the clicked node's ID, and if it's a left-click, it initializes the **`mouseDownPosition`** with the current mouse coordinates.
2. **Drag Implementation:**
    - The **`moveFn`** function is called when the mouse is moved after a node is clicked.
    - It calculates the change in mouse coordinates (**`dx`** and **`dy`**) and updates the position of the active node by modifying its **`x`** and **`y`** properties.
    - The updated node information is then set in the state using **`setNodes`**.
3. **Event Binding and Cleanup:**
    - **`bindMoveEvent`** is used to add event listeners for mouse move and mouse up events while dragging.
    - When dragging is complete (**`mouseup`** event), the event listeners are removed, and the cursor is reset to 'default'.
4. **Visual Feedback:**
    - The cursor is set to 'move' during dragging, providing visual feedback to the user.

### **Shortest Path Algorithm (Dijkstra's Algorithm):**

### Algorithm Overview:

1. **Initialization:**
    - A map (**`nodesMap`**) is created to store information about each node, including whether it has been visited, its distance from the source node, and its predecessor in the shortest path.
    - The distance of the source node is set to 0, and all other nodes are initialized with infinite distance.
    - The algorithm iteratively selects the node with the smallest distance from the source node, updates its neighbors' distances, and marks it as visited.
2. **Main Loop:**
    - The algorithm continues until all nodes are visited.
    - In each iteration, the node with the minimum distance is selected and marked as visited.
    - The distances of its unvisited neighbors are updated if a shorter path is found.
3. **Visualization:**
    - During the algorithm's execution, nodes and edges are visually highlighted to represent their status (selected, visited, etc.).
    - The total distance of the shortest path is calculated and displayed.

### Code Analysis:

1. **Nodes Initialization:**
    - Nodes are initialized with attributes like **`visited`**, **`distance`**, and **`pre`** (predecessor).
    - The **`while (true)`** loop continues until all nodes are visited, ensuring the algorithm covers all reachable nodes.
2. **Visualization Updates:**
    - Nodes and edges are visually highlighted by setting the **`selected`** attribute to **`true`** during the algorithm's execution.
    - The **`setNodes`** and **`setEdges`** functions are used to update the state and trigger re-rendering.
3. **Delay and Speed Control:**
    - **`await new Promise((resolve) => setTimeout(resolve, 1000 * speed))`** introduces a delay between iterations, controlled by the **`speed`** state.
    - This delay provides a visual representation of the algorithm's execution.

### **Minimum Spanning Tree Algorithm (Prim's Algorithm):**

### Algorithm Overview:

1. **Initialization:**
    - Nodes are initialized with attributes like **`visited`** and **`pre`**.
    - An array (**`edgesHeap`**) is constructed as a min-heap based on edge values.
2. **Main Loop:**
    - The algorithm iteratively selects the edge with the minimum weight from the min-heap (**`edgesHeap`**).
    - It checks if adding the edge creates a cycle and, if not, adds the edge to the Minimum Spanning Tree (MST).
    - Nodes and edges are visually highlighted during the process.
3. **Visualization:**
    - Similar to Dijkstra's algorithm, nodes and edges are visually highlighted to represent their status (selected, visited, etc.).
    - The total distance of the MST is calculated and displayed.
4. **Delay and Speed Control:**
    - Similar to Dijkstra's algorithm, there's a delay between iterations controlled by the **`speed`** state.

### Code Analysis:

1. **Nodes Initialization:**
    - Nodes are initialized with attributes like **`visited`** and **`pre`**.
    - The **`edgesHeap`** array is created to simulate a min-heap for efficient edge selection.
2. **Visualization Updates:**
    - Nodes and edges are visually highlighted by setting the **`selected`** attribute to **`true`** during the algorithm's execution.
    - The **`setNodes`** and **`setEdges`** functions are used to update the state and trigger re-rendering.
3. **Delay and Speed Control:**
    - The delay between iterations provides a step-by-step visualization of the algorithm's execution.

## Conclusion

The development of this graph visualization tool provided an opportunity to deepen my understanding of two fundamental graph algorithms: the shortest path algorithm (Dijkstra's) and the minimum spanning tree algorithm (Prim's). Implementing these algorithms in a real-world context allowed me to gain practical insights into their workings and intricacies.

Moreover, the project served as a valuable platform to practice and enhance my front-end development skills. Working with React, React Hooks, and related technologies, I honed my ability to create interactive and responsive user interfaces. The utilization of SVG for graph rendering, alongside integrating various UI components, contributed to my proficiency in crafting engaging and visually appealing applications.

The project's emphasis on interactive learning and algorithm visualization not only reinforced my theoretical knowledge but also sharpened my skills in translating complex algorithms into user-friendly and accessible features. This practical application of front-end technologies has not only deepened my understanding of graph algorithms but has also expanded my expertise in creating educational tools that facilitate comprehension through visualization.

In the future, I plan to enhance the graph visualization tool by incorporating features such as a bipartite algorithm, intelligent algorithm selection between Prim's and Kruskal's based on graph attributes, and the ability to read graph information from CSV files. These additions will further enrich the tool's educational value and practical applications, showcasing its adaptability and versatility for users exploring various graph-related concepts.

In summary, this project has been a dual opportunity for algorithmic exploration and front-end skill refinement, allowing for a holistic growth in both theoretical and practical aspects of my technical skill set.

## Appendix

Code:  [https://github.com/GlintonLiao/graph-visualizer](https://github.com/GlintonLiao/graph-visualizer)

Live Demo: [graph-visualizer-5800.vercel.app](https://graph-visualizer-5800.vercel.app/)
