import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import RefreshPassowrd from "./pages/refreshPassword";
import Products from "./pages/products";
import Profile from "./pages/Profile";
import Basket from "./pages/basket";
import OrderPage from "./pages/orderPage";
import ChooseGroup from "./pages/chooseGroup";
import CreateGroup from "./pages/createGroup";
import AddUrun from "./pages/seller/urunEkle1";
import AddUrun2 from "./pages/seller/urunEkle2";
import AddUrun3 from "./pages/seller/urunEkle3";
import AddUrun4 from "./pages/seller/urunEkle4";
import PostCreate from "./pages/PostCreatePage";
import CartPage from "./pages/basket";
import ChatPage from "./pages/ChatPage";
import FinancialDashboard from "./pages/financialDashboard";
import NotFound404 from "./pages/404Page";
import ProfileForUretici from "./pages/ProfilUreticiPage";
import SavePaymentCard from "./pages/savePaymentCard";
import SaticiRegister from "./pages/saticiRegister";
import SaticiLogin from "./pages/saticiLogin";
import Favoriler from "./pages/favoriler";
import { UrunProvider } from "./context/UrunContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UrunProvider>
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
        <Route path="/favoriler" element={<Favoriler />}></Route>
        <Route
          path="/order-page/choose-group"
          element={<ChooseGroup />}
        ></Route>
        {/* <Route
          path="/order-page/create-group"
          element={<CreateGroup />}
        ></Route> */}
        <Route path="/Urun-Ekle-1" element={<AddUrun />}></Route>
        <Route path="/Urun-Ekle-2" element={<AddUrun2 />}></Route>
        <Route path="/Urun-Ekle-3" element={<AddUrun3 />}></Route>
        <Route path="/Urun-Ekle-4" element={<AddUrun4 />}></Route>
        <Route path="/post-create" element={<PostCreate />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/chat" element={<ChatPage />}></Route>
        <Route path="/add-card" element={<SavePaymentCard />}></Route>
        <Route path="/register-seller" element={<SaticiRegister />}></Route>
        <Route path="/login-seller" element={<SaticiLogin />}></Route>

        <Route
          path="/profile/satici-profili/:id"
          element={<ProfileForUretici />}
        />
        <Route
          path="/financial-dashboard"
          element={<FinancialDashboard />}
        ></Route>
        <Route path="/*" element={<NotFound404 />}></Route>
      </Routes>
    </BrowserRouter>
  </UrunProvider>
);
