import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";

// Only initialize Tempo devtools in browser environments with a try/catch to handle potential errors
if (typeof window !== "undefined" && typeof process === "undefined") {
  try {
    TempoDevtools.init({
      disableAutoOpen: true, // Prevent automatic opening of URLs
      openBrowser: false, // Explicitly disable browser opening
    });
  } catch (error) {
    console.warn("Failed to initialize Tempo devtools:", error);
  }
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
