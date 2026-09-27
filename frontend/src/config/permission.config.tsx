import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { UserType } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

interface PermissionCheckProps {
  allowedRole: string | string[];
  children: React.ReactNode;
}

const PermissionCheck = ({ allowedRole, children }: PermissionCheckProps) => {
  const { loggedInUser, isLoading } = useContext(AuthContext) as {
    loggedInUser: UserType | null;
    isLoading: boolean;
  };
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-normal text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!loggedInUser) {
    // toast.error("Please login to access!");
    navigate("/login");
  }

  if (!loggedInUser) return;

  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(loggedInUser?.role || "")
    : loggedInUser?.role === allowedRole;

  if (!isAllowed) {
    // toast.error("No permission to access!");
    navigate("/login");
  }
  // }, [loggedInUser, isLoading, allowedRole, navigate]);

  return <>{children}</>;
};

export default PermissionCheck;
