import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import axios from "axios";

export default function ProductDetails() {
    //dat interface cho useParams
    const { id } = useParams<{ id: string }>();
    //gia tri ban dau cua product la null nen phai dat interface cho no la null
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Typography variant="h2">Loading...</Typography>;

    if (!product)
        return <Typography variant="h2">Product not found</Typography>;

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
            </Grid>
        </Grid>
    );
}
