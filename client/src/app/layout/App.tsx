import { useEffect, useState } from "react";
import Header from "./Header";
import {
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStoreContext } from "../context/StoreContext";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { getCookie } from "../util/util";

function App() {
    const { setBasket } = useStoreContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buyerId = getCookie("buyerId");
        if (buyerId) {
            agent.Basket.get()
                .then((response) => setBasket(response))
                .catch((error) => console.log(error))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [setBasket]);

    //dark mode
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? "dark" : "light";
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === "light" ? "#eaeaea" : "#121212",
            },
        },
    });

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    if (loading) return <LoadingComponent message="Initialising app..." />;

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
            />
            <CssBaseline />
            <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
            <Container>
                {/* Outlet là nơi hiển thị các route con */}
                <Outlet />
            </Container>
        </ThemeProvider>
    );
}

export default App;
