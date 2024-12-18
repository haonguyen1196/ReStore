import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
    const { basket, setBasket, removeItem } = useStoreContext();
    //dat interface cho useParams
    const { id } = useParams<{ id: string }>();
    //gia tri ban dau cua product la null nen phai dat interface cho no la null
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const item = basket?.items.find((i) => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);
        if (id) {
            agent.Catalog.details(id)
                .then((response) => setProduct(response))
                .catch((error) => console.log(error))
                .finally(() => setLoading(false));
        }
    }, [id, item]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (parseInt(event.target.value) > 0) {
            setQuantity(parseInt(event.target.value));
        }
    }

    function handleUpdateCart() {
        if (!product) return;
        setSubmitting(true);
        // nếu sản phẩm có trong giỏ hàng và số lượng mới lớn hơn số lượng cũ thì thêm sản phẩm vào giỏ hàng
        if (!item || quantity > item?.quantity) {
            const updateQuantity = item ? quantity - item.quantity : quantity;
            agent.Basket.addItem(product.id, updateQuantity)
                .then((basket) => setBasket(basket))
                .catch((error) => console.log(error))
                .finally(() => setSubmitting(false));
        } else {
            // nếu có item trong giỏ hàng nhưng số lượng mới nhỏ hơn số lượng cũ thì remove quantity
            const updateQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product.id, updateQuantity)
                .then(() => removeItem(product.id, updateQuantity))
                .catch((error) => console.log(error))
                .finally(() => setSubmitting(false));
        }
    }

    if (loading) return <LoadingComponent message="Loading product..." />;

    if (!product) return <NotFound />;

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    style={{ width: "100%" }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4">
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in store</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            label="Quantity in cart"
                            type="number"
                            value={quantity}
                            fullWidth
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            loading={submitting}
                            onClick={handleUpdateCart}
                            disabled={
                                item?.quantity === quantity ||
                                (!item && quantity === 0)
                            }
                            sx={{ height: "55px" }}
                            color="primary"
                            size="large"
                            variant="contained"
                            fullWidth
                        >
                            {item ? "Update quantity" : "Add to cart"}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
