// src/components/Lottery/Winner.jsx
// import React from 'react';
import PropTypes from 'prop-types';

const Winner = ({ winner }) => {
  if (!winner) return null;

  return (
    <div className='winner-announcement'>
      <h2>🎉 恭喜得獎！</h2>
      <div className='winner-prize'>{winner}</div>
    </div>
  );
};

Winner.propTypes = {
  winner: PropTypes.string,
};

export default Winner;
