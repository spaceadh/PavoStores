import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews: [reviewSchema],
  
  },
  {
    timestamps: true,
  }
);
productSchema.pre('save', async function(next) {
  const maxPriceProduct = await this.constructor.findOne().sort({ price: -1 });
  this.maxprice = maxPriceProduct ? maxPriceProduct.price : 0;
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
