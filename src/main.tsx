import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppProviders from "./AppProviders.tsx";
import { ThemeModeProvider } from "./contexts/ThemeModeContext.tsx";
import { store } from "./store/store.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeModeProvider>
          <AppProviders />
        </ThemeModeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
