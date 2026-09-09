# React Flow SCADA Starter

A Vite + React + React Flow starter for building a simple SCADA-style visual designer.

## Features

- Drag Pump, Sump/Tank, and Valve from the left sidebar
- Custom React Flow nodes
- Connect devices using input/output handles
- Pump ON/OFF animation
- Animated pipe/flow edges
- Select a pump and toggle it ON/OFF
- Save the layout to JSON
- Load the layout back from JSON
- Remove a selected device with the Remove Device button or Delete/Backspace
- Grid snapping, minimap, zoom and pan controls

## Run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Replace the pump graphic with your own PNG/SVG

Open:

`src/components/nodes/PumpNode.jsx`

Replace `<PumpGraphic />` with something like:

```jsx
<img
  src={data.status === 'ON' ? '/images/pump-on.png' : '/images/pump-off.png'}
  alt={data.label}
/>
```

Put your images inside:

`public/images/`

## Suggested next upgrades

- Properties panel for changing tag names, device IDs and I/O addresses
- Modbus / OPC UA / WebSocket data mapping
- Multiple input/output handles
- Pipe-specific custom edges with stronger water-flow animation
- Device templates loaded from JSON
- Undo / redo
- Autosave to backend
- User authentication and plant/project management


## Device removal

Select any Pump, Sump/Tank, or Valve and click **Remove Device** in the toolbar. Connected edges are removed automatically. You can also select a device and press **Delete** or **Backspace**.

The UI uses a light theme by default.
