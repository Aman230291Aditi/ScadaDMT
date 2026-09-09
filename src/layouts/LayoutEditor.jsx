import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PumpNode from "../components/nodes/PumpNode";
import SumpNode from "../components/nodes/SumpNode";
import ValveNode from "../components/nodes/ValveNode";

const nodeTypes = {
  pump: PumpNode,
  sump: SumpNode,
  valve: ValveNode,
};

export default function LayoutEditor() {
  const navigate = useNavigate();
  const { layoutId } = useParams();
  const isNewLayout = !layoutId;

  // ==================================================
  // LAYOUT DETAILS
  // ==================================================
  const [name, setName] = useState(isNewLayout ? "" : "Main Water Plant");
  const [description, setDescription] = useState(
    isNewLayout ? "" : "Main water treatment plant",
  );

  // ==================================================
  // COMPONENT MODAL
  // ==================================================

  const [showModal, setShowModal] = useState(false);
  const [componentType, setComponentType] = useState("pump");
  const [componentName, setComponentName] = useState("");
  const [componentId, setComponentId] = useState("");

  // ==================================================
  // REACT FLOW
  // ==================================================

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ==================================================
  // CONNECT
  // ==================================================

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
          },
          currentEdges,
        ),
      );
    },
    [setEdges],
  );

  // ==================================================
  // OPEN COMPONENT MODAL
  // ==================================================

  const openComponentModal = (type) => {
    setComponentType(type);

    setComponentName("");

    setComponentId("");

    setShowModal(true);
  };

  // ==================================================
  // ADD NODE
  // ==================================================

  const addComponent = () => {
    if (!componentName.trim()) {
      alert("Enter component name");
      return;
    }

    if (!componentId.trim()) {
      alert("Enter component ID");
      return;
    }

    const exists = nodes.some((node) => node.id === componentId);

    if (exists) {
      alert("Component ID already exists");
      return;
    }

    const newNode = {
      id: componentId,
      type: componentType,
      position: {
        x: 150 + nodes.length * 80,
        y: 150 + nodes.length * 60,
      },
      data: {
        id: componentId,
        name: componentName,
      },
    };

    console.log("newnode",newNode);
    setNodes((currentNodes) => [...currentNodes, newNode]);
    setShowModal(false);
    setComponentName("");
    setComponentId("");
  };

  // ==================================================
  // SAVE
  // ==================================================

  const saveLayout = () => {
    if (!name.trim()) {
      alert("Enter layout name");
      return;
    }

    const layoutJSON = {
      id: layoutId || `LAYOUT-${Date.now()}`,
      ProjectName,
      name,
      description,
      nodes,
      edges,
    };

    console.log("LAYOUT JSON:", JSON.stringify(layoutJSON, null, 2));

    alert("Layout saved successfully");

    // If creating new layout,
    // navigate to its editor URL

    if (isNewLayout) {
      navigate(`/layouts/${layoutJSON.id}`, {
        replace: true,
      });
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/layouts")}
              className="rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
            >
              ←
            </button>

            <div>
              <h2 className="font-semibold text-gray-800">
                {isNewLayout ? "New Layout" : name}
              </h2>

              <p className="text-xs text-gray-500">Design your SCADA layout</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openComponentModal("sump")}
              className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
            >
              + Sump
            </button>

            <button
              onClick={() => openComponentModal("pump")}
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              + Pump
            </button>

            <button
              onClick={() => openComponentModal("valve")}
              className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
            >
              + Valve
            </button>

            <button
              onClick={saveLayout}
              className="ml-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Layout
            </button>
          </div>
        </div>

        {/* =========================================
            LAYOUT INFORMATION
        ========================================= */}

        {isNewLayout && (
          <div className="grid shrink-0 grid-cols-2 gap-4 border-b border-gray-200 bg-white p-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Layout Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Main Water Plant"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Description
              </label>

              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Water treatment plant layout"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* =========================================
            REACT FLOW
        ========================================= */}

        <div className="min-h-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />

            <Controls />

            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* =========================================
          ADD COMPONENT MODAL
      ========================================= */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold capitalize text-gray-800">
                Add {componentType}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Name */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Component Name
              </label>

              <input
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder={`Example: Main ${componentType}`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ID */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Component ID
              </label>

              <input
                value={componentId}
                onChange={(e) => setComponentId(e.target.value)}
                placeholder={`Example: ${componentType.toUpperCase()}-1`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={addComponent}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add {componentType}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
