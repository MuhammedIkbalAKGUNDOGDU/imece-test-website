import { useState, useEffect } from "react";
import CommentCard from "./CommentCard";

const Comments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:3001/comments");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Yorumlar yüklenirken hata oluştu:", error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="min-w-[428px] max-w-[1580px] h-auto mx-auto pb-5 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 mt-10">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          Profilinde Aktif olarak gözüken yorumlar
        </h2>
        <div className="md:grid md:grid-cols-2 md:gap-4 overflow-x-auto flex flex-nowrap gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {comments.map((comment) => (
            <div key={comment.id} className="min-w-[300px] md:min-w-0 snap-start">
              <CommentCard
                name={comment.name}
                rating={comment.rating}
                comment={comment.comment}
                initial={comment.name.charAt(0)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments; 