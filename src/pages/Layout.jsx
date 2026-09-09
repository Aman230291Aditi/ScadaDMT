import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
} from "@xyflow/react";

import { useNavigate, useParams } from "react-router-dom";

import ComponentsSidebar from "../components/ComponentsSidebar";

import PumpNode from "../components/nodes/PumpNode";
import SumpNode from "../components/nodes/SumpNode";
import ValveNode from "../components/nodes/ValveNode";
// import TankNode from "../components/nodes/TankNode";
// import MotorNode from "../components/nodes/MotorNode";
// import SensorNode from "../components/nodes/SensorNode";

const STORAGE_KEY = "scada-layouts";

/* =========================================================
   DEFAULT COMPONENT DATA
========================================================= */

const componentDefaults = {
  sump: (index) => ({
    label: `SUMP-${String(index).padStart(2, "0")}`,
    level: 50,
  }),

  pump: (index) => ({
    label: `PUMP-${String(index).padStart(2, "0")}`,
    status: "OFF",
  }),

  valve: (index) => ({
    label: `VALVE-${String(index).padStart(2, "0")}`,
    status: "CLOSED",
  }),

  tank: (index) => ({
    label: `TANK-${String(index).padStart(2, "0")}`,
    level: 50,
  }),

  motor: (index) => ({
    label: `MOTOR-${String(index).padStart(2, "0")}`,
    status: "OFF",
  }),

  sensor: (index) => ({
    label: `SENSOR-${String(index).padStart(2, "0")}`,
    value: 0,
  }),
};

/* =========================================================
   DESIGNER
========================================================= */

