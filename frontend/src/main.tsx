import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/main.css";
import Routing from "./config/router.config";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routing />
  </StrictMode>,
);
