import { Dispatch, SetStateAction } from "react"

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
