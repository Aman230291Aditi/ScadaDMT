import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import Toolbar from "./Toolbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <Navbar />
        {/* <Toolbar /> */}

        {/* Page */}
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
         <Footer />
      </div>
    </div>
  );
}
