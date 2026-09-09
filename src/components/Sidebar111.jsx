const devices = [
  { type: 'pump', label: 'Pump', icon: '⚙' },
  { type: 'sump', label: 'Sump / Tank', icon: '▰' },
  { type: 'valve', label: 'Valve', icon: '◆' },
]

export default function Sidebar() {
  const onDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">IO</div>
        <div>
          <h1>SCADA Designer</h1>
          <p>Drag a device to the canvas</p>
        </div>
      </div>

      <div className="device-section">
        <div className="section-title">DEVICES</div>
        {devices.map((device) => (
          <div
            key={device.type}
            className="device-card"
            draggable
            onDragStart={(event) => onDragStart(event, device.type)}
          >
            <div className={`device-icon ${device.type}`}>{device.icon}</div>
            <div>
              <strong>{device.label}</strong>
              <span>Drag to canvas</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-help">
        <strong>Connections</strong>
        <p>Drag from a blue output handle to another device's input handle.</p>
      </div>
    </aside>
  )
}
