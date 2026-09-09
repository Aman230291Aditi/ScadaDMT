import { Handle, Position } from "@xyflow/react";

export default function NodeShell({ children, title, status, className = "" }) {
  console.log("children", children);
  console.log("title", title);
  console.log("status", status);
  console.log("className", className);
  return (
    <div className={`scada-node ${className}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="io-handle io-input"
      />

      <div className="node-header">
        <span>{title}</span>
        {status && (
          <span className={`status-badge status-${status.toLowerCase()}`}>
            {status}
          </span>
        )}
      </div>

      {children}

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="io-handle io-output"
      />
    </div>
  );
}
