import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import FallbackUI from "./components/Fallbackui.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/Store.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={FallbackUI}>
    <Toaster/>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
);
