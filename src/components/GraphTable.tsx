'use client'

import { ChildProps } from '@/app/page'
import { Table } from 'antd'

export function GraphTable({ nodes, edges, setNodes, setEdges }: ChildProps) {
  const columns = [
    {
      title: 'Node',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    // {
    //   title: 'Edges',
    //   dataIndex: 'age',
    //   key: 'age',
    // },
  ]

  return (
    <div className='w-1/4 h-full p-3'>
      <Table
        title={() => 'Adjacency Table'}
        dataSource={Object.values(nodes).map((node) => ({
          key: node.id,
          name: node.id,
        }))}
        size='small'
        columns={columns}
        className='h-full shadow-lg bg-zinc-100 rounded-lg overflow-hidden'
      />
    </div>
  )
}
