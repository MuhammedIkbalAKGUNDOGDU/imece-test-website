import React, { useEffect, useState } from "react";
import axios from "axios";
import AboutSection from "@/components/profileComponents/AboutSection.jsx";
import ProfileGiris from "@/components/profileComponents/ProfileGiris.jsx";
import ProfileStatistics from "@/components/profileComponents/ProfileStatistics.jsx";
import Posts from "@/components/profileComponents/Posts.jsx";
import Comments from "@/components/profileComponents/Comments.jsx";
import Header from "../components/GenerealUse/Header";
import { useParams } from "react-router-dom";
import ItemCard4 from "../components/GenerealUse/ItemCard4";
import ItemGrid from "../components/GenerealUse/ItemGrid";
import { apiKey } from "../config";

export default function ProfilUreticiPage() {
  const { id } = useParams();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerProdcts, setSellerProducts] = useState(null);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        

        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info-full/",
          data: {
            kullanici_id: id,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });
        console.log("ProfilUreticiPage - API Response:", response.data);
        setSellerInfo(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
        console.error("Hata detayı:", error.response?.data);
      }
    };

    fetchSellerInfo();
  }, [id]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-products/",
          data: {
            kullanici_id: id,
          },
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
        });
        setSellerProducts(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
      }
    };
    fetchSellerProducts();
  }, []);
  return (
    <div>
      <div className="mx-[4%] md:mx-[8%] mb-8">
        <Header />
      </div>
      <ProfileGiris sellerInfo={sellerInfo} sellerId={id} />
      <AboutSection sellerDescription={sellerInfo?.profil_tanitim_yazisi} />
      {/* <Posts /> */}
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-left">
          Satıcının Diğer Ürünleri
        </h2>
        {sellerProdcts ? (
          <ItemGrid cardType="card4" items={sellerProdcts} />
        ) : (
          <p>Ürünler yükleniyor...</p>
        )}
      </div>
      <Comments sellerId={id} />
    </div>
  );
}
