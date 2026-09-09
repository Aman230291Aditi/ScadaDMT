export default function Toolbar({
  onSave,
  onLoadClick,
  onClear,
  onToggleSelectedPump,
  onRemoveSelected,
  selectedNode,
}) {
  const pumpSelected = selectedNode?.type === 'pump'

  return (
    <div className="toolbar">
      <div className="toolbar-title">
        <strong>Plant Layout</strong>
        <span>{selectedNode ? `Selected: ${selectedNode.data.label}` : 'Select a device to edit it'}</span>
      </div>

      <div className="toolbar-actions">
        {selectedNode && (
          <button className="btn btn-danger" onClick={onRemoveSelected}>
            Remove Device
          </button>
        )}
        {pumpSelected && (
          <button className="btn btn-primary" onClick={onToggleSelectedPump}>
            Toggle Pump {selectedNode.data.status === 'ON' ? 'OFF' : 'ON'}
          </button>
        )}
        <button className="btn" onClick={onSave}>Save JSON</button>
        <button className="btn" onClick={onLoadClick}>Load JSON</button>
        <button className="btn btn-danger" onClick={onClear}>Clear</button>
      </div>
    </div>
  )
}
