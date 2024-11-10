import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function Catalog() {
    //state product
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    //fetch data product
    useEffect(() => {
        agent.Catalog.list()
            .then((response) => setProducts(response))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingComponent message="Loading products..." />;

    return <ProductList products={products} />;
}
