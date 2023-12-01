'use client'
import { ChildProps, Edge, Node, OperationMode } from '@/app/page'
import { Button, Popover, Select, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
import Image from 'next/image'
import GuideIcon from '@/icons/guide.svg'
import { useState } from 'react'

export function GraphTable({
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
  canClear,
  setCanClear,
  totalDistance,
  setTotalDistance,
  runShortestPath,
  runMinimumSpanningTree,
  runCanBipartite,
}: ChildProps) {
  const columns = [
    {
      title: 'Node',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Node) => (
        <a
          onClick={() => {
            setActiveNodeId(record.id)
            setActiveEdgeId(undefined)
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Options',
      width: 100,
      key: 'options',
      align: 'center',
      render: (text: string, record: Node) => (
        <Button
          onClick={() => {
            setNodes((prev) => {
              const { [record.id]: _, ...rest } = prev
              return rest
            })
            setEdges((prev) => {
              const newEdges = Object.values(prev).filter(
                (edge) =>
                  edge.sourceId !== record.id && edge.targetId !== record.id
              )
              return newEdges.reduce((acc, edge) => {
                return {
                  ...acc,
                  [edge.id]: edge,
                }
              }, {})
            })
          }}
        >
          Delete
        </Button>
      ),
    },
  ] as ColumnProps<any>[]

  const clearPaths = () => {
    setNodes((prev) => {
      Object.values(prev).forEach((node) => {
        node.selected = false
      })
      return prev
    })
    setEdges((prev) => {
      Object.values(prev).forEach((edge) => {
        edge.selected = false
      })
      return prev
    })
    setTotalDistance(0)
    setCanClear(false)
  }

  return (
    <div className='w-1/4 h-full p-3 flex flex-col gap-3'>
      <Table
        title={() => <div className='font-bold text-lg'>Adjacency Table</div>}
        dataSource={Object.values(nodes)}
        rowKey={(record) => record.id}
        size='small'
        columns={columns}
        pagination={false}
        className='flex-1 shadow-lg rounded-lg p-2 pt-1 border overflow-scroll'
        expandable={{
          expandedRowRender: (record: Node) => {
            const edgesForNode = Object.values(edges).filter(
              (edge) =>
                edge.sourceId === record.id || edge.targetId === record.id
            )
            return (
              <Table
                size='small'
                dataSource={edgesForNode}
                pagination={false}
                rowKey={(record) => record.id}
                columns={[
                  {
                    title: 'Edge',
                    key: 'edge',
                    render: (_, record: Edge) => (
                      <a
                        onClick={() => {
                          setActiveNodeId(undefined)
                          setActiveEdgeId(record.id)
                        }}
                      >
                        {nodes[record.sourceId].name} -{' '}
                        {nodes[record.targetId].name}
                      </a>
                    ),
                  },
                  {
                    title: 'Weight',
                    dataIndex: 'value',
                    key: 'value',
                    render: (text) => <span>{text}</span>,
                  },
                ]}
              />
            )
          },
          rowExpandable: (record: Node) => {
            // check if this node has any edges
            return Object.values(edges).some(
              (edge) =>
                edge.sourceId === record.id || edge.targetId === record.id
            )
          },
        }}
      />
      <div className='shadow-lg rounded-lg p-3.5 border'>
        <div className='flex justify-between items-center'>
          <div className='font-bold text-lg'>Calculation</div>
          <Popover
            trigger={['click']}
            content={
              <div className='p-1.5 flex flex-col gap-1 w-80 break-words'>
                <div className='font-bold'>User Guide:</div>
                <div className='mt-0.5'>
                  User can select the mode of operation, the speed of the
                  animation, and the source node.
                </div>
                <div className='mt-0.5'>
                  The mode of operation can be one of the following:
                  <ul className='list-disc list-inside'>
                    <li>Shortest Path</li>
                    <li>Minimum Spanning Tree</li>
                  </ul>
                </div>
                <div className='mt-0.5'>
                  The speed of the animation is from 0.1s to 5s. This parameter
                  means the time interval between each step of the animation.
                </div>
                <div className='mt-0.5'>
                  <span className='font-semibold'>Shortest Path Guide:</span>
                  <ol className='list-decimal	list-inside'>
                    <li>Click on the source node</li>
                    <li>Click on the Run button</li>
                    <li>Click on the Clear button to clear the result</li>
                  </ol>
                </div>
                <div className='mt-0.5'>
                  <span className='font-semibold'>
                    Minimum Spanning Tree Guide:
                  </span>

                  <ol className='list-decimal list-inside'>
                    <li>Click on the Run button</li>
                    <li>Click on the Clear button to clear the result</li>
                  </ol>
                </div>
              </div>
            }
          >
            <Image
              src={GuideIcon}
              className='w-5 h-5 opacity-70 cursor-pointer'
              alt='guide'
            />
          </Popover>
        </div>
        <div className='flex w-full justify-center items-center gap-2 mt-2'>
          <div className='mr-2.5'>Mode</div>
          <Select
            className='flex-1'
            value={mode}
            onChange={(value) => {
              setMode(value)
              clearPaths()
            }}
            options={Object.keys(OperationMode).map((mode) => {
              return {
                // SHORTEST_PATH -> Shortest Path
                label: mode
                  .toString()
                  .toLowerCase()
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
                value: mode,
              }
            })}
          />
        </div>
        <div className='flex w-full justify-center items-center gap-2 mt-2'>
          <div className='mr-1'>Speed</div>
          <Select
            className='flex-1'
            value={speed}
            onChange={(value) => {
              setSpeed(value)
            }}
            options={[
              {
                label: '0.1s',
                value: 0.1,
              },
              {
                label: '0.5s',
                value: 0.5,
              },
              {
                label: '1s',
                value: 1,
              },
              {
                label: '2s',
                value: 2,
              },
              {
                label: '5s',
                value: 5,
              },
            ]}
          />
          {canClear ? (
            <Button
              type='primary'
              danger
              className='w-1/2'
              onClick={clearPaths}
            >
              Clear
            </Button>
          ) : (
            <Button
              type='primary'
              className='w-1/2'
              onClick={() => {
                setCanClear(true)
                switch (mode) {
                  case OperationMode.SHORTEST_PATH:
                    runShortestPath()
                    break
                  case OperationMode.MINIMUM_SPANNING_TREE:
                    runMinimumSpanningTree()
                    break
                  // case OperationMode.CAN_BIPARTITE:
                    // runCanBipartite()
                    // break
                }
              }}
            >
              Run
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
