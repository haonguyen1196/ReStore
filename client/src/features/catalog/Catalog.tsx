import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

export default function Catalog() {
    //state product
    const [products, setProducts] = useState<Product[]>([]);

    //fetch data product
    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    return <ProductList products={products} />;
}
