import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useProducts from "../hooks/useProducts";
import { collection, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../firebase";

const ProductInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = new URLSearchParams(location.search).get("id");
  const { products, loading } = useProducts();

  const singleProduct = products.find((product) => product.id === productId);

  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const addCart = async (item) => {
    if (item.stock < quantity) {
      toast.error("Not enough stock available!");
      return;
    }

    try {
      const productsRef = collection(fireDB, "products");
      const q = query(productsRef, where("id", "==", item.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.docs[0];
        dispatch(
          addToCart({
            ...item,
            quantity,
            createdAt: item.createdAt?.toDate().toISOString(),
          })
        );

        toast.success(`${quantity} ${item.name} added to cart`);
      } else {
        toast.error("Product not found in Firestore.");
      }
    } catch (error) {
      console.error("🔥 Error updating stock:", error);
      toast.error("Something went wrong while updating stock");
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-40 py-10 bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="text-white bg-[#FA6A02] border border-[#FA6A02] px-4 py-1 rounded-md text-lg font-semibold hover:bg-orange-600 hover:border-orange-600 transition-colors duration-300 ease-in-out mb-8 flex items-center justify-center gap-2"
      >
        <IoArrowBackCircleOutline size={24} />
        Back
      </button>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white img__container basis-full lg:basis-1/2 shadow-lg flex items-center justify-center">
          <img
            src={singleProduct.image}
            alt={singleProduct.name}
            className="w-full h-auto max-w-[500px] max-h-[500px] object-contain"
          />
        </div>
        <div className="bg-white content basis-full lg:basis-1/2 shadow-lg px-4 md:px-8 py-4 pb-8 flex flex-col gap-2">
          <h1 className="fredoka text-2xl md:text-3xl font-semibold mb-2">
            {singleProduct.name}
          </h1>
          <p className="outfit text-base md:text-lg">
            <span className="font-bold">Description:</span>{" "}
            {singleProduct.desciption}
          </p>
          <div className="flex items-center gap-4 md:gap-8 mt-4">
            <span className="font-medium text-base md:text-xl w-[20%] lg:w-[25%] 2xl:w-[20%]">
              Price:
            </span>
            <h3 className="text-xl md:text-2xl text-[#FA6A02] font-semibold">
              {singleProduct.price.toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })}
            </h3>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <span className="font-medium text-base md:text-xl w-[20%] lg:w-[25%] 2xl:w-[20%]">
              Stock:
            </span>
            <h3 className="text-xl md:text-2xl font-semibold">
              {singleProduct.stock}
            </h3>
          </div>
          <div className="flex items-center gap-4 md:gap-8 mt-2">
            <span className="font-medium text-base md:text-xl w-[20%] lg:w-[25%] 2xl:w-[20%]">
              Quantity:
            </span>
            <div className="flex items-center">
              <button
                onClick={handleDecrement}
                className="border text-[#fa6a02] border-[#FA6A02] w-[40px] h-[40px] font-semibold flex items-center justify-center rounded-tl-2xl rounded-bl-2xl"
              >
                <FaMinus />
              </button>
              <span className="border-[#FA6A02] border w-[40px] md:w-[50px] h-[40px] flex items-center justify-center border-r-0 border-l-0 font-semibold text-xl">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= singleProduct?.stock}
                className={`border flex items-center justify-center text-[#fa6a02] border-[#FA6A02] w-[40px] h-[40px] font-semibold rounded-tr-2xl rounded-br-2xl ${
                  quantity >= singleProduct?.stock
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => addCart(singleProduct)}
              className="w-full fredoka mt-8 text-xl md:text-2xl lg:text-3xl font-semibold bg-[#FA6A02] text-white h-[50px] md:h-[60px]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="h-full py-12 flex flex-col text-center bg-white shadow-lg mt-8">
        <h1 className="fredoka text-2xl md:text-3xl font-semibold">
          Customer Reviews
        </h1>
        <p className="text-lg md:text-xl fredoka font-medium mt-2">
          No reviews yet. Any feedback? Let us know
        </p>
        <button className="w-[80%] md:w-[50%] lg:w-[30%] mx-auto fredoka mt-8 text-lg md:text-2xl font-semibold bg-[#FA6A02] text-white h-[50px] md:h-[60px]">
          Write Review
        </button>
      </div>
    </div>
  );
};

export default ProductInformation;
