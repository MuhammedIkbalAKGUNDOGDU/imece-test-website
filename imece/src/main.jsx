import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import RefreshPassowrd from "./pages/refreshPassword";
import Products from "./pages/products";
import Profile from "./pages/profile";
import Basket from "./pages/basket";
import OrderPage from "./pages/orderPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/products" element={<Products />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/basket" element={<Basket />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/new-password" element={<RefreshPassowrd />}></Route>
      <Route path="/order-page" element={<OrderPage />}></Route>
    </Routes>
  </BrowserRouter>
);
