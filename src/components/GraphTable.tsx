'use client'

import { ChildProps, Edge, Node } from '@/app/page'
import { Button, Table } from 'antd'
import { ColumnProps } from 'antd/es/table'

export function GraphTable({
  nodes,
  edges,
  setNodes,
  setEdges,
  activeNodeId,
  setActiveNodeId,
  activeEdgeId,
  setActiveEdgeId,
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
      render: (text: string, record: any) => (
        <Button
          onClick={() => {
            setNodes((prev) => {
              const { [record.key]: omit, ...rest } = prev
              return rest
            })
            setEdges((prev) => {
              const newEdges = Object.values(prev).filter(
                (edge) =>
                  edge.sourceId !== record.key && edge.targetId !== record.key
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
    <div className='w-1/5 h-full p-3 overflow-scroll'>
      <Table
        title={() => <div className='font-bold text-lg'>Adjacency Table</div>}
        dataSource={Object.values(nodes)}
        rowKey={(record) => record.id}
        size='small'
        columns={columns}
        pagination={false}
        className='h-full shadow-lg rounded-lg p-2 pt-1 border '
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
    </div>
  )
}
