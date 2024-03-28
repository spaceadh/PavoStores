import React from 'react';
import Slider from '@mui/material/Slider';

const PriceSlider = ({ minPrice, maxPrice, value, onChange }) => {
  return (
    <div>
      <h3>Price Range</h3>
      <Slider
        value={value}
        onChange={onChange}
        min={minPrice}
        max={maxPrice}
        valueLabelDisplay="auto"
        aria-label="Price range slider"
      />
    </div>
  );
};

export default PriceSlider;