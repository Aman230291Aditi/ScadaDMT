import NodeShell from './NodeShell'

export default function ValveNode({ data, selected }) {
  const open = data.status === 'OPEN'

  return (
    <NodeShell
      title={data.label}
      status={data.status}
      className={`valve-node ${selected ? 'selected-node' : ''}`}
    >
      <div className={`valve-graphic ${open ? 'open' : 'closed'}`}>
        <div className="valve-pipe" />
        <div className="valve-diamond left" />
        <div className="valve-diamond right" />
        <div className="valve-stem" />
        <div className="valve-wheel">✣</div>
      </div>
      <div className="node-metrics">
        <span>Position</span>
        <strong>{open ? 'OPEN' : 'CLOSED'}</strong>
      </div>
    </NodeShell>
  )
}
