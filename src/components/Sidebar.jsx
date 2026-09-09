import { NavLink } from "react-router-dom";

export default function Sidebar() {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▣",
    },
    {
      name: "Layouts",
      path: "/layouts",
      icon: "▦",
    },
  ];

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-slate-900 text-white">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-700 px-5">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
          S
        </div>

        <div className="ml-3">
          <div className="font-semibold">
            SCADA
          </div>

          <div className="text-xs text-slate-400">
            Control System
          </div>
        </div>

      </div>

      {/* Menu */}
      <nav className="flex-1 p-3">

        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              mb-1 flex items-center gap-3 rounded-lg px-3 py-3
              text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
              `
            }
          >

            <span className="text-lg">
              {item.icon}
            </span>

            {item.name}

          </NavLink>

        ))}

      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700 p-4">

        <div className="text-xs text-slate-500">
          SCADA System
        </div>

        <div className="mt-1 text-xs text-slate-400">
          v1.0.0
        </div>

      </div>

    </aside>
  );
}