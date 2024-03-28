import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import Footer from '../components/Footer';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Marquee from 'react-fast-marquee';



const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  // Initialize the state using useReducer
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  // Destructure the state values
  const { loading, error, products } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <header>
        <h1>Featured Products</h1>
      </header>
      <main>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
          )}
        </div>
        <section className="marque-wrapper py-5">
    <div className="container-xxl">
      <div className="row">
        <div className="col-12">
          <div className="marquee-inner-wrapper card-wrapper">
            <Marquee className="d-flex">
            <div className="mx-4 w-25">
              <img src="images/oshol.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/greenlifel.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/basfl.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/twigal.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/yaral.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/basfl.webp" alt="brand" />
            </div>
            <div className="mx-4 w-25">
              <img src="images/bayerl.webp" alt="brand" />
            </div>
            
            </Marquee>
          </div>
        </div>
      </div>
    </div>
</section>

      </main>
      
      <Footer />
      
    </div>
  );
};

export default HomeScreen;