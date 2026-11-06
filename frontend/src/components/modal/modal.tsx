import { authEvent } from "@/lib/authEvent";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthModalProvider = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (payload: any) => {
      setMessage(payload?.message || "Please login to continue");
      setOpen(true);
    };

    authEvent.on("auth", handler);

    return () => {
      authEvent.off("auth", handler);
    };
  }, []);

  const handleLogin = () => {
    navigate("/auth/login");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-xl animate-fadeIn">
        {/* Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogOut className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Login Required
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-white font-medium transition"
          >
            Login
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-[11px] text-gray-400 text-center mt-5">
          You need to be signed in to continue this action
        </p>
      </div>
    </div>
  );
};

export default AuthModalProvider;
