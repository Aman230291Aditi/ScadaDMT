import NodeShell from './NodeShell'

export default function SumpNode({ data, selected }) {
   console.log(data);
  const level = Math.max(0, Math.min(100, Number(data.level ?? 65)))
 

  return (
    <NodeShell
      title={data.label}
      className={`sump-node ${selected ? 'selected-node' : ''}`}
    >
      <div className="tank">
        <div className="tank-water" style={{ height: `${level}%` }}>
          <div className="water-wave" />
        </div>
        <span className="tank-level">{level}%</span>
      </div>
      <div className="node-metrics">
        <span>Level</span>
        <strong>{level}%</strong>
      </div>
    </NodeShell>
  )
}
