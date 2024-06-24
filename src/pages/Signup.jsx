import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, fireDB } from "../firebase";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { BiShowAlt, BiSolidShow } from "react-icons/bi";

const Signup = () => {
  // navigate
  const navigate = useNavigate();

  // Use react hoook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const users = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // create user object
      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: users.user.email,
        uid: users.user.uid,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      // create user Refrence
      const userReference = collection(fireDB, "user");

      // Add User Detail
      addDoc(userReference, user);

      toast.success("Signup Successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Check if the user is logged in by retrieving user data from localStorage
  const isLoggedIn = JSON.parse(localStorage.getItem("users"));

  // Check if the user is loggedin and if yes, redirect to home page.
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate, isLoggedIn]);

  return (
    <main className="bg-[#FFD72D] lg:p-16 lg:py-20 xl:px-40 ">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="basis-1/2">
          <img
            src="/images/signup/pool.webp"
            alt=""
            width="800"
            loading="lazy"
          />
        </div>
        <div className="content__container py-5 pb-9 h-full basis-[50%] bg-white rounded-3xl lg:mb-20 mb-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-col gap-4 flex px-5 xl:px-20 2xl:px-35"
          >
            <h1 className="fredoka font-semibold text-[#FA6A02] text-2xl text-center">
              SIGN UP
            </h1>
            <div>
              <input
                type="text"
                placeholder="First Name"
                autoComplete="off"
                className={`${
                  errors.firstName ? "border-[2px] border-red-500" : ""
                } border border-[#FA6A02] rounded-2xl py-2 px-4 text-gray-600 text-2 font-semibold w-full`}
                {...register("firstName", {
                  required: "First Name  is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "Invalid first name format. Only alphabets and spaces are allowed.",
                  },
                })}
              />
              {errors.firstName && (
                <div className="text-red-500 font-bold mt-2">
                  {errors.firstName.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                autoComplete="off"
                className={`${
                  errors.lastName ? "border-[2px] border-red-500" : ""
                } border border-[#FA6A02] rounded-2xl py-2 px-4 text-gray-600 text-2 font-semibold w-full`}
                {...register("lastName", {
                  required: "Last Name  is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "Invalid last name format. Only alphabets and spaces are allowed.",
                  },
                })}
              />
              {errors.lastName && (
                <div className="text-red-500 font-bold mt-2">
                  {errors.lastName.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                autoComplete="off"
                className={`${
                  errors.username ? "border-[2px] border-red-500" : ""
                } border border-[#FA6A02] rounded-2xl py-2 px-4 text-gray-600 text-2 font-semibold w-full`}
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <div className="text-red-500 font-bold mt-2">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
                autoComplete="off"
                className={`${
                  errors.email ? "border-[2px] border-red-500" : ""
                } border border-[#FA6A02] rounded-2xl py-2 px-4 text-gray-600 text-2 font-semibold w-full`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                  autoComplete="off"
                  className={`${
                    errors.password ? "border-[2px] border-red-500" : ""
                  } border border-[#FA6A02] rounded-2xl py-2 px-4 text-gray-600 text-2 font-semibold w-full`}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message:
                        "Password must be at least 6 characters with one special character, one digit, and one capital letter.",
                    },
                  })}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 right-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <BiShowAlt fontSize={24} className="cursor-pointer" />
                  ) : (
                    <BiSolidShow fontSize={24} className="cursor-pointer" />
                  )}
                </div>
              </div>

              {errors.password && (
                <div className="text-red-500 font-bold mt-2">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="rounded-full mt-2 py-2 px-4 fredoka text-white bg-[#2BBD6E] font-semibold text-2 shadow-2xl border"
            >
              {isSubmitting ? (
                <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
