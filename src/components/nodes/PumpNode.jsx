import NodeShell from "./NodeShell";
import PumpOn from "../../images/pump-on.png";
import PumpOff from "../../images/pump-off.png";

function PumpGraphic({ running }) {
  return (
    <div className={`pump-graphic ${running ? "running" : ""}`}>
      <img
        style={{
          width: "60px",
        }}
        src={running ? PumpOn : PumpOff}
        alt={running ? "Pump On" : "PumpOff"}
      />
    </div>
  );
}

export default function PumpNode({ data, selected }) {
  const running = data.status === "ON";
  const stopped = data.status === "OFF";
  const maintainence = data.status ==="MAINTENANCE";
  
  return (
    <NodeShell
      title={data.label}
      status={data.status}
      className={`pump-node ${selected ? "selected-node" : ""}`}
    >
      <PumpGraphic running={running} />
      <div className="node-metrics">
        <span>Motor</span>
        <strong>{running ? "RUNNING" : "STOPPED"}</strong>
      </div>
    </NodeShell>
  );
}
