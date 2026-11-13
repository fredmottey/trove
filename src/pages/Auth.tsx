import { Navigate } from "react-router-dom";

// Keep existing sign-in URLs working without restoring a login wall.
export default function Auth() {
  return <Navigate to="/profile" replace />;
}
