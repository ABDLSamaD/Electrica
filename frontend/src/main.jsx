import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./axiosSetup";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
