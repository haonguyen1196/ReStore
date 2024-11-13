import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/layout/style.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import { StoreProvider } from "./app/context/StoreContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {/* Cung cấp context cho ứng dụng */}
        <StoreProvider>
            {/* Cung cấp router đã được định nghĩa cho ứng dụng */}
            <RouterProvider
                router={router}
                future={{
                    v7_startTransition: true,
                }}
            />
        </StoreProvider>
    </StrictMode>
);
