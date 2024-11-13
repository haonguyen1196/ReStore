import { ShoppingCart } from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    IconButton,
    List,
    ListItem,
    Switch,
    Toolbar,
    Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from "../context/StoreContext";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

const midLinks = [
    { title: "catalog", path: "/catalog" },
    { title: "about", path: "/about" },
    { title: "contact", path: "/contact" },
];

const rightLinks = [
    { title: "login", path: "/login" },
    { title: "register", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": {
        color: "secondary.main",
    },
    "&.active": {
        color: "text.secondary",
    },
};

export default function Header({ darkMode, handleThemeChange }: Props) {
    const { basket } = useStoreContext();

    // xử dụng reduce để tính tổng số lượng sản phẩm trong giỏ hàng
    // acc là biến tích lũy, 0 là giá trị khởi tạo của biến tích lũy
    //nếu vế phải của ?? là null hoặc undefined thì trả về giá trị bên trái là 0
    const itemCount =
        basket?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography component={NavLink} to="/" sx={navStyles}>
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>
                <List sx={{ display: "flex" }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            sx={navStyles}
                            key={path}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        component={Link}
                        to="/basket"
                        size="large"
                        color="inherit"
                        sx={{ mr: "2" }}
                    >
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: "flex" }}>
                        {rightLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                sx={navStyles}
                                key={path}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
