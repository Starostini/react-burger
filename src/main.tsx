import React,{ StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {store} from "./services/store.ts";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
      <App />
        </Provider>
    </StrictMode>
  );
}
