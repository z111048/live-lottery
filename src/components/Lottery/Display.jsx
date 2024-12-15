// src/components/Lottery/Display.jsx
// import React from 'react';
import PropTypes from 'prop-types';

const Display = ({ isSpinning, spinningPrizes }) => {
  return (
    <div className={`prize-display ${isSpinning ? 'spinning' : ''}`}>
      <div className='prize-indicator' />
      <div className='prize-list-container'>
        {spinningPrizes.map((prize, index) => (
          <div key={index} className='prize-item'>
            {prize}
          </div>
        ))}
      </div>
    </div>
  );
};

Display.propTypes = {
  isSpinning: PropTypes.bool.isRequired,
  spinningPrizes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Display;
