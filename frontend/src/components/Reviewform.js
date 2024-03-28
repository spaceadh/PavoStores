import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ product, userInfo, refreshProduct }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      if (!product || !product._id) {
        console.error('Product ID is missing or undefined.');
        return;
      }

      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating: rating, comment: comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      console.log('Review submitted:', data);

      refreshProduct();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      <h2>Leave a Review</h2>
      <form onSubmit={submitReview}>
        <div>
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={0}>Select Rating...</option>
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Average</option>
            <option value={4}>4 - Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;