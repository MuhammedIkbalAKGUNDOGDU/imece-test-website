import React from 'react';

const PostCard = ({ profileImg, userName, title, content, image }) => {
    return (

        <div className=" w-[380px] min-h-[500px] mt-5 mx-auto bg-white rounded-t-lg lg:rounded-lg  overflow-hidden lg:shadow-lg border border-[#DDDDDD] kanit">
            {/* Photo and Name */}
            <div className='flex m-2 items-center gap-2'>
                <img className='w-[36.5px] h-[36.5px] rounded-full' src={profileImg} alt="Profile Image" />
                <h3>{userName}</h3>
            </div>

            <img className='w-[369px] h-[294px] mx-auto rounded-lg' src={image} alt="Post Image" />
            <h4 className='text-[20px] text-[#1C274C] font-bold montserrat m-1'>{title}</h4>
            <p className='text-[16px] text-[#000000] font-normal montserrat my-2 mx-1 lg:mb-8'>{content}</p>

        </div>


    );
};



export default PostCard;