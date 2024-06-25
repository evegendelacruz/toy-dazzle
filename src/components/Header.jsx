import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { products } from "../data/products";
import { CiSearch } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, fireDB } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { RiShoppingCartLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa"; // Changed to FaUserCircle
import { BiShowAlt, BiSolidShow } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";

const Header = () => {
  const [loginNav, setLoginNav] = useState(false);
  const [showForgotPasswordContent, setShowForgotPasswordContent] =
    useState(false); // State for showing forgot password form
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [snapshotListener, setSnapshotListener] = useState(null); // State to hold snapshot listener
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const cartItems = useSelector((state) => state.cart.cartItems);

  const Navlinks = [
    { navname: "Boys", to: "/categories/boys" },
    { navname: "Girls", to: "/categories/girls" },
    { navname: "Baby", to: "/categories/baby" },
    { navname: "Learning", to: "/categories/learning" },
    { navname: "Riding", to: "/categories/riding" },
  ];

  // Filtered search data based on search query
  const filteredSearchData = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  // Form handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Load user data from local storage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("users");
    setUserData(userData ? JSON.parse(userData) : null);
  }, []);

  // Clean up snapshot listener
  const unsubscribeSnapshot = () => {
    if (snapshotListener) {
      snapshotListener();
      setSnapshotListener(null);
    }
  };

  // Set up snapshot listener for user data
  const handleSnapshotListener = (user) => {
    const loginQuery = query(
      collection(fireDB, "users"),
      where("uid", "==", user.uid)
    );

    const snapshot = onSnapshot(loginQuery, (querySnapshot) => {
      let userData;
      querySnapshot.forEach((doc) => (userData = doc.data()));
      localStorage.setItem("users", JSON.stringify(userData));
      setUserData(userData);
    });

    // Save snapshot listener to state
    setSnapshotListener(snapshot);

    return snapshot;
  };

  // Handle login form submission
  const onSubmit = async (data) => {
    try {
      // Sign in user with email and password using Firebase authentication
      const users = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Query Firestore to get user data
      const loginQuery = query(
        collection(fireDB, "user"),
        where("uid", "==", users?.user?.uid)
      );
      const snapshot = onSnapshot(loginQuery, (QuerySnapshot) => {
        let user;
        QuerySnapshot.forEach((doc) => (user = doc.data()));
        localStorage.setItem("users", JSON.stringify(user));
        setUserData(user);
        window.location.reload();
      });
      setLoginNav(false);
      return () => snapshot;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Load user data from local storage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("users");
    setUserData(userData ? JSON.parse(userData) : null);
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("users");
    setLoginNav(false);
    setUserData(null);
    unsubscribeSnapshot(); // Clean up snapshot listener
    window.location.reload();
  };

  // Handle submission of password reset email link
  const handleResetPasswordLinkSubmit = async (data) => {
    try {
      // Query Firestore to check if the email exists in the 'users' collection
      const userQuery = query(
        collection(fireDB, "user"),
        where("email", "==", data.email)
      );

      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        // If no documents are returned, the email does not exist in the collection
        toast.error("Email does not exist or is not valid.");
        return;
      }

      // If documents are returned, proceed to send the password reset link
      await sendPasswordResetEmail(auth, data.email);
      // await sendPasswordResetEmail(auth, data.email, {
      //   url: "https://toy-dazzle.vercel.app/",
      // });
      toast.success(
        "A password reset link has been sent to your email address."
      );
    } catch (error) {
      console.error("Error sending password reset link:", error);
      toast.error("An error occurred while sending the password reset link.");
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="sticky top-0 w-full z-30">
      <div className="nav__container bg-[#007FFF] flex justify-between items-center px-6 py-1 lg:px-16">
        <Link to="/" className="logo__container">
          <img
            src="/images/icons/Logo.png"
            alt=""
            width="150"
            loading="lazy"
          />
        </Link>

        {/* Wide Screen Search Bar */}
        <div className="hidden md:flex flex-grow items-center justify-center">
          <form className="flex items-center relative w-full md:w-[60%]">
            <input
              type="search"
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 flex-grow px-4 outline-none border border-[#007FFF]"
              value={searchQuery}
            />
            <button
              type="submit"
              className="h-10 bg-[#FA6A02] w-16 flex items-center justify-center"
            >
              <CiSearch size={22} color="white" />
            </button>
          </form>
          {searchQuery && (
            <div className="absolute top-12 md:top-[60px] w-full md:max-w-[43%] border-t border-[#007FFF] shadow-md bg-white z-20">
              {filteredSearchData.map((product) => (
                <Link
                  to={`/product?id=${product.id}&name=${product.name}`}
                  key={product.id}
                  className="flex items-center gap-2 hover:bg-gray-200 p-4"
                  onClick={() => setSearchQuery("")}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10"
                  />
                  <h1 className="fredoka text-base">{product.name}</h1>
                </Link>
              ))}
              {filteredSearchData.length === 0 && (
                <div className="flex items-center p-4 gap-2">
                  <CiSearch size={20} />
                  <p className="fredoka text-base">
                    No results found. Try another search
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart and Profile Icons */}
        <div className="cart-profile__container flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to="/cart"
            className="relative"
          >
            <RiShoppingCartLine size={26} color="white" />
            {cartItems.length > 0 && (
              <div className="absolute bg-[#FA6A02] text-white fredoka text-sm rounded-full w-[20px] h-[20px] flex items-center justify-center right-[-4px] top-[-7px]">
                {cartItems.length}
              </div>
            )}
          </Link>

          {/* Profile Icon and Dropdown */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setLoginNav((prev) => !prev)}
            >
              <FaUserCircle size={26} color="white" />
            </div>
            {loginNav && (
              <div className="absolute z-10 border right-0 top-[56px] w-[200px] shadow-md bg-white">
                <div className="flex flex-col">
                  {userData ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setLoginNav(false)}
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                      >
                        {`${
                          userData.firstName.charAt(0).toUpperCase() +
                          userData.firstName.slice(1)
                        } ${
                          userData.lastName.charAt(0).toUpperCase() +
                          userData.lastName.slice(1)
                        }`}
                      </Link>
                      <Link
                        to="/purchases"
                        onClick={() => setLoginNav(false)}
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                      >
                        Purchases
                      </Link>
                      <Link
                        to="/reviews"
                        onClick={() => setLoginNav(false)}
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                      >
                        Reviews
                      </Link>
                      <Link
                        to="/help"
                        onClick={() => setLoginNav(false)}
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                      >
                        Help
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setLoginNav(false)}
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                      >
                        Settings
                      </Link>
                      <Link
                        className="py-2 px-4 hover:bg-gray-200 outfit"
                        onClick={logout}
                      >
                        Logout
                      </Link>
                    </>
                  ) : showForgotPasswordContent ? (
                    <div className="absolute z-10  border right-0 top-[56px] p-6 w-[400px] shadow-md bg-white">
                      <div className="flex items-center justify-between">
                        <IoIosArrowRoundBack
                          fontSize={24}
                          className="cursor-pointer"
                          onClick={() => setShowForgotPasswordContent(false)}
                        />

                        <h1 className="text-center fredoka font-semibold text-2xl">
                          Recover my Account
                        </h1>

                        <div className="invisible"></div>
                      </div>
                      <form
                        onSubmit={handleSubmit(handleResetPasswordLinkSubmit)}
                        className="flex flex-col gap-5 mt-4"
                      >
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            className={`${
                              errors.email ? "border-[2px] border-red-500" : ""
                            } border w-full border-[#FA6A02] px-4 rounded-2xl py-3 `}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address.",
                              },
                            })}
                          />
                          {errors.email && (
                            <div className="text-red-500 font-bold mt-2">
                              {errors.email.message}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center">
                          <button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-[#007FFF] px-4 h-[45px] border border-[#007FFF] shadow-md w-[200px] rounded-3xl font-bold text-[18px] text-white"
                          >
                            {isSubmitting ? (
                              <l-dot-pulse
                                size="38"
                                speed="1.3"
                                color="white"
                              ></l-dot-pulse>
                            ) : (
                              <span>Send Reset Link</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="absolute z-50  border right-0 p-6 w-[310px] shadow-md bg-white">
                      <h1 className="text-center fredoka font-semibold text-2xl">
                        Login to my Account
                      </h1>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 mt-6"
                      >
                        <div>
                          <input
                            type="email"
                            placeholder="Email"
                            className={`${
                              errors.email ? "border-[2px] border-red-500" : ""
                            } border w-full border-[#FA6A02] px-4 rounded-2xl py-3 `}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address.",
                              },
                            })}
                          />

                          {errors.email && (
                            <div className="text-red-500 font-bold mt-2">
                              {errors.email.message}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className={`${
                                errors.password
                                  ? "border-[2px] border-red-500"
                                  : ""
                              } border w-full border-[#FA6A02] px-4 rounded-2xl py-3 `}
                              {...register("password", {
                                required: "Password is required",
                              })}
                            />
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2 right-3"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <BiShowAlt
                                  fontSize={24}
                                  className="cursor-pointer"
                                />
                              ) : (
                                <BiSolidShow
                                  fontSize={24}
                                  className="cursor-pointer"
                                />
                              )}
                            </div>
                          </div>

                          {errors.password && (
                            <div className="text-red-500 font-bold mt-2">
                              {errors.password.message}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-[#007FFF] px-4 h-[45px] border border-[#007FFF] shadow-md w-[120px] rounded-3xl font-bold text-[18px] text-white"
                          >
                            {isSubmitting ? (
                              <l-dot-pulse
                                size="38"
                                speed="1.3"
                                color="white"
                              ></l-dot-pulse>
                            ) : (
                              <span>Log in</span>
                            )}
                          </button>
                        </div>
                      </form>
                      <div className="text-center flex flex-col gap-1 mt-6">
                        <h3 className="outfit font-semibold">
                          New customer?
                          <Link
                            to="/auth/register"
                            onClick={() => {
                              setLoginNav((prev) => !prev);
                            }}
                            className="text-[#FA6A02]"
                          >
                            {" "}
                            Create an Account
                          </Link>
                        </h3>
                        <h3
                          onClick={() =>
                            setShowForgotPasswordContent(
                              !showForgotPasswordContent
                            )
                          }
                          className="outfit font-semibold cursor-pointer"
                        >
                          Forgot Password?
                          <span className="text-[#FA6A02]">
                            {" "}
                            Recover Password
                          </span>
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div
            className="cursor-pointer md:hidden"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileNavOpen
                    ? "M4 6h16M4 12h16M4 18h16"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Toggle Visibility */}
      <div className="relative bg-[#007FFF] px-4 py-2 md:hidden">
        <form className="flex items-center">
          <input
            type="search"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 flex-grow px-4 outline-none border-r-0"
            value={searchQuery}
          />
          <button className="h-10 bg-[#FA6A02] w-16 flex items-center justify-center">
            <CiSearch size={22} color="white" />
          </button>
        </form>
        {searchQuery && (
          <div className="absolute border-t border w-full max-w-[90vw] shadow-md bg-white mt-1">
            {filteredSearchData.map((product) => (
              <Link
                to={`/product?id=${product.id}&name=${product.name}`}
                key={product.id}
                className="flex items-center gap-2 hover:bg-gray-200 p-2"
                onClick={() => setSearchQuery("")}
              >
                <img src={product.image} alt={product.name} className="w-10" />
                <h1 className="fredoka text-base">{product.name}</h1>
              </Link>
            ))}
            {filteredSearchData.length === 0 && (
              <div className="flex items-center p-2 gap-2">
                <CiSearch size={20} />
                <p className="font-bold text-base">
                  No results found. Try another search.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <NavLink
        to="/auth/register"
        onClick={() => {
          setIsMobileNavOpen(false);
        }}
        className="fredoka text-xl"
        activeclassname="text-[#007FFF]"
      ></NavLink>

      {/* Mobile Navigation Menu */}
      <div className="bg-white categories__container w-full shadow-md flex items-center justify-center gap-12 h-[50px]">
        {isMobileNavOpen && (
          <div className="flex flex-col items-center gap-4 py-4 absolute top-[100px] w-full left-0 bg-white shadow-md border">
            {Navlinks.map((link, index) => (
              <NavLink
                key={index}
                exact="true"
                to={link.to}
                className={`cursor-pointer outfit font-semibold text-md hover:text-[#FA6A02] ${
                  location.pathname === link.to ? "text-[#FA6A02]" : ""
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                {link.navname}
              </NavLink>
            ))}
          </div>
        )}

        {/* Desktop Navigation Menu - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-12 h-[50px]">
          {Navlinks.map((link, index) => (
            <NavLink
              key={index}
              exact="true"
              to={link.to}
              className={`outfit font-semibold text-md hover:text-[#FA6A02] ${
                location.pathname === link.to ? "text-[#FA6A02]" : ""
              }`}
            >
              {link.navname}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