function Designer() {
  const navigate = useNavigate();

  const { layoutId } = useParams();

  const wrapperRef = useRef(null);

  const fileInputRef = useRef(null);

  const [rfInstance, setRfInstance] = useState(null);

  const [layoutName, setLayoutName] = useState("");

  const [description, setDescription] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  /* =====================================================
     NODE TYPES
  ===================================================== */

  const nodeTypes = useMemo(
    () => ({
      sump: SumpNode,
      pump: PumpNode,
      valve: ValveNode,
      //   tank: TankNode,
      //   motor: MotorNode,
      //   sensor: SensorNode,
    }),
    [],
  );

  /* =====================================================
     SELECTED NODE
  ===================================================== */

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) || null;

  /* =====================================================
     LOAD EXISTING LAYOUT
  ===================================================== */

  useEffect(() => {
    /*
     * NEW LAYOUT
     */

    if (!layoutId) {
      setLayoutName("");
      setDescription("");

      setNodes([]);
      setEdges([]);

      setSelectedNodeId(null);

      return;
    }

    /*
     * EXISTING LAYOUT
     */

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      navigate("/layouts");

      return;
    }

    try {
      const layouts = JSON.parse(stored);

      const layout = layouts.find((item) => item.id === layoutId);

      if (!layout) {
        navigate("/layouts");

        return;
      }

      setLayoutName(layout.name || "");

      setDescription(layout.description || "");

      setNodes(Array.isArray(layout.nodes) ? layout.nodes : []);

      setEdges(Array.isArray(layout.edges) ? layout.edges : []);

      setSelectedNodeId(null);

      /*
       * Fit view after loading
       */

      setTimeout(() => {
        if (rfInstance) {
          rfInstance.fitView({
            padding: 0.2,
          });
        }
      }, 100);
    } catch (error) {
      console.error("Could not load layout:", error);

      navigate("/layouts");
    }
  }, [layoutId, navigate, setNodes, setEdges]);

  /* =====================================================
     CONNECT NODES
  ===================================================== */

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,

            type: "smoothstep",

            animated: true,

            markerEnd: {
              type: MarkerType.ArrowClosed,
            },

            style: {
              strokeWidth: 2,
            },
          },

          currentEdges,
        ),
      );
    },
    [setEdges],
  );

  /* =====================================================
     DRAG OVER
  ===================================================== */

  const onDragOver = useCallback((event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  }, []);

  /* =====================================================
     DROP COMPONENT
  ===================================================== */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!rfInstance) return;

      const type = event.dataTransfer.getData("application/reactflow");

      if (!componentDefaults[type]) return;

      // Calculate drop position
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Count existing components
      const count = nodes.filter((node) => node.type === type).length + 1;

      // Default suggested name
      const defaultName = componentDefaults[type](count).label;

      // Ask user for name
      const componentName = window.prompt(`Enter ${type} name:`, defaultName);

      // Cancel
      if (!componentName || !componentName.trim()) {
        return;
      }

      // Create node
      const newNode = {
        id: `${type}-${Date.now()}`,

        type,

        position,

        data: {
          ...componentDefaults[type](count),

          label: componentName.trim(),
        },
      };

      // Add node
      setNodes((currentNodes) => [...currentNodes, newNode]);
    },
    [rfInstance, nodes, setNodes],
  );

  /* =====================================================
     NODE CLICK
  ===================================================== */

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  /* =====================================================
     DOUBLE CLICK RENAME
  ===================================================== */

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      const newName = window.prompt(
        "Enter new node name:",
        node.data?.label || "",
      );

      if (!newName || !newName.trim()) {
        return;
      }

      setNodes((currentNodes) =>
        currentNodes.map((item) =>
          item.id === node.id
            ? {
                ...item,

                data: {
                  ...item.data,

                  label: newName.trim(),
                },
              }
            : item,
        ),
      );
    },
    [setNodes],
  );

  /* =====================================================
     DELETE SELECTED NODE
  ===================================================== */

  const removeSelected = useCallback(() => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== selectedNodeId),
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    );

    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  /* =====================================================
     CLEAR CANVAS
  ===================================================== */

  const clearCanvas = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    const confirmed = window.confirm("Clear all devices and connections?");

    if (!confirmed) {
      return;
    }

    setNodes([]);

    setEdges([]);

    setSelectedNodeId(null);
  }, [nodes.length, edges.length, setNodes, setEdges]);

  /* =====================================================
     SAVE LAYOUT
  ===================================================== */

  const saveLayout = useCallback(() => {
    if (!layoutName.trim()) {
      window.alert("Please enter layout name.");

      return;
    }

    setIsSaving(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      let layouts = [];

      try {
        layouts = stored ? JSON.parse(stored) : [];
      } catch {
        layouts = [];
      }

      /*
       * UPDATE EXISTING
       */

      if (layoutId) {
        layouts = layouts.map((layout) =>
          layout.id === layoutId
            ? {
                ...layout,

                name: layoutName.trim(),

                description: description.trim(),

                nodes,

                edges,

                savedAt: new Date().toISOString(),
              }
            : layout,
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));

        window.alert("Layout updated successfully.");

        navigate("/layouts");

        return;
      }

      /*
       * CREATE NEW
       */

      const newId = `LAYOUT-${Date.now()}`;

      const newLayout = {
        id: newId,

        name: layoutName.trim(),

        description: description.trim(),

        nodes,

        edges,

        savedAt: new Date().toISOString(),
      };

      layouts.push(newLayout);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));

      /*
       * Open newly created layout
       */

      navigate(`/layouts/${newId}`);
    } finally {
      setIsSaving(false);
    }
  }, [layoutId, layoutName, description, nodes, edges, navigate]);

  /* =====================================================
     EXPORT JSON
  ===================================================== */

  const exportJson = useCallback(() => {
    const flow = {
      version: 1,

      id: layoutId || null,

      name: layoutName,

      description,

      nodes,

      edges,

      savedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(flow, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = `${layoutName || "scada-layout"}.json`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
  }, [layoutId, layoutName, description, nodes, edges]);

  /* =====================================================
     IMPORT JSON
  ===================================================== */

  const importJson = useCallback(
    async (event) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const text = await file.text();

        const flow = JSON.parse(text);

        if (!Array.isArray(flow.nodes) || !Array.isArray(flow.edges)) {
          throw new Error("Invalid SCADA layout JSON.");
        }

        setNodes(flow.nodes);

        setEdges(flow.edges);

        if (flow.name) {
          setLayoutName(flow.name);
        }

        if (flow.description) {
          setDescription(flow.description);
        }

        setSelectedNodeId(null);

        setTimeout(() => {
          if (rfInstance) {
            rfInstance.fitView({
              padding: 0.2,
            });
          }
        }, 100);
      } catch (error) {
        window.alert(`Could not import JSON: ${error.message}`);
      } finally {
        event.target.value = "";
      }
    },
    [rfInstance, setNodes, setEdges],
  );

  /* =====================================================
     FIT VIEW
  ===================================================== */

  const fitView = () => {
    rfInstance?.fitView({
      padding: 0.2,
      duration: 500,
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* =================================================
          TOP TOOLBAR
      ================================================= */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate("/layouts")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            ← Back
          </button>

          <div className="h-8 w-px bg-slate-200" />

          <div className="min-w-0">
            <input
              value={layoutName}
              onChange={(event) => setLayoutName(event.target.value)}
              placeholder="Layout name"
              className="w-64 border-none bg-transparent p-0 text-base font-bold text-slate-800 outline-none"
            />

            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add description..."
              className="block w-72 border-none bg-transparent p-0 text-xs text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2">
          {/* Import */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={importJson}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Import
          </button>

          {/* Export */}

          <button
            onClick={exportJson}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Export
          </button>

          {/* Fit */}

          <button
            onClick={fitView}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Fit View
          </button>

          {/* Delete */}

          <button
            onClick={removeSelected}
            disabled={!selectedNodeId}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>

          {/* Clear */}

          <button
            onClick={clearCanvas}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>

          {/* Save */}

          <button
            onClick={saveLayout}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Layout"}
          </button>
        </div>
      </header>

      {/* =================================================
          DESIGNER BODY
      ================================================= */}

      <div className="flex min-h-0 flex-1">
        {/* =================================================
            COMPONENT SIDEBAR
        ================================================= */}

        <ComponentsSidebar />

        {/* =================================================
            REACT FLOW
        ================================================= */}

        <div ref={wrapperRef} className="relative min-w-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onPaneClick={() => setSelectedNodeId(null)}
            snapToGrid
            snapGrid={[20, 20]}
            deleteKeyCode={["Backspace", "Delete"]}
            connectionLineStyle={{
              strokeWidth: 2,
            }}
            defaultEdgeOptions={{
              type: "smoothstep",

              animated: true,

              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            }}
            minZoom={0.05}
            maxZoom={3}
            fitView
            fitViewOptions={{
              padding: 0.2,
            }}
          >
            {/* Background */}

            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />

            {/* Controls */}

            <Controls showZoom showFitView showInteractive />

            {/* Mini Map */}

            <MiniMap pannable zoomable className="!bottom-4 !right-4" />
          </ReactFlow>

          {/* =================================================
              EMPTY CANVAS MESSAGE
          ================================================= */}

          {nodes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl">🏭</div>

                <h2 className="mt-4 text-lg font-semibold text-slate-600">
                  Start designing your plant
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Drag a component from the left panel onto the canvas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Layout
========================================================= */

export default function Layout() {
  return (
    <ReactFlowProvider>
      <Designer />
    </ReactFlowProvider>
  );
}
