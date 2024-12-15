// src/components/common/Button.jsx
// import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, disabled = false, type = 'button', className = '' }) => {
  // console.log('Button props:', { onClick, disabled, type });
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className}`}
      style={{
        // padding: '8px 16px',
        backgroundColor: disabled ? '#ccc' : '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
