import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Doughnut, Line } from 'react-chartjs-2';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [doughnutData, setDoughnutData] = useState(null); // Define doughnutData state
  const [outOfStockCount, setOutOfStockCount] = useState(0); // Define state for out-of-stock count
  const [inStockCount, setInStockCount] = useState(0); // Define state for in-stock count

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const { data: apiData} = await axios.get('/api/products/out-of-stock', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const { data: apiData1 } = await axios.get('/api/products/in-stock', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log('Fetched Data:',  data );

        // Update the counts based on fetched data
        const outOfStockProductsLength = apiData.outOfStockProducts.length;
        const inStockProductsLength = apiData1.inStockProducts.length;

        // Update the doughnutData state with actual data from the backend
        setDoughnutData({
          labels: ['Out of Stock', 'In Stock'],
          datasets: [
            {
              data: [outOfStockProductsLength,inStockProductsLength ], // Use the counts as data points
               backgroundColor: ['#FF6384', '#36A2EB'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB'],
            
            },
          ],
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    fetchData();
  }, [userInfo, outOfStockCount, inStockCount]); // Include outOfStockCount and inStockCount in dependencies

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
                    <Card>
          <Card.Body>
            <Card.Title>
              {summary.productCategories && summary.productCategories.length > 0
                ? summary.productCategories.length // Display the length of productCategories array
                : 0}
            </Card.Title>
            <Card.Text>Product Categories</Card.Text>
          </Card.Body>
        </Card>
        </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
            <Card>
  <Card.Body>
    <Card.Title>
      {summary.dailyOrders && summary.dailyOrders.length > 0
        ? summary.dailyOrders.length // Display the length of dailyOrders array
        : 0}
    </Card.Title>
    <Card.Text>Daily Orders</Card.Text>
  </Card.Body>
</Card>

            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Ksh.
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Total Sales</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {doughnutData && (
            <Row className="justify-content-center align-items-center">
              <Col md={6}>
                <Doughnut data={doughnutData} />
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}
