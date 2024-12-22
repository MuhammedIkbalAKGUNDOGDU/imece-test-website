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
import ChooseGroup from "./pages/chooseGroup";
import CreateGroup from "./pages/createGroup";
import AddUrun from "./pages/seller/urunEkle1";
import AddUrun2 from "./pages/seller/urunEkle2";
import AddUrun3 from "./pages/seller/urunEkle3";
import AddUrun4 from "./pages/seller/urunEkle4";
import GonderiOlustur from "./pages/seller/gonderiOlustur";
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
      <Route path="/order-page/choose-group" element={<ChooseGroup />}></Route>
      <Route path="/order-page/create-group" element={<CreateGroup />}></Route>
      <Route path="/Urun-Ekle-1" element={<AddUrun />}></Route>
      <Route path="/Urun-Ekle-2" element={<AddUrun2 />}></Route>
      <Route path="/Urun-Ekle-3" element={<AddUrun3 />}></Route>
      <Route path="/Urun-Ekle-4" element={<AddUrun4 />}></Route>
      <Route path="/gonderi-olustur" element={<GonderiOlustur />}></Route>
    </Routes>
  </BrowserRouter>
);
