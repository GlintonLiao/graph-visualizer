'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { GraphTable } from '../components/GraphTable'
import { Viewer } from '../components/Viewer'

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
  runShortestPath: () => void
}

export enum OperationMode {
  SHORTEST_PATH = 'SHORTEST_PATH',
  MINIMUM_SPANNING_TREE = 'MINIMUM_SPANNING_TREE',
  CAN_BIPARTITE = 'CAN_BIPARTITE',
}

export default function Home() {
  const [nodes, setNodes] = useState<Record<string, Node>>({})
  const [edges, setEdges] = useState<Record<string, Edge>>({})
  const [activeNodeId, setActiveNodeId] = useState<string>()
  const [activeEdgeId, setActiveEdgeId] = useState<string>()
  const [mode, setMode] = useState<OperationMode>(OperationMode.SHORTEST_PATH)
  const [speed, setSpeed] = useState<number>(1)

  const runShortestPath = async () => {
    // TODO: Dijsktra's algorithm
    const nodesMap: {
      [key: string]: Node & { visited: boolean; distance: number; pre: string | null }
    } = {}
    console.log(nodes, 'nodes');
    
    Object.values(nodes).forEach((node) => {
      nodesMap[node.id] = node as Node & { visited: boolean; distance: number; pre: string | null }
      nodesMap[node.id].visited = false
      nodesMap[node.id].distance = node.id === activeNodeId ? 0 : Infinity
      nodesMap[node.id].pre = null
    })
    while (true) {
      const unvisitedNodes = Object.values(nodesMap).filter(
        (node) => !node.visited
      )
      if (unvisitedNodes.length === 0) break
      const minDistanceNode = unvisitedNodes.reduce((acc, node) =>
        node.distance < acc.distance ? node : acc
      , unvisitedNodes[0])
      nodesMap[minDistanceNode.id].visited = true
      console.log(minDistanceNode, 'minDistanceNode');
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
      console.log(edgesFromMinDistanceNode, 'edgesFromMinDistanceNode');
      
      const selectedEdge = edgesFromMinDistanceNode.find(
        (edge) =>
          (edge.sourceId === minDistanceNode.id && edge.targetId === minDistanceNode.pre) ||
          (edge.targetId === minDistanceNode.id && edge.sourceId === minDistanceNode.pre)
      )
      console.log(selectedEdge, 'selectedEdge');
      if (selectedEdge) {
        setEdges((prev) => ({
          ...prev,
          [selectedEdge.id]: {
            ...prev[selectedEdge.id],
            selected: true,
          },
        }))
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 / speed))
      edgesFromMinDistanceNode.forEach((edge) => {
        const targetNode = nodesMap[edge.targetId === minDistanceNode.id ? edge.sourceId : edge.targetId]
        if (targetNode.distance > minDistanceNode.distance + edge.value) {
          targetNode.distance = minDistanceNode.distance + edge.value
          targetNode.pre = minDistanceNode.id
        }
      })
    }
  }

  const runMinimumSpanningTree = () => {
    // TODO
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
    runShortestPath,
  }

  return (
    <main className='h-screen w-screen flex bg-white'>
      <GraphTable {...props} />
      <Viewer {...props} />
    </main>
  )
}
