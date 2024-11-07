import { useState } from "react";
import Header from "./Header";
import {
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import { Outlet } from "react-router-dom";

function App() {
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

    return (
        <ThemeProvider theme={theme}>
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
