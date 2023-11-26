'use client'

import uniqid from 'uniqid';
import { ChildProps, Node } from '@/app/page'
import { Button } from 'antd'
import { useRef, useState } from 'react'

export function Viewer({ nodes, edges, setNodes, setEdges }: ChildProps) {
  const activeNodeIdRef = useRef<string>()

  const mouseDownPosition = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const bindMoveEvent = (fn: (e: MouseEvent) => void) => {
    window.addEventListener('mousemove', fn)
    const cancelFn = () => {
      window.removeEventListener('mousemove', fn)
      window.removeEventListener('mouseup', cancelFn)
      document.body.style.cursor = 'default'
    }
    window.addEventListener('mouseup', cancelFn)
  }

  const moveFn = (e: MouseEvent) => {
    if (!activeNodeIdRef.current) return
    e.preventDefault()
    e.stopPropagation()
    document.body.style.cursor = 'move'
    const { x, y } = mouseDownPosition.current
    const dx = e.clientX - x
    const dy = e.clientY - y
    const node = nodes[activeNodeIdRef.current]
    if (!node) return
    setNodes((prev: Record<string, Node>) => {
      return {
        ...prev,
        [node.id]: {
          ...node,
          x: node.x + dx,
          y: node.y + dy,
        },
      }
    })
  }

  const activeMoveEvent = (e: any, nodeId: string) => {
    activeNodeIdRef.current = nodeId
    if (e.button === 0) {
      // left click
      e.preventDefault()
      mouseDownPosition.current = {
        x: e.clientX,
        y: e.clientY,
      }
      bindMoveEvent(moveFn)
    }
  }

  const svgRef = useRef<SVGSVGElement>(null)

  return (
    <div className='flex-1 h-full relative'>
      <svg
        className='h-full w-full'
        ref={svgRef}
        width={svgRef.current?.clientWidth}
        height={svgRef.current?.clientHeight}
        // preserveAspectRatio='none'
      >
        {/* <defs>
          <marker
            id='arrow'
            viewBox='0 0 10 10'
            refX='5'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto-start-reverse'
          >
            <path d='M 0 0 L 10 5 L 0 10 z' />
          </marker>
        </defs> */}

        {Object.values(edges).map((edge) => {
          const { sourceId, targetId } = edge
          const sourceNode = nodes[sourceId]
          const targetNode = nodes[targetId]
          if (!sourceNode || !targetNode) return null
          const { x: x1, y: y1 } = sourceNode
          const { x: x2, y: y2 } = targetNode
          return (
            <svg key={edge.id}>
              <text
                x={(x1 + x2) / 2 + 2}
                y={(y1 + y2) / 2}
                fontSize='15'
                fontFamily='sans-serif'
                className='select-none'
              >
                {edge.value}
              </text>
              <line
                key={edge.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke='black'
                strokeWidth='2'
                markerEnd='url(#arrow)'
              />
            </svg>
          )
        })}

        {Object.values(nodes).map((node) => {
          const { x, y } = node
          return (
            <svg
              key={node.id}
              className='group cursor-pointer'
              onMouseDown={(e) => activeMoveEvent(e, node.id)}
              onClick={() => {
                if (!activeNodeIdRef.current) {
                  activeNodeIdRef.current = node.id
                } else {
                  const edge = {
                    id: uniqid(),
                    sourceId: activeNodeIdRef.current,
                    targetId: node.id,
                    value: 1,
                  }
                  // check if edge already exists
                  if (
                    Object.values(edges).some(
                      (e) =>
                        (e.sourceId === activeNodeIdRef.current &&
                          e.targetId === node.id) ||
                        (e.sourceId === node.id &&
                          e.targetId === activeNodeIdRef.current)
                    )
                  )
                    return
                  // add edge
                  setEdges((prev) => ({
                    ...prev,
                    [edge.id]: edge,
                  }))
                }
              }}
            >
              <circle
                cx={x}
                cy={y}
                r='20'
                stroke='black'
                fill='white'
                strokeWidth='2'
                className='group-hover:stroke-[0.7px] group-hover:stroke-blue-400'
              />
              {activeNodeIdRef.current === node.id && (
                <circle
                  cx={x}
                  cy={y}
                  r='22'
                  stroke='yellow'
                  fill='none'
                  strokeWidth='3'
                />
              )}
              <text
                x={x}
                y={y}
                text-anchor='middle'
                alignment-baseline='middle'
                font-size='14'
                font-family='sans-serif'
                className='group-hover:font-bold group-hover:fill-blue-400 select-none'
              >
                {node.id}
              </text>
            </svg>
          )
        })}
      </svg>
      <Button
        className='absolute bottom-3 right-3'
        onClick={() => {
          const node = {
            id: uniqid(),
            x: Math.random() * svgRef.current!.clientWidth,
            y: Math.random() * svgRef.current!.clientHeight,
          }
          setNodes((prev) => ({
            ...prev,
            [node.id]: node,
          }))
        }}
      >
        Add Node
      </Button>
    </div>
  )
}
