import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "@xyflow/react";

import { useNavigate, useParams } from "react-router-dom";

import PumpNode from "../components/nodes/PumpNode";
import SumpNode from "../components/nodes/SumpNode";
import ValveNode from "../components/nodes/ValveNode";

const STORAGE_KEY = "scada-layouts";
function DetailRow({ label, value, status = false }) {
  const isOn =
    String(value).toUpperCase() === "ON" ||
    String(value).toUpperCase() === "OPEN" ||
    String(value).toUpperCase() === "RUNNING";

  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
      <span className="text-xs text-slate-500">{label}</span>

      {status ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={`h-2 w-2 rounded-full ${
              isOn ? "bg-emerald-500" : "bg-red-500"
            }`}
          />

          <span className={isOn ? "text-emerald-600" : "text-red-600"}>
            {value}
          </span>
        </span>
      ) : (
        <span className="text-xs font-semibold text-slate-700">{value}</span>
      )}
    </div>
  );
}
function ViewOnlyDesigner() {
  const navigate = useNavigate();
  const { layoutId } = useParams();

  const [rfInstance, setRfInstance] = useState(null);
  const [layout, setLayout] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const nodeTypes = useMemo(
    () => ({
      sump: SumpNode,
      pump: PumpNode,
      valve: ValveNode,
    }),
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      navigate("/layouts");
      return;
    }

    try {
      const layouts = JSON.parse(stored);

      const foundLayout = layouts.find((item) => item.id === layoutId);

      if (!foundLayout) {
        navigate("/layouts");
        return;
      }

      setLayout(foundLayout);
    } catch (error) {
      console.error("Could not load layout:", error);
      navigate("/layouts");
    }
  }, [layoutId, navigate]);

  useEffect(() => {
    if (!rfInstance || !layout) return;

    requestAnimationFrame(() => {
      rfInstance.fitView({
        padding: 0.2,
        duration: 500,
      });
    });
  }, [rfInstance, layout]);

  if (!layout) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">Loading layout...</div>
      </div>
    );
  }

  const handleNodeClick = (_, node) => {
    console.log(node);
    setSelectedNode(node);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col bg-slate-100">
      {/* View Only Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={() => navigate("/layouts")}
            className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Icon icon="mdi:arrow-left" width="15" height="15" /> Back
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-slate-800">
              {layout.name}
            </h1>

            {layout.description && (
              <p className="truncate text-xs text-slate-400">
                {layout.description}
              </p>
            )}
          </div>
        </div>

        {/* View Only Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />

            <span className="text-xs font-semibold text-amber-700">
              VIEW ONLY
            </span>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="relative min-h-0 flex-1">
        <ReactFlow
          nodes={layout.nodes || []}
          edges={layout.edges || []}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onInit={setRfInstance}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          edgesFocusable={false}
          nodesFocusable={true}
          panOnDrag
          zoomOnScroll={true}
          zoomOnPinch={true}
          zoomOnDoubleClick
          preventScrolling={true}
          minZoom={0.05}
          maxZoom={3}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          proOptions={{
            hideAttribution: false,
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />

          <Controls showZoom showFitView showInteractive={false} />

          <MiniMap pannable zoomable className="!bottom-4 !right-4" />
        </ReactFlow>

        {/* View Only Overlay */}
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-sm">👁️</span>

            <div>
              <div className="text-xs font-semibold text-slate-700">
                View Only
              </div>

              <div className="text-[10px] text-slate-400">
                Pan and zoom to inspect plant
              </div>
            </div>
          </div>
        </div>

        {selectedNode && (
          <div className="absolute right-4 top-4 z-20 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {selectedNode.type}
                </div>

                <h3 className="mt-1 text-base font-bold text-slate-800">
                  {selectedNode.data?.label}
                </h3>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-4">
              {selectedNode.type === "pump" && (
                <div className="space-y-3">
                  <DetailRow
                    label="Status"
                    value={selectedNode.data?.status || "OFF"}
                    status
                  />

                  <DetailRow
                    label="Type"
                    value={selectedNode.data?.type || "Centrifugal Pump"}
                  />

                  <DetailRow
                    label="Flow Rate"
                    value={`${selectedNode.data?.flowRate ?? 0} m³/h`}
                  />

                  <DetailRow
                    label="Pressure"
                    value={`${selectedNode.data?.pressure ?? 0} bar`}
                  />

                  <DetailRow
                    label="Speed"
                    value={`${selectedNode.data?.speed ?? 0} RPM`}
                  />

                  <DetailRow
                    label="Power"
                    value={`${selectedNode.data?.power ?? 0} kW`}
                  />

                  <DetailRow
                    label="Temperature"
                    value={`${selectedNode.data?.temperature ?? 0} °C`}
                  />
                </div>
              )}

              {selectedNode.type === "sump" && (
                <div className="space-y-3">
                  <DetailRow
                    label="Water Level"
                    value={`${selectedNode.data?.level ?? 0}%`}
                  />

                  <DetailRow
                    label="Capacity"
                    value={`${selectedNode.data?.capacity ?? 0} L`}
                  />

                  <DetailRow
                    label="Current Volume"
                    value={`${selectedNode.data?.waterLevel ?? 0} L`}
                  />

                  <DetailRow
                    label="Inlet Flow"
                    value={`${selectedNode.data?.inletFlow ?? 0} m³/h`}
                  />

                  <DetailRow
                    label="Outlet Flow"
                    value={`${selectedNode.data?.outletFlow ?? 0} m³/h`}
                  />
                </div>
              )}

              {selectedNode.type === "valve" && (
                <div className="space-y-3">
                  <DetailRow
                    label="Status"
                    value={selectedNode.data?.status || "CLOSED"}
                    status
                  />

                  <DetailRow
                    label="Type"
                    value={selectedNode.data?.type || "Butterfly Valve"}
                  />

                  <DetailRow
                    label="Flow Rate"
                    value={`${selectedNode.data?.flowRate ?? 0} m³/h`}
                  />

                  <DetailRow
                    label="Pressure"
                    value={`${selectedNode.data?.pressure ?? 0} bar`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewLayout() {
  return (
    <ReactFlowProvider>
      <ViewOnlyDesigner />
    </ReactFlowProvider>
  );
}
