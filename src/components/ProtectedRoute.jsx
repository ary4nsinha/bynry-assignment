// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedUserType }) => {
  const { userType } = useUser();

  if (!userType) {
    return <Navigate to="/" replace />;
  }

  if (userType !== allowedUserType) {
    // Redirect users to their appropriate home page
    return (
      <Navigate to={userType === "admin" ? "/dashboard" : "/home"} replace />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedUserType: PropTypes.oneOf(["user", "admin"]).isRequired,
};

export default ProtectedRoute;
