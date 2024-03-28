import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Product from '../components/Product';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import Slider from 'react-bootstrap-range-slider';
import Footer from '../components/Footer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products || [],
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts || [],
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },
  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const brand = sp.get('brand') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const ratingFilter = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;
  
  

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); // Default max price, adjust as needed
  

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const response = await axios.get(`/api/products/maxprice`);
        setMaxPrice(response.data.maxPrice || 10000); // Update max price in state
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchMaxPrice();
  }, []);

  const handlePriceChange = () => {
    // Update the URL query parameters with the selected price range
    navigate(
      getFilterUrl({
        price: `${minPrice}-${maxPrice}`,
      })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); // Dispatch fetch request action
  
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&brand=${brand}&price=${minPrice}-${maxPrice}&rating=${ratingFilter}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // Dispatch success action with fetched data
      } catch (error) {
        const errorMessage = getError(error); // Utilize getError function or handle error message extraction
        dispatch({
          type: 'FETCH_FAIL',
          payload: errorMessage, // Dispatch fail action with error message
        });
        toast.error(errorMessage); // Show toast notification for the error
        console.error('Axios error:', error); // Log the error for debugging
      }
    };
  
    fetchData(); // Call fetchData function
  }, [category, brand, order, page, minPrice, maxPrice, query, ratingFilter]); // Include minPrice and maxPrice in the dependency array
  
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(`/api/products/brands`);
        setBrands(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchBrands();
  }, []);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterBrand = filter.brand || brand;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || ratingFilter;
   const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&brand=${filterBrand}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  const priceRange = { min: 0, max: maxPrice }; 
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Categories</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Brands</h3>
            <ul>
              <li>
                <Link
                  className={'all' === brand ? 'text-bold' : ''}
                  to={getFilterUrl({ brand: 'all' })}
                >
                  Any
                </Link>
              </li>
              {brands.map((b) => (
                <li key={b}>
                  <Link
                    className={b === brand ? 'text-bold' : ''}
                    to={getFilterUrl({ brand: b })}
                  >
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
          <h3>Price Range</h3>
          <div>
            <span>Min Price: {minPrice}</span>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value))}
            />
          </div>
          <div>
            <span>Max Price: {maxPrice}</span>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            />
          </div>
          <span>
            Price Range: {minPrice} - {maxPrice === 'all' ? 'Any' : `Ksh.${maxPrice}`}
          </span>
        </div>

          <div>
            <h3>Rating</h3>
            <ul>
              <li>
                <Link
                  className={'all' === ratingFilter ? 'text-bold' : ''}
                  to={getFilterUrl({ rating: 'all' })}
                >
                  Any
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r.rating}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={r.rating === ratingFilter ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {brand !== 'all' && ' : ' + brand}
                    {price !== 'all' && ' : Price ' + price}
                    {ratingFilter !== 'all' && ' : Rating ' + ratingFilter + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    ratingFilter !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {products && products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              {products && products.length > 0 && (
                <Row>
                  {products.map((product) => (
                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
              )}
              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/search',
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
      <Footer/>
    </div>
  );
}
