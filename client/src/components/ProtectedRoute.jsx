// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("authToken");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// };

// export default ProtectedRoute;



import React from "react";
import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) {
      return false;
    }

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
