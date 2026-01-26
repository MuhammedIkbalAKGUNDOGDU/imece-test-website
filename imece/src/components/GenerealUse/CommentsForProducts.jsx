import { useState, useEffect } from "react";
import CommentCard from "./CommentCardForProducts";
import { apiKey } from "../../config";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieManager";

const Comments = ({ sellerId }) => {
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
    try {
      const token = getCookie("accessToken");

      const response = await fetch(
        "https://imecehub.com/api/products/urunyorum/takecommentsforseller/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({ magaza_id: sellerId }),
        }
      );

      if (!response.ok) {
        throw new Error("Sunucu hatası: " + response.status);
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Yorumlar yüklenirken hata oluştu:", error);
    }
  };
  console.log(comments);
  return (
    <div className="min-w-[428px] max-w-[1580px] h-auto mx-auto pb-5 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 mt-10">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Mağaza Yorumları</h2>
        <div className="md:grid md:grid-cols-2 md:gap-4 overflow-x-auto flex flex-nowrap gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="min-w-[300px] md:min-w-0 snap-start"
            >
              <CommentCard
                name={comment.kullanici_adi}
                rating={comment.puan}
                comment={comment.yorum}
                initial={comment.kullanici_adi?.charAt(0) ?? "?"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;
