import Product from '../models/productModel.js';

const getMaxPrice = async (req, res) => {
  try {
    const maxPriceProduct = await Product.findOne().sort({ price: -1 }); // Find the product with the highest price
    const maxPrice = maxPriceProduct ? maxPriceProduct.price : 0; // Get the highest price or default to 0
    res.json({ maxPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching max price' });
  }
};


const getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await Product.find({ countInStock: 0 });
    res.json({ outOfStockProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching out of stock products' });
  }
};


const getInStockProducts = async (req, res) => {
  try {
    const inStockProducts = await Product.find({ countInStock: { $gt: 0 } });
    res.json({ inStockProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching in stock products' });

  }
};
const getTotalSales = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Delivered' }); // Assuming 'Delivered' status indicates a completed sale
    let totalSales = 0;
    orders.forEach((order) => {
      totalSales += order.totalPrice; // Assuming totalPrice field in the order model represents the sale amount
    });
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total sales' });
  }
};

export { getMaxPrice,getInStockProducts,getOutOfStockProducts,getTotalSales };


