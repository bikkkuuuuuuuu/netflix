// src/providers/FeatureNotImplementedProvider.tsx

import { featureEvent } from "@/lib/featureEvent";
import { Code2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FeaturePayload {
  feature?: string;
  message?: string;
}

const FeatureNotImplementedProvider = () => {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (payload: FeaturePayload) => {
      setFeature(payload?.feature || "This feature");
      setMessage(
        payload?.message || "The developer has chosen not to add this feature.",
      );
      setOpen(true);
    };

    featureEvent.on("feature", handler);

    return () => {
      featureEvent.off("feature", handler);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl sm:p-8 animate-fadeIn">
        {/* Icon */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Code2 className="h-7 w-7 text-primary" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Feature not implemented
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {message}
          </p>
        </div>

        {/* Feature */}
        {feature && (
          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-center">
            <p className="text-md text-gray-400">Requested feature</p>

            <p className="mt-1 text-md font-normal text-gray-700">{feature}</p>
          </div>
        )}

        {/* Action */}
        <button
          onClick={() => setOpen(false)}
          className="mt-5 w-full rounded-xl bg-primary py-3 font-medium text-white transition hover:opacity-90"
        >
          Got it
        </button>

        <p className="mt-5 text-center text-[11px] text-gray-400">
          Nothing is broken. This is intentional.
        </p>
      </div>
    </div>
  );
};

export default FeatureNotImplementedProvider;
