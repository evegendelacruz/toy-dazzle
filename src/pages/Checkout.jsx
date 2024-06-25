import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { totalPrice } = useSelector((state) => state.cart);

  const location = useLocation();
  const mop = new URLSearchParams(location.search).get("mop");

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const toggleTracking = () => {
    setIsTrackingOpen(!isTrackingOpen);
  };

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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
    <div className="px-4 lg:px-8 xl:px-16 py-6 bg-gray-100">
      {cartItems.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">
                    Price:{" "}
                    <span className="text-[#FA6A02]">
                      {item.price?.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold text-[#2BBD6E] mb-4">
                ORDER SUMMARY
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Mode of Payment:</span>
                  <span className="text-lg">{mop}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">
                    Total Items ({cartItems.length}):
                  </span>
                  <span className="text-lg text-[#FA6A02]">
                    {totalPrice?.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </span>
                </div>
                <div className="border-b border-gray-400 w-full my-4"></div>
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/icons/car.webp"
                      alt="Car Icon"
                      className="w-6 h-6"
                    />
                    <span className="text-lg font-bold">Track your order</span>
                  </div>
                  <button
                    className="focus:outline-none"
                    onClick={toggleTracking}
                  >
                    {isTrackingOpen ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {isTrackingOpen && (
                  <div className="flex flex-col gap-4 mt-4 relative">
                    <div className="flex items-center gap-2 relative">
                      {/* Track icon */}
                      <img
                        src="/images/icons/track.webp"
                        alt="Track Icon"
                        className="w-18 h-30 absolute top-11 mr-10 mt-3"
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          Tracking Number:{" "}
                          <span className="text-[#F37335]">SPEPH03442450</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentDate}, {currentTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10"></div>
                      <div>
                        <p className="text-sm font-semibold">
                          Preparing to ship.
                        </p>
                        <p className="text-sm text-gray-600">
                          Seller is preparing to ship your parcel
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10"></div>
                      <div>
                        <p className="text-sm font-semibold">Order placed.</p>
                        <p className="text-sm text-gray-600">
                          Order is placed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/cart"
                className="block text-center bg-[#E0301E] text-white font-semibold py-3 rounded-lg mt-4"
              >
                Cancel Order
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <img
            src="/images/icons/emptycart.webp"
            alt="Empty Cart Icon"
            className="w-24 h-24"
          />
          <h1 className="text-3xl font-semibold mt-6">Your Cart is Empty</h1>
          <Link
            to="/"
            className="bg-[#FA6A02] text-white font-semibold py-3 rounded-lg mt-6 text-center"
          >
            Shop our Products Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Checkout;
