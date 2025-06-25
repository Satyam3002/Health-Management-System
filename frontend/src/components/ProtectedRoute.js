import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AppContext);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
