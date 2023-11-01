import React from "react";
import { useLocation } from "react-router-dom";

export default function ProductDetail() {
  const {
    state: {
      product: { id, image, title, description, category, price, options },
    },
  } = useLocation();
  return (
    <section>
      <p>{category}</p>
      <img src={image} alt={title} />
      <div>
        <h2>{title}</h2>
        <p>{price}원</p>
        <p>{description}</p>
        <p>옵션: </p>
      </div>
    </section>
  );
}
