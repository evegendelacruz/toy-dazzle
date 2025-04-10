import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Aside from "../../components/Aside";

const AdminDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("users");
    setUserData(userData ? JSON.parse(userData) : null);
  }, []);

  const userName = userData
    ? `${
        userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1)
      } ${
        userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1)
      }`
    : "Admin";

  return (
    <div className="flex min-h-screen bg-[#FFF7F0] font-sans">
      <Aside />
      {/* Content */}
      <main className="flex-1 ml-72 p-10">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-[#FF7F50]">
            Welcome, {userName}!
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <NavLink
              to="/admin/categories"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-[#FFA500] hover:bg-[#FFF1E0] cursor-pointer block"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#FFA500] mb-4">
                  Categories
                </h3>
                <p className="text-gray-700">Organize and manage categories.</p>
                <span className="block mt-6 text-[#FF7F50] font-semibold hover:underline">
                  Go to Categories
                </span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/products"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-[#FFB347] hover:bg-[#FFF1E0] cursor-pointer block"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#FFB347] mb-4">
                  Products
                </h3>
                <p className="text-gray-700">
                  View, add, and update your product listings.
                </p>
                <span className="block mt-6 text-[#FF7F50] font-semibold hover:underline">
                  Go to Products
                </span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/users"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 border-l-4 border-[#FF9966] hover:bg-[#FFF1E0] cursor-pointer block"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#FF9966] mb-4">
                  Users
                </h3>
                <p className="text-gray-700">
                  Manage your user base and roles.
                </p>
                <span className="block mt-6 text-[#FF7F50] font-semibold hover:underline">
                  Go to Users
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
