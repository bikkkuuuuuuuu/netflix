import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { GitMerge, Save, Trash2 } from "lucide-react";

interface DeleteModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
}

interface DeleteModalContextType {
  confirmDelete: (options: DeleteModalOptions) => void;
  closeDeleteModal: () => void;
}

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(
  undefined,
);

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext);

  if (!context) {
    throw new Error("useDeleteModal must be used inside DeleteModalProvider");
  }

  return context;
};

export const DeleteModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("Delete Item");

  const [confirmText, setConfirmText] = useState("Delete");

  const [cancelText, setCancelText] = useState("Cancel");

  const [onConfirm, setOnConfirm] = useState<
    (() => Promise<void> | void) | null
  >(null);

  const [loading, setLoading] = useState(false);

  const confirmDelete = useCallback((options: DeleteModalOptions) => {
    setTitle(options.title || "Delete Item");

    setMessage(options.message || "Are you sure you want to delete this item?");

    setConfirmText(options.confirmText || "Delete");

    setCancelText(options.cancelText || "Cancel");

    setOnConfirm(() => options.onConfirm);

    setOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (loading) return;

    setOpen(false);
  }, [loading]);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setLoading(true);

      await onConfirm();

      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);

      // Modal stays open if an error happens
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open && !loading) {
        closeDeleteModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, closeDeleteModal]);

  return (
    <DeleteModalContext.Provider
      value={{
        confirmDelete,
        closeDeleteModal,
      }}
    >
      {children}

      {open && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-xl animate-fadeIn"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {confirmText === "Merge" ? (
                  <GitMerge className="h-7 w-7 text-primary" />
                ) : confirmText === "Update" ? (
                  <Save className="h-7 w-7 text-primary" />
                ) : (
                  <Trash2 className="h-7 w-7 text-primary" />
                )}
              </div>

              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-white font-medium transition disabled:opacity-70"
              >
                {loading
                  ? confirmText === "Merge"
                    ? "Merging..."
                    : confirmText === "Update"
                      ? "Updating..."
                      : "Deleting..."
                  : confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </DeleteModalContext.Provider>
  );
};
