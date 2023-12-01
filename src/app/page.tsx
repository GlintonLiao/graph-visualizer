'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { GraphTable } from '../components/GraphTable'
import { Viewer } from '../components/Viewer'
import { message } from 'antd'

export interface Node {
  id: string
  name: string
  x: number
  y: number
  selected?: boolean
}

export interface Edge {
  id: string
  sourceId: string
  targetId: string
  value: number
  selected?: boolean
}

export interface ChildProps {
  nodes: Record<string, Node>
  edges: Record<string, Edge>
  setNodes: Dispatch<SetStateAction<Record<string, Node>>>
  setEdges: Dispatch<SetStateAction<Record<string, Edge>>>
  activeNodeId?: string
  setActiveNodeId: Dispatch<SetStateAction<string | undefined>>
  activeEdgeId?: string
  setActiveEdgeId: Dispatch<SetStateAction<string | undefined>>
  mode: OperationMode
  setMode: Dispatch<SetStateAction<OperationMode>>
  speed: number
  setSpeed: Dispatch<SetStateAction<number>>
  totalDistance: number
  setTotalDistance: Dispatch<SetStateAction<number>>
  canClear: boolean
  setCanClear: Dispatch<SetStateAction<boolean>>
  runShortestPath: () => void
  runMinimumSpanningTree: () => void
  runCanBipartite: () => void
}

export enum OperationMode {
  SHORTEST_PATH = 'SHORTEST_PATH',
  MINIMUM_SPANNING_TREE = 'MINIMUM_SPANNING_TREE',
  // CAN_BIPARTITE = 'CAN_BIPARTITE',
}

