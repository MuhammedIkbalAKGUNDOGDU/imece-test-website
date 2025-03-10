import AboutSection from "@/components/profileComponents/AboutSection.jsx";
import ProfilGiris from "@/components/profileComponents/ProfilGiris.jsx";
import ProfileStatistics from "@/components/profileComponents/ProfileStatistics.jsx";
import Posts from "@/components/profileComponents/Posts.jsx";
import Comments from "@/components/profileComponents/Comments.jsx";
import Header from "../components/GenerealUse/Header";

export default function ProfilUreticiPage() {
  return (
    <div>
      <div className="mx-[4%] md:mx-[8%] mb-8">
        <Header />
      </div>{" "}
      <ProfilGiris />
      <ProfileStatistics />
      <AboutSection />
      <Posts />
      <Comments />
      <p className="mt-10">Satıştaki ürünler</p>
    </div>
  );
}
