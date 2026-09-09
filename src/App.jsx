import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import LayoutList from "./layouts/LayoutList";
import Dashboard from "./pages/Layout";
import ViewLayout from "./pages/ViewLayout";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Layout list WITH Sidebar + Navbar */}
        <Route
          path="/layouts"
          element={
            <ProtectedRoute>
              <LayoutList />
            </ProtectedRoute>
          }
        />

        {/* New layout WITHOUT Sidebar + Navbar */}
        <Route
          path="/layouts/new"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Existing layout WITHOUT Sidebar + Navbar */}
        <Route
          path="/layouts/:layoutId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/layouts/:layoutId/view"
          element={
            <ProtectedRoute>
              <ViewLayout />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/layouts" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
