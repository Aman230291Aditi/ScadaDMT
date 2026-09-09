import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import AppLayout from "../components/AppLayout";

const STORAGE_KEY = "scada-layouts";
console.log(STORAGE_KEY)

export default function LayoutList() {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLayouts([]);
      return;
    }
    try {
      setLayouts(JSON.parse(stored));
    } catch {
      setLayouts([]);
    }
  };

  const deleteLayout = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this layout?",
    );

    if (!confirmDelete) return;

    const updated = layouts.filter((layout) => layout.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLayouts(updated);
  };

  console.log(layouts);
  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Layouts</h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage your SCADA plant layouts.
            </p>
          </div>

          <button
            onClick={() => navigate("/layouts/new")}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            + Add Layout
          </button>
        </div>

        {/* Empty state */}

        {layouts.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
            <div className="text-center">
              <div className="mb-4 text-5xl">🏭</div>

              <h2 className="text-lg font-semibold text-slate-700">
                No layouts found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your first SCADA layout.
              </p>

              <button
                onClick={() => navigate("/layouts/new")}
                className="mt-5 rounded-lg  px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-700"
              >
                Create Layout
              </button>
            </div>
          </div>
        )}

        {/* Layout cards */}

        {layouts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className="rounded-sm border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      {layout.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {layout.description || "No description"}
                    </p>
                  </div>

                  <span className="rounded-md animate-pulse bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Total Devices</div>

                    <div className="mt-1 text-lg font-bold">
                      {layout.nodes?.length || 0}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Total Connections</div>

                    <div className="mt-1 text-lg font-bold">
                      {layout.edges?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2 justify-between ">
                  {/* Edit */}
                  <button
                    onClick={() => navigate(`/layouts/${layout.id}`)}
                    className="flex items-center gap-1 cursor-pointer rounded-sm bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    <Icon icon="mdi:pencil" className="h-4 w-4" />
                    Edit
                  </button>

                  {/* View */}
                  <button
                    onClick={() => navigate(`/layouts/${layout.id}/view`)}
                    className="flex items-center gap-1  cursor-pointer  rounded-sm bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100"
                  >
                    <Icon icon="mdi:eye" className="h-4 w-4" />
                    View
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteLayout(layout.id)}
                    className="flex items-center gap-1  cursor-pointer  rounded-sm bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-100"
                  >
                    <Icon icon="mdi:delete-outline" className="h-4 w-4" />
                    Delete
                  </button>

              
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
