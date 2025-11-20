import { auth } from "../lib/firebase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
