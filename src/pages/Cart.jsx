import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  toggleEditQuantity,
} from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selecting cart items and other data from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { itemsPrice, subtotal, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const [selectedOption, setSelectedOption] = useState("");

  // Function to handle change in payment option
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  // Function to remove item from cart
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart({ id }));
  };

  // Function to increase quantity of an item in cart
  const increaseQuantityHandler = (id) => {
    dispatch(increaseQuantity({ id }));
  };

  // Function to decrease quantity of an item in cart
  const decreaseQuantityHandler = (id) => {
    dispatch(decreaseQuantity({ id }));
  };

  // Function to edit quantity of an item in cart
  const toggleEditQuantityHandler = (id) => {
    dispatch(toggleEditQuantity({ id }));
  };

  // Function to checkout
  const handleCheckoutHandler = () => {
    // If no selected option , toast an error
    if (!selectedOption) {
      return toast.error("Please select payment option");
    } else if (selectedOption === "Gcash") {
      // If gcash is selected, toast an error
      return toast.error("Gcash is not available");
    }

    // If correct option is selected , redirect to /checkout page with mop information
    navigate(`/checkout?mop=${selectedOption}`);
  };

  return (
    <div>
      {cartItems.length > 0 ? (
        <div className="px-4 lg:px-16 2xl:px-40 py-10 flex flex-col lg:flex-row gap-8 bg-gray-200">
          <div className="cartItems flex flex-col gap-8 h-full basis-full lg:basis-[70%]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row items-center gap-8 bg-white rounded-2xl px-6 py-4"
              >
                <div className="img__container w-full lg:w-1/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="content w-full lg:w-2/3">
                  <h1 className="fredoka text-xl font-semibold">
                    {item.name}
                  </h1>

                  <div className="mt-4">
                    <div className="flex items-center gap-4 outfit font-bold">
                      <span className="text-lg font-semibold w-1/3">
                        Price:
                      </span>
                      <h3 className="text-lg text-[#FA6A02]">
                        {item.price?.toLocaleString("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        })}
                      </h3>
                    </div>
                    <div className="outfit font-bold mt-4">
                      {item.isEditing ? (
                        <div className="flex items-center">
                          <span className="text-lg font-semibold w-1/3">
                            Quantity:
                          </span>
                          <button
                            onClick={() => decreaseQuantityHandler(item.id)}
                            className="border text-[#fa6a02] border-[#FA6A02] w-[40px] h-[40px] font-semibold flex items-center justify-center rounded-tl-2xl rounded-bl-2xl"
                          >
                            <FaMinus />
                          </button>
                          <span className="border-[#FA6A02] border w-[50px] h-[40px] flex items-center justify-center border-r-0 border-l-0 font-semibold text-xl">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantityHandler(item.id)}
                            className="border flex items-center justify-center text-[#fa6a02] border-[#FA6A02] w-[40px] h-[40px] font-semibold rounded-tr-2xl rounded-br-2xl"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 outfit font-bold">
                          <span className="text-lg font-semibold w-1/3">
                            Quantity:
                          </span>
                          <h1 className="text-lg">{item.quantity}</h1>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col mt-4 items-start">
                      <button
                        onClick={() => toggleEditQuantityHandler(item.id)}
                        className="text-[#49B449] text-lg font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeFromCartHandler(item.id)}
                        className="text-[#E0301E] text-lg font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout w-full lg:w-1/3 bg-white shadow-md py-6 px-4 lg:px-8 rounded-2xl">
            <h1 className="fredoka text-xl font-semibold">How you'll pay</h1>
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 fredoka">
                <input
                  type="radio"
                  value="Cash on delivery"
                  name="paymentOption"
                  checked={selectedOption === "Cash on delivery"}
                  onChange={handleOptionChange}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 fredoka">
                <input
                  type="radio"
                  name="paymentOption"
                  value="Gcash"
                  onChange={handleOptionChange}
                />
                Gcash
              </label>
            </div>
            <div className="total-payment__container mt-4">
              <div className="flex items-center gap-4 outfit font-bold">
                <span className="text-lg w-1/2">Item/s total:</span>
                <h3 className="text-lg">
                  {itemsPrice?.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h3>
              </div>

              <div className="flex items-center gap-4 outfit font-bold">
                <span className="text-lg w-1/2">Shop Discount:</span>
                <h3 className="text-lg text-[#E0301E]">
                  {(250).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h3>
              </div>

              <div className="border my-4 border-gray-400" />

              <div className="flex items-center gap-4 outfit font-bold">
                <span className="text-lg w-1/2">Subtotal:</span>
                <h3 className="text-lg">
                  {subtotal?.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h3>
              </div>

              <div className="flex items-center gap-4 outfit font-bold">
                <span className="text-lg w-1/2">Shipping Fee:</span>
                <h3 className="text-lg">
                  {shippingPrice === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    shippingPrice?.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })
                  )}
                </h3>
              </div>

              <div className="flex items-center gap-4 outfit font-bold">
                <span className="text-lg w-1/2">
                  Total Item({cartItems.length}):
                </span>
                <h3 className="text-lg text-[#FA6A02]">
                  {totalPrice?.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h3>
              </div>

              <button
                onClick={handleCheckoutHandler}
                className="bg-[#FA6A02] text-lg font-semibold h-[55px] rounded-full fredoka text-white mt-4 w-full"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <img src="/images/icons/emptycart.webp" alt="" loading="lazy" />
          <h1 className="outfit text-3xl mt-6 font-semibold">
            Your Cart is Empty
          </h1>
          <Link
            to="/"
            className="w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 fredoka mt-8 text-3xl font-medium bg-[#FA6A02] text-white h-[60px] flex items-center justify-center"
          >
            Shop our Products Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
