// ReviewItem.js

import React from 'react';
import Rating from '@mui/material/Rating';

const ReviewItem = ({ avatar, username, rating, date, sku, content }) => {
  return (
    <div className="flex items-center mb-8">
      <div className="mr-4">
        <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
      </div>
      <div>
        <div className="flex items-center mb-1">
          <p className="mr-2 font-semibold">{username}</p>
          <div>
                <Rating defaultValue={rating} precision={0.1} readOnly sx={{ fontSize: '1.2rem' }}/>
          </div>
        </div>
        <p className="text-gray-500 mb-3">
          {date} | Phân loại:&nbsp;{sku}
        </p>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
