import bcrypt from 'bcrypt';
const data = {

  users: [
    {
      name: 'MercyAdmin',
      PhoneNo:'0722222222',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456',10),
      isAdmin: true,
    },
    {
      name: 'Chemutai',
      PhoneNo:'0722222223',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456',10),
      isAdmin: false,
    },
  ],

    products: [
      {
        name: 'Escort',
        slug: 'Escort',
        category: 'Insecticides',
        image: '/images/Escort.webp', // 679px × 829px
        price: 1200,
        countInStock: 10,
        brand: 'Greenlife',
        rating: 4.5,
        numReviews: 10,
        description: 'high quality insecticide',
      },
      {
        name: 'Governor',
        slug: 'Governor',
        category: 'Herbicide',
        image: 'images/governor_580SE.webp',
        price: 999,
        countInStock: 20,
        brand: 'Greenlife',
        rating: 4.0,
        numReviews: 10,
        description: 'high quality herbicide',
      },
      {
        name: 'Biosure',
        slug: 'biosure',
        category: 'Fungicide',
        image: '/images/Biosure.webp',
        price: 25,
        countInStock: 15,
        brand: 'Greenlife',
        rating: 4.5,
        numReviews: 14,
        description: 'high quality herbicide',
      },
      {
        name: 'Lavender F & F',
        slug: 'lavender-ff', // adjusted slug for a URL-friendly format
        category: 'Fertilizers',
        image: '/images/Lavender-Flowers-Fruits.webp',
        price: 65,
        countInStock: 5,
        brand: 'Greenlife',
        rating: 4.5,
        numReviews: 10,
        description: 'Fruit and Flowers foliar',
      },
    ],
  };
  
  export default data;