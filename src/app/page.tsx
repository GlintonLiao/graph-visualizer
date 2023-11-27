'use client'

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { GraphTable } from '../components/GraphTable'
import { Viewer } from '../components/Viewer'

export interface Node {
  id: string
  name: string
  x: number
  y: number
  selected: boolean
}

export interface Edge {
  id: string
  sourceId: string
  targetId: string
  value: number
  selected: boolean
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

  const runShortestPath = () => {
    // TODO
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
  }

  return (
    <main className='h-screen w-screen flex bg-white'>
      <GraphTable {...props} />
      <Viewer {...props} />
    </main>
  )
}
