import React from "react";

import Featured from "../components/Featured";
import Voucher from "../components/Voucher";

import { products } from "../data/products";
import Products from "../components/Products";
import ShopBrands from "../components/ShopBrands";

const Home = () => {
  // Filter out the best seller products using the tag
  const bestSellers = products.filter(
    (product) => product.tag && product.tag.includes("Best Seller")
  );

  // Filter out the new arrivals products using the tag
  const newArrivals = products.filter(
    (product) => product.tag && product.tag.includes("New Arrivals")
  );

  return (
    <div>
      <Featured />
      <Voucher />
      <Products title="Best Selling" data={bestSellers} />
      <Products title="New Arrivals" data={newArrivals} />
      <ShopBrands />
    </div>
  );
};

export default Home;
