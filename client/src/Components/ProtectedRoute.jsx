import React from "react";
import { useAuth } from "../AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { authorized, loading } = useAuth();

  if (loading) return <p>Loading...</p>;                  
  if (!authorized) return <Navigate to="/login" replace />;

  return <Outlet />;                          
}
