'use client'

import uniqid from 'uniqid'
import { ChildProps, Node } from '@/app/page'
import { Button, Dropdown, InputNumber, MenuProps } from 'antd'
import { useRef, useState } from 'react'

export function Viewer({
  nodes,
  edges,
  setNodes,
  setEdges,
  activeNodeId,
  setActiveNodeId,
  activeEdgeId,
  setActiveEdgeId,
}: ChildProps) {
  const activeNodeIdRef = useRef<string>() // for dragging

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

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => {
        if (activeEdgeId) {
          setEdges((prev) => {
            const { [activeEdgeId]: _, ...rest } = prev
            return rest
          })
          setActiveEdgeId(undefined)
        }
        if (activeNodeId) {
          setNodes((prev) => {
            const { [activeNodeId]: _, ...rest } = prev
            return rest
          })
          setActiveNodeId(undefined)
        }
      },
    },
  ]

  return (
    <Dropdown
      trigger={['contextMenu']}
      menu={{
        items: menuItems,
      }}
    >
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
              <svg key={edge.id} className='cursor-pointer relative'>
                <line
                  key={edge.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={activeEdgeId === edge.id ? 'yellow' : 'black'}
                  strokeWidth='2'
                  markerEnd='url(#arrow)'
                  onClick={() => {
                    setActiveNodeId(undefined)
                    setActiveEdgeId(edge.id)
                  }}
                />
                {activeEdgeId === edge.id ? (
                  <foreignObject
                    width='300'
                    height='30'
                    className='absolute z-[999]'
                    x={(x1 + x2) / 2 - 20}
                    y={(y1 + y2) / 2 - 20}
                    onBlur={() => {
                      setActiveEdgeId(undefined)
                    }}
                  >
                    <InputNumber
                      type='number'
                      className=''
                      bordered={false}
                      value={edge.value}
                      onChange={(e) => {
                        setEdges((prev) => ({
                          ...prev,
                          [edge.id]: {
                            ...edge,
                            value: e!,
                          },
                        }))
                      }}
                    />
                  </foreignObject>
                ) : (
                  <text
                    x={(x1 + x2) / 2 + 2}
                    y={(y1 + y2) / 2}
                    fontSize='15'
                    fontFamily='sans-serif'
                    className='select-none'
                    onClick={() => {
                      setActiveNodeId(undefined)
                      setActiveEdgeId(edge.id)
                    }}
                  >
                    {edge.value}
                  </text>
                )}
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
                  if (!activeNodeId) {
                    setActiveEdgeId(undefined)
                    setActiveNodeId(node.id)
                  } else {
                    // check if active node is clicked
                    if (activeNodeId === node.id) {
                      setActiveNodeId(undefined)
                      return
                    }
                    // create edge
                    const edge = {
                      id: uniqid(),
                      sourceId: activeNodeId,
                      targetId: node.id,
                      value: 1,
                    }
                    // check if edge already exists
                    if (
                      Object.values(edges).some(
                        (e) =>
                          (e.sourceId === activeNodeId &&
                            e.targetId === node.id) ||
                          (e.sourceId === node.id &&
                            e.targetId === activeNodeId)
                      )
                    ) {
                      setActiveEdgeId(undefined)
                      setActiveNodeId(node.id)
                      return
                    }
                    // add edge
                    setEdges((prev) => ({
                      ...prev,
                      [edge.id]: edge,
                    }))
                    setActiveNodeId(undefined)
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
                {activeNodeId === node.id && (
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
                  textAnchor='middle'
                  alignmentBaseline='middle'
                  fontSize='14'
                  fontFamily='sans-serif'
                  className='group-hover:font-bold group-hover:fill-blue-400 select-none'
                >
                  {node.name}
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
              name: `${Number(Object.values(nodes).at(-1)?.name ?? 0) + 1}`,
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
    </Dropdown>
  )
}
