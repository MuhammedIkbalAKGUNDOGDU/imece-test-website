import React, { useEffect, useState } from "react";
import axios from "axios";
import AboutSection from "@/components/profileComponents/AboutSection.jsx";
import ProfileGiris from "@/components/profileComponents/ProfileGiris.jsx";
import ProfileStatistics from "@/components/profileComponents/ProfileStatistics.jsx";
import Posts from "@/components/profileComponents/Posts.jsx";
import Comments from "@/components/profileComponents/Comments.jsx";
import Header from "../components/GenerealUse/Header";

export default function ProfilUreticiPage() {
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const id = 3; // kullanacağın ID
        const response = await axios({
          method: "post",
          url: "https://imecehub.com/users/seller-info-full/",
          data: {
            kullanici_id: id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        setSellerInfo(response.data);
      } catch (error) {
        console.error("Satıcı bilgileri alınamadı:", error);
      }
    };

    fetchSellerInfo();
  }, []);

  return (
    <div>
      <div className="mx-[4%] md:mx-[8%] mb-8">
        <Header />
      </div>
      <ProfileGiris sellerInfo={sellerInfo} />
      <ProfileStatistics />
      <AboutSection />
      <Posts />
      <Comments />
      <p className="mt-10">Satıştaki ürünler</p>
    </div>
  );
}
