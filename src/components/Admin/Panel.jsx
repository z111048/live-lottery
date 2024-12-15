// src/components/Admin/Panel.jsx
// import React from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';

const Panel = ({ onFileUpload, onSpin, fileName, isConnected, isSpinning, prizesCount }) => {
  return (
    <div className='admin-panel'>
      <div className='file-upload'>
        <h3>上傳獎項清單</h3>
        <input
          type='file'
          id='prizeFile'
          name='prizeFile'
          accept='.csv'
          onChange={(e) => onFileUpload(e.target.files[0])}
          className='file-input'
          disabled={!isConnected}
        />
        {fileName && <div className='file-name'>已上傳：{fileName}</div>}
      </div>

      <Button
        onClick={onSpin}
        disabled={prizesCount === 0 || isSpinning || !isConnected}
        variant='secondary'
        className='spin-button'
      >
        {isSpinning ? '抽獎中...' : '開始抽獎 (空白鍵)'}
      </Button>
    </div>
  );
};

Panel.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
  onSpin: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  isSpinning: PropTypes.bool.isRequired,
  prizesCount: PropTypes.number.isRequired,
};

export default Panel;
