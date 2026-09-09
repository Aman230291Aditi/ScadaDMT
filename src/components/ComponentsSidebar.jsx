import React from "react";

const components = [
  {
    type: "sump",
    name: "Sump",
    icon: "💧",
    description: "Water collection",
  },
  {
    type: "pump",
    name: "Pump",
    icon: "⚙️",
    description: "Water pump",
  },
  {
    type: "valve",
    name: "Valve",
    icon: "🔧",
    description: "Flow control",
  },
  {
    type: "tank",
    name: "Tank",
    icon: "🛢️",
    description: "Water storage",
  },
  {
    type: "motor",
    name: "Motor",
    icon: "⚡",
    description: "Motor unit",
  },
  {
    type: "sensor",
    name: "Sensor",
    icon: "📡",
    description: "Plant sensor",
  },
];

export default function Sidebar() {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData("application/reactflow", type);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Header */}

      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg text-white">
            ⚡
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">Components</h2>

            <p className="text-xs text-slate-400">SCADA Devices</p>
          </div>
        </div>
      </div>

      {/* Search */}

      <div className="border-b border-slate-100 p-3">
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3">
          <span className="mr-2 text-sm text-slate-400">🔍</span>

          <input
            type="text"
            placeholder="Search component"
            className="w-full bg-transparent py-2 text-xs outline-none"
          />
        </div>
      </div>

      {/* Component list */}

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Plant Components
        </div>

        <div className="space-y-2">
          {components.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(event) => handleDragStart(event, component.type)}
              className="group flex cursor-grab items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm active:cursor-grabbing"
            >
              {/* Icon */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xl transition group-hover:bg-white">
                {component.icon}
              </div>

              {/* Text */}

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-700">
                  {component.name}
                </div>

                <div className="mt-0.5 text-[11px] text-slate-400">
                  {component.description}
                </div>
              </div>

              {/* Drag icon */}

              <div className="text-slate-300 group-hover:text-blue-400">⋮⋮</div>
            </div>
          ))}
        </div>

        {/* Connection information */}

        <div className="mt-5 rounded-xl bg-blue-50 p-3">
          <div className="flex items-start gap-2">
            <span className="text-sm">💡</span>

            <div>
              <div className="text-xs font-semibold text-blue-700">
                Connect devices
              </div>

              <p className="mt-1 text-[11px] leading-4 text-blue-600">
                Drag a device onto the canvas, then connect the handles to
                create a pipe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>SCADA Designer</span>

          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
}
