'use client'

import { ChildProps, Edge, Node, OperationMode } from '@/app/page'
import { Button, Select, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'
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
  runShortestPath,
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
                    title: 'Value',
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
        <div className='font-bold text-lg'>Calculation</div>
        <div className='flex w-full justify-center items-center gap-2 mt-2'>
          <div className='mr-2.5'>Mode</div>
          <Select
            className='flex-1'
            value={mode}
            onChange={(value) => {
              setMode(value)
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
          <Button
            type='primary'
            className='w-1/2'
            onClick={runShortestPath}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  )
}
