import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { NotificationProvider } from "@/context/NotificationContext";
import App from "./App.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { ThemeProvider } from "./context/theme-provider"; // ✅ corrected import
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <NotificationProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
