import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import { motion, AnimatePresence } from 'framer-motion';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [visible, setVisible] = useState(1);

    const toggleVisibility = () => {
        if (visible >= posts.length) {
            setVisible(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1); 
        } else {
            setVisible(prevVisible => prevVisible + 5); 
        }
    };

    useEffect(() => {
        axios.get("http://localhost:3001/posts")
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Veri çekme hatası:', error);
            });
    }, []);

    // Ekran genişliğini takip eden useEffect
    useEffect(() => {
        const updateVisiblePosts = () => {
            if (window.innerWidth >= 1024) {
                setVisible(4);
            } else if (window.innerWidth >= 768) {
                setVisible(2);
            } else {
                setVisible(1);
            }
        };

        updateVisiblePosts(); // İlk yükleme anında çağır
        window.addEventListener('resize', updateVisiblePosts);

        return () => {
            window.removeEventListener('resize', updateVisiblePosts);
        };
    }, []);

    if (posts.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='min-w-[428px] max-w-[1580px] h-auto mx-auto pb-5 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 mt-10'>
            <h4 className='mt-5 ml-2 text-[#1c274c] text-base md:text-2xl lg:text-[32px] font-extrabold lg:font-bold'>
                Gönderiler
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                <AnimatePresence>
                    {posts.slice(0, visible).map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <PostCard
                                profileImg={post.profileImg}
                                userName={post.userName}
                                title={post.title}
                                content={post.content}
                                image={post.image}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button 
                onClick={toggleVisibility} 
                className="m-auto mt-4 flex text-2xl font-semibold md:text-md lg:text-lg items-center gap-1 text-[#22ff22] relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#22ff22] after:transition-all after:duration-300 hover:after:w-full"
            >
                {visible >= posts.length ? "Gizle" : "Tüm Gönderileri Gör"} 
                <svg
                    xmlns="http://www.w3.org/2000/svg"                 
                    className="w-6 font-bold lg:w-6 lg:h-6 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    );
};

export default Posts;
