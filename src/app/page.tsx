'use client';

import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { GraphTable } from '../components/GraphTable'
import { Viewer } from '../components/Viewer'

export interface Node {
  id: string
  x: number
  y: number
}

export interface Edge {
  id: string
  sourceId: string
  targetId: string
  value: number
}

export interface ChildProps {
  nodes: Record<string, Node>
  edges: Record<string, Edge>
  setNodes: Dispatch<SetStateAction<Record<string, Node>>>
  setEdges: Dispatch<SetStateAction<Record<string, Edge>>>
}

export default function Home() {

  const [nodes, setNodes] = useState<Record<string, Node>>({})
  const [edges, setEdges] = useState<Record<string, Edge>>({})

  const props: ChildProps = {
    nodes,
    edges,
    setNodes,
    setEdges,
  }

  return (
    <main className='h-screen w-screen flex bg-white'>
      <GraphTable {...props} />
      <Viewer {...props} />
    </main>
  )
}
