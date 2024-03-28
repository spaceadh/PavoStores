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
  