import ReactDOM from "react-dom/client";
import App from "./App";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { queryClient } from "./hooks/useHabits";

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "habits-cache",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <App />
  </PersistQueryClientProvider>
);
