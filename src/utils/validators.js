// src/utils/validators.js
import { MAX_PRIZES } from '../constants/config';

export const validatePrizes = (prizes) => {
  if (!Array.isArray(prizes)) {
    throw new Error('無效的獎項格式');
  }

  if (prizes.length === 0) {
    throw new Error('CSV 檔案中沒有有效的獎項');
  }

  if (prizes.length > MAX_PRIZES) {
    throw new Error(`獎項數量不能超過 ${MAX_PRIZES} 個`);
  }

  return true;
};

export const validateAdminToken = (token) => {
  if (!token || !token.trim()) {
    throw new Error('請輸入管理員密碼');
  }
  return true;
};
