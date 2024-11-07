import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import AboutPage from "../../features/about/AboutPage";
import ProductDetails from "../../features/catalog/ProductDetails";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "about", element: <AboutPage /> },
            { path: "contact", element: <ContactPage /> },
            { path: "catalog", element: <Catalog /> },
            { path: "catalog/:id", element: <ProductDetails /> },
            {},
        ],
    },
]);
