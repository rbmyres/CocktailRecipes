import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useLoading } from "../LoadingContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute() {
  const { authorized, loading: authLoading } = useAuth();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading, setLoading]);

  if (authLoading) return null;
  if (!authorized) return <Navigate to="/login" replace />;

  return <Outlet />;
}