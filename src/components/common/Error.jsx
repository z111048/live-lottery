// src/components/common/Error.jsx
// import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ message, className = '', onClose = null }) => {
  if (!message) return null;

  return (
    <div
      className={`
      error-message 
      bg-red-50 
      text-red-800 
      p-4 
      rounded-lg 
      border-l-4 
      border-red-600
      relative
      ${className}
    `}
    >
      <div className='flex items-center'>
        <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
            clipRule='evenodd'
          />
        </svg>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-red-600 hover:text-red-800'
          aria-label='關閉錯誤訊息'
        >
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default Error;
