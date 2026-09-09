import { useLocation } from "react-router-dom";

export default function Navbar() {

  const location = useLocation();

  const getTitle = () => {

    if (location.pathname === "/dashboard")
      return "Dashboard";

    if (location.pathname === "/layouts")
      return "Layouts";

    if (location.pathname === "/layouts/new")
      return "Create Layout";

    if (location.pathname.includes("/layouts/"))
      return "Layout Editor";

    return "SCADA";
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* Left */}
      <div>

        <h1 className="text-lg font-semibold text-gray-800">
          {getTitle()}
        </h1>

        <p className="text-xs text-gray-500">
          SCADA Management System
        </p>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          🔔

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            A
          </div>

          <div className="hidden sm:block">

            <div className="text-sm font-medium text-gray-800">
              Admin
            </div>

            <div className="text-xs text-gray-500">
              Administrator
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}