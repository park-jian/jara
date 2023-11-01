import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/firebase";
import ProductCard from "./ProductCard";

export default function Products() {
  const {
    isLoading,
    error,
    data: products,
    //} = useQuery(["products"], getProducts);  <-- 간소 했더니 에러나서 아래와 같이 queryKey, queryFn을 써줌
  } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </ul>
    </>
  );
}
