import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductInformation from "./pages/ProductInformation.jsx";
import Cart from "./pages/Cart.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.jsx";
import Checkout from "./pages/Checkout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/*" element={<ErrorPage />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/auth/register" element={<Signup />} />
      <Route path="/categories/:category" element={<ProductCategory />} />
      <Route path="/product" element={<ProductInformation />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
