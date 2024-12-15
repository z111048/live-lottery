// src/components/Lottery/List.jsx
// import React from 'react';
import PropTypes from 'prop-types';

const List = ({ prizes }) => {
  return (
    <div className='remaining-prizes'>
      <h3>剩餘獎項 ({prizes.length})</h3>
      <div className='prizes-grid'>
        {prizes.map((prize, index) => (
          <div key={index} className='remaining-prize-item'>
            {prize}
          </div>
        ))}
      </div>
    </div>
  );
};

List.propTypes = {
  prizes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default List;
