import React from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const ProductCard = ({ product }) => {
  const handleClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page when clicked
  };

  const dispatch = useDispatch(); // Initialize useDispatch hook to dispatch actions

  // Function to add item to cart
  const addCart = (item, quantity = 1) => {
    // Default quantity to 1 if not provided
    dispatch(
      addToCart({
        ...item,
        quantity,
      })
    );
    // Display success toast notification
    toast.success(`${quantity} ${item.name} added to cart`);
  };

  return (
    <div className="border pb-8 pt-0  lg:h-[450px] xl:h-[500px]   2xl:h-[600px] px-4 flex flex-col gap-2 relative">
      <h1 className="absolute right-[20px] top-0">
        <img
          src="/images/icons/productlogo.webp"
          loading="lazy"
          alt=""
          className="w-[150px] lg:w-[100px]"
        />
      </h1>
      <Link
        className="w-full h-full"
        to={`/product?id=${product.id}&name=${product.name}`}
      >
        <img
          src={product.image}
          alt=""
          className=" h-full cursor-pointer "
          onClick={handleClick}
        />
      </Link>
      <Link to={`/product?id=${product.id}&name=${product.name}`}>
        <h1
          className="outfit title font-semibold text-xl lg:text-lg"
          onClick={handleClick}
        >
          {product.name}
        </h1>
      </Link>

      <span className="text-[#FA6A02] font-semibold text-lg">
        {product.price.toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        })}
      </span>

      <button
        onClick={() => addCart(product)}
        className="w-full fredoka text-lg bg-[#FA6A02] text-white h-[70px] mt-2"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
