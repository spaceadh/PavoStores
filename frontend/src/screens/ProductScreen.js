import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import Footer from '../components/Footer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_REVIEWS_REQUEST':
      return { ...state, loadingReviews: true };
    case 'FETCH_REVIEWS_SUCCESS':
      return { ...state, reviews: action.payload, loadingReviews: false };
    case 'FETCH_REVIEWS_FAIL':
      return { ...state, loadingReviews: false, reviewsError: action.payload };
    case 'ADD_REVIEW':
      return {
        ...state,
        product: {
          ...state.product,
          reviews: [...state.product.reviews, action.payload],
        },
      };
    default:
      return state;
  }
};

function ProductScreen() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (product && product._id) {
        dispatch({ type: 'FETCH_REVIEWS_REQUEST' });
        try {
          const result = await axios.get(`/api/products/${product._id}/reviews`);
          dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: result.data });
        } catch (err) {
          dispatch({ type: 'FETCH_REVIEWS_FAIL', payload: getError(err) });
        }
      }
    };

    fetchReviews();
  }, [product]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    console.log('Adding to cart...');
    try {
      const existItem = cart.cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;

      const { data } = await axios.get(`/api/products/${product._id}`);

      if (data.countInStock < quantity) {
        window.alert('Sorry. Product is out of stock');
        return;
      }

      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
    navigate('/cart');
  };

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
        { headers: { Authorization: `Bearer ${state.userInfo.token}` } }
      );
      console.log('Review submitted:', data);
      console.log('Submitting review:', { rating, comment });

      dispatch({ type: 'ADD_REVIEW', payload: data }); // Add the new review to state
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const totalReviews = product?.reviews?.length || 0;

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
          </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: Ksh{product.price}</ListGroup.Item>
            <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>Ksh{product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="reviews-section">
  <h3 className="total-reviews">Total Reviews: {totalReviews}</h3>

  {/* Show initial two reviews */}
  <ListGroup className="reviews-list" variant="flush">
    {product.reviews &&
      product.reviews.slice(0, 2).map((review, index) => (
        <ListGroup.Item key={index} className="review-item">
          <div className="review-content">
            <div className="review-header">
              <Rating rating={review.rating} />
              <p className="review-author">By: {review.name}</p>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        </ListGroup.Item>
      ))}
  </ListGroup>

  {/* Show more reviews button */}
  {product.reviews && product.reviews.length > 2 && (
    <div className="show-more-button">
      <button
        className="btn btn-show-reviews"
        onClick={() => setShowAllReviews(!showAllReviews)}
      >
        {showAllReviews ? 'Show Less Reviews' : 'Show More Reviews'}
      </button>
    </div>
  )}

  {/* Additional reviews */}
  {showAllReviews && product.reviews && product.reviews.length > 2 && (
    <ListGroup className="additional-reviews" variant="flush">
      {product.reviews.slice(2).map((review, index) => (
        <ListGroup.Item key={index} className="review-item">
          <div className="review-content">
            <div className="review-header">
              <Rating rating={review.rating} />
              <p className="review-author">By: {review.name}</p>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )}

  {/* Review Form */}
  <h2 className="review-form-title">Leave a Review</h2>
  <form onSubmit={submitReview} className="review-form">
    {/* Rating select */}
    <div className="form-group">
      <label htmlFor="rating">Rating:</label>
      <select
        id="rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="form-control"
      >
        <option value={0}>Select Rating...</option>
        <option value={1}>1 - Poor</option>
        <option value={2}>2 - Fair</option>
        <option value={3}>3 - Average</option>
        <option value={4}>4 - Good</option>
        <option value={5}>5 - Excellent</option>
      </select>
    </div>

    {/* Comment textarea */}
    <div className="form-group">
      <label htmlFor="comment">Comment:</label>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="form-control"
      ></textarea>
    </div>

    {/* Submit button */}
    <button type="submit" className="btn btn-submit-review">
      Submit Review
    </button>
  </form>
</div>

      <Footer />
    </div>
  );
}

export default ProductScreen;
