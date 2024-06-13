import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Checkout = () => {
  // Selecting cart items and other data from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { totalPrice } = useSelector((state) => state.cart);

  // Use location to get the mop information
  const location = useLocation();
  const mop = new URLSearchParams(location.search).get("mop");

  // State for the tracking content
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // State for toggling the tracking component
  const toggleTracking = () => {
    setIsTrackingOpen(!isTrackingOpen);
  };

  // State for current time and date
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Use effect for checking the date and time now for updating the state
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dateOptions = { day: "numeric", month: "short" };
      const timeOptions = { hour: "2-digit", minute: "2-digit" };
      setCurrentDate(now.toLocaleDateString("en-US", dateOptions));
      setCurrentTime(now.toLocaleTimeString("en-US", timeOptions));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {cartItems.length > 0 ? (
        <div className="2xl:px-40 py-10 flex lg:px-16  gap-8 bg-gray-200">
          <div className="cartItems flex flex-col gap-8  h-full  py-0 pb-0  basis-[65%] ">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-8 bg-white rounded-2xl px-6 py-2 "
              >
                <div className="img__container basis-[50%]  ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full  object-cover"
                  />
                </div>
                <div className="content basis-[65%] ">
                  <h1 className="fredoka  text-lg 2xl:text-2xl font-semibold">
                    {item.name}
                  </h1>

                  <div className=" mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-8 outfit font-bold  ">
                      <span className="text-lg  font-semibold   w-[35%] 2xl:w-[20%]">
                        Price:
                      </span>{" "}
                      <h3 className="text-lg text-[#FA6A02] ">
                        {item.price?.toLocaleString("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        })}
                      </h3>
                    </div>

                    <div className="flex items-center gap-8 outfit font-bold  ">
                      <span className="text-lg  font-semibold   w-[35%] 2xl:w-[20%]">
                        Quantity:
                      </span>{" "}
                      <h3 className="text-lg  ">{item.quantity}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout basis-[50%] lg:basis-[60%] 2xl:basis-[35%] h-full bg-white shadow-md px-4 py-6   rounded-2xl ">
            <h1 className="fredoka text-2xl uppercase text-[#2BBD6E] font-bold text-center">
              ORDER SUMMARY
            </h1>

            <div className="order-summary__container mt-4 flex-col gap-1 flex">
              <div className="flex items-center gap-8 outfit font-bold  ">
                <span className="text-lg   w-[45%] ">Mode of Payment:</span>{" "}
                <h3 className="text-lg ">{mop}</h3>
              </div>

              <div className="flex items-center gap-8 outfit font-bold  ">
                <span className="text-lg    w-[45%]">
                  Total Item({cartItems.length}):
                </span>{" "}
                <h3 className="text-lg text-[#FA6A02] ">
                  {totalPrice?.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </h3>
              </div>

              <div className="accordion   w-full border-y   border-gray-400   my-4">
                <button
                  className="accordion__button w-full  cursor-pointer flex items-center justify-between pr-2"
                  onClick={toggleTracking}
                >
                  <div className="flex items-center  gap-3">
                    <img src="/images/icons/car.webp" alt="" loading="lazy" />
                    <h1 className="outfit font-bold text-lg ">
                      Track your order
                    </h1>
                  </div>

                  {isTrackingOpen ? (
                    <svg
                      width="21"
                      height="15"
                      viewBox="0 0 21 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.1016 12.8228L10.6891 2.99503L2.10522 13.1752"
                        stroke="black"
                        strokeWidth="3"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="21"
                      height="14"
                      viewBox="0 0 21 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 1L10.2069 11L19 1"
                        stroke="black"
                        strokeWidth="3"
                      />
                    </svg>
                  )}
                </button>
                {isTrackingOpen && (
                  <div className="accordion__content py-2 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="invisible"></div>
                      <div className="outfit font-semibold">
                        Tracking Number:{" "}
                        <span className="text-[#F37335]">SPEPH03442450</span>
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <div className="flex-col flex gap-4">
                        <div className="flex  flex-col  ">
                          <span className="text-[#8A7A7A]">{currentDate}</span>
                          <span className="text-[#8A7A7A]">{currentTime}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#8A7A7A]">{currentDate}</span>
                          <span className="text-[#8A7A7A]">{currentTime}</span>
                        </div>
                      </div>
                      <img
                        src="/images/icons/track.webp"
                        loading="lazy"
                        alt=""
                      />
                      <div className="flex-col flex gap-2 ">
                        <div className="flex  flex-col  ">
                          <h1 className="font-semibold outfit">
                            Preparing to ship.
                          </h1>
                          <p className="outfit">
                            Seller is preparing to ship your parcel
                          </p>
                        </div>
                        <div className="flex  flex-col  ">
                          <h1 className="font-semibold">Order placed.</h1>
                          <p>Order is placed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/cart"
                className="bg-[#E0301E] text-2xl font-semibold h-[55px] px-8 rounded-full fredoka text-white flex items-center justify-center mt-4 w-full"
              >
                Cancel Order
              </Link>
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
            className="w-[20%] fredoka  mt-8 text-3xl font-medium bg-[#FA6A02] text-white h-[60px] flex items-center justify-center"
          >
            Shop our Products Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Checkout;
