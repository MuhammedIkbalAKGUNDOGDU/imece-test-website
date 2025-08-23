import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/GenerealUse/Header";
import "../styles/landingpage.css";
import "../styles/landingPage_styles/stories.css";
import "../styles/landingPage_styles/campaignSlider.css";
import Banner from "../components/landingPage/Banner";
import goBottom from "../assets/vectors/goBottom.svg";
import AliciAndSaticiOl from "../components/landingPage/AliciAndSaticiOl";
import Footer from "../components/GenerealUse/Footer";
import Saticilar from "../components/landingPage/Saticilar";
import IndirimliUrunler from "../components/landingPage/IndirimliUrunler";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import StoriesComponent from "../components/landingPage/StoriesComponent";
import CampaignSlider from "../components/landingPage/CampaignSlider";
import WhatsAppButton from "../components/GenerealUse/WhatsAppButton";
import { apiKey } from "../config";

const LandingPage = () => {
  const apiUrl = "https://imecehub.com/api/users/kullanicilar/me/";
  const accesToken = localStorage.getItem("accessToken");

  const popularProductsUrl = "https://imecehub.com/products/populer-urunler/";

  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  const headers = {
    "X-API-Key": apiKey,
    Authorization: `Bearer ${accesToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(apiUrl, { headers });
        setUserId(response.data.id);
        localStorage.setItem("userId", response.data.id);
      } catch (error) {
        console.error("Kullanıcı bilgisi alınırken hata:", error.message);
      }
    };

    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get(popularProductsUrl, {
          headers: { "Content-Type": "application/json" },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Popüler ürünler alınırken hata:", error.message);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          "https://imecehub.com/api/users/favori-urunler/",
          { headers }
        );
        const favIds = res.data.map((item) => item.urun);
        setFavorites(favIds);
      } catch (err) {
        console.error("Favoriler alınırken hata:", err.message);
        setFavorites([]);
      }
    };

    if (accesToken) {
      fetchUserData();
      fetchFavorites();
    }

    fetchPopularProducts();
  }, []);

  const addFavorite = async (userId, productId) => {
    try {
      await axios.post(
        "https://imecehub.com/api/users/favori-urunler/",
        { alici: userId, urun: productId },
        { headers }
      );
      return true;
    } catch (err) {
      console.error("Favori ekleme hatası:", err.message);
      return false;
    }
  };

  const removeFavorite = async (userId, productId) => {
    try {
      await axios.post(
        "https://imecehub.com/users/delete-favourite/",
        { alici_id: userId, urun_id: productId },
        { headers }
      );
      return true;
    } catch (err) {
      console.error("Favori silme hatası:", err.message);
      return false;
    }
  };

  const handleFavoriteToggle = async (productId) => {
    if (!userId) return;

    const isFav = favorites.includes(productId);
    const success = isFav
      ? await removeFavorite(userId, productId)
      : await addFavorite(userId, productId);

    if (success) {
      const updated = isFav
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      setFavorites(updated);
    }
  };

  return (
    <div>
      <div className="landingPage">
        <Header />
        {/* Campaign Slider */}
        <CampaignSlider />
        
        {/* Stories Component */}
        <StoriesComponent />

        <div className="flex justify-center">
          <img
            className="clickable pointer landingPageGoBottom"
            src={goBottom}
            alt="Aşağı Kaydır"
          />
        </div>

        {/* Popüler Ürünler */}
        <div className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-6 text-left">Popüler Ürünler</h2>
          <ItemGrid
            cardType="card4"
            items={items}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>

        <IndirimliUrunler />
        <Saticilar />

        {!accesToken && <AliciAndSaticiOl />}
      </div>
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;