export default function Home() {
  const [nodes, setNodes] = useState<Record<string, Node>>({})
  const [edges, setEdges] = useState<Record<string, Edge>>({})
  const [activeNodeId, setActiveNodeId] = useState<string>()
  const [activeEdgeId, setActiveEdgeId] = useState<string>()
  const [mode, setMode] = useState<OperationMode>(OperationMode.SHORTEST_PATH)
  const [speed, setSpeed] = useState<number>(1)
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [canClear, setCanClear] = useState<boolean>(false)

  const runShortestPath = async () => {
    if (!activeNodeId) {
      message.warning('Please select a node as source node first')
      setCanClear(false)
      return
    }

    const nodesMap: {
      [key: string]: Node & {
        visited: boolean
        distance: number
        pre: string | null
      }
    } = {}
    console.log(nodes, 'nodes')
    Object.values(nodes).forEach((node) => {
      nodesMap[node.id] = node as Node & {
        visited: boolean
        distance: number
        pre: string | null
      }
      nodesMap[node.id].visited = false
      nodesMap[node.id].distance = node.id === activeNodeId ? 0 : Infinity
      nodesMap[node.id].pre = null
    })

    while (true) {
      let minDistanceNode: any = null
      Object.values(nodesMap).forEach((node) => {
        if (
          !node.visited &&
          (minDistanceNode === null || node.distance < minDistanceNode.distance)
        ) {
          minDistanceNode = node
        }
      })
      if (!minDistanceNode) break
      nodesMap[minDistanceNode.id].visited = true
      console.log(minDistanceNode, 'minDistanceNode')
      setNodes((prev) => ({
        ...prev,
        [minDistanceNode.id]: {
          ...prev[minDistanceNode.id],
          selected: true,
        },
      }))
      const edgesFromMinDistanceNode = Object.values(edges).filter(
        (edge) =>
          edge.sourceId === minDistanceNode.id ||
          edge.targetId === minDistanceNode.id
      )
      console.log(edgesFromMinDistanceNode, 'edgesFromMinDistanceNode')
      const selectedEdge = edgesFromMinDistanceNode.find(
        (edge) =>
          (edge.sourceId === minDistanceNode.id &&
            edge.targetId === minDistanceNode.pre) ||
          (edge.targetId === minDistanceNode.id &&
            edge.sourceId === minDistanceNode.pre)
      )
      console.log(selectedEdge, 'selectedEdge')
      if (selectedEdge) {
        setEdges((prev) => ({
          ...prev,
          [selectedEdge.id]: {
            ...prev[selectedEdge.id],
            selected: true,
          },
        }))
        setTotalDistance((prev) => prev + selectedEdge.value)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * speed))
      edgesFromMinDistanceNode.forEach((edge) => {
        const targetNode =
          nodesMap[
            edge.targetId === minDistanceNode.id ? edge.sourceId : edge.targetId
          ]
        if (targetNode.distance > minDistanceNode.distance + edge.value) {
          targetNode.distance = minDistanceNode.distance + edge.value
          targetNode.pre = minDistanceNode.id
        }
      })
    }
  }

  const runMinimumSpanningTree = async () => {
    const nodesMap: {
      [key: string]: Node & {
        visited: boolean
        pre: string | null
      }
    } = {}

    Object.values(nodes).forEach((node) => {
      nodesMap[node.id] = node as Node & {
        visited: boolean
        pre: string | null
      }
      nodesMap[node.id].visited = false
      nodesMap[node.id].pre = null
    })

    console.log(nodesMap)

    const edgesHeap: Edge[] = [...Object.values(edges)]
    // construct a min-heap based on the edge values
    edgesHeap.sort((a, b) => a.value - b.value)

    const selectedEdges: Edge[] = []

    while (selectedEdges.length < Object.keys(nodes).length - 1) {
      // extract the edge with the minimum weight
      const minEdge = edgesHeap.shift()

      if (!minEdge) break

      // check if adding the edge creates a cycle
      const sourceVisited = nodesMap[minEdge.sourceId].visited
      const targetVisited = nodesMap[minEdge.targetId].visited

      // if (sourceVisited && targetVisited) {
      //   continue // Skip this edge to avoid a cycle
      // }

      // mark the nodes as visited
      nodesMap[minEdge.sourceId].visited = true
      nodesMap[minEdge.targetId].visited = true

      setNodes((prev) => ({
        ...prev,
        [minEdge.sourceId]: {
          ...prev[minEdge.sourceId],
          selected: true,
        },
        [minEdge.targetId]: {
          ...prev[minEdge.targetId],
          selected: true,
        },
      }))

      // update the MST
      selectedEdges.push(minEdge)

      console.log(`Selected Edge: ${minEdge.sourceId} - ${minEdge.targetId}`)
      setEdges((prev) => ({
        ...prev,
        [minEdge.id]: {
          ...prev[minEdge.id],
          selected: true,
        },
      }))

      await new Promise((resolve) => setTimeout(resolve, 1000 * speed))

      // add the edges connected to the newly added node to the heap
      const adjacentEdges = Object.values(edges).filter(
        (edge) =>
          edge.sourceId === minEdge.sourceId ||
          edge.targetId === minEdge.sourceId ||
          edge.sourceId === minEdge.targetId ||
          edge.targetId === minEdge.targetId
      )

      for (const adjacentEdge of adjacentEdges) {
        if (!adjacentEdge.selected) {
          edgesHeap.push(adjacentEdge)
        }
      }

      // re-heapify
      edgesHeap.sort((a, b) => a.value - b.value)
    }

    console.log('Selected Edges for Minimum Spanning Tree:', selectedEdges)
    setTotalDistance(selectedEdges.reduce((acc, edge) => acc + edge.value, 0))
  }

  const runCanBipartite = () => {
    // TODO
  }

  const props: ChildProps = {
    nodes,
    edges,
    setNodes,
    setEdges,
    activeNodeId,
    setActiveNodeId,
    activeEdgeId,
    setActiveEdgeId,
    mode,
    setMode,
    speed,
    setSpeed,
    totalDistance,
    setTotalDistance,
    canClear,
    setCanClear,
    runShortestPath,
    runMinimumSpanningTree,
    runCanBipartite,
  }

  return (
    <main className='h-screen w-screen flex bg-white'>
      <GraphTable {...props} />
      <Viewer {...props} />
    </main>
  )
}
