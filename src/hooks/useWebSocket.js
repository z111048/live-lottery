// src/hooks/useWebSocket.js
import { useState, useEffect } from 'react';
import { WS_URL } from '../constants/config';
import { MAX_RECONNECT_ATTEMPTS, RECONNECT_DELAY } from '../constants/config';

export const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let websocket = null;
    let isSubscribed = true;
    let reconnectAttempts = 0;

    const handleMessage = (event) => {
      if (!isSubscribed) return;
      try {
        const data = JSON.parse(event.data);
        return data;
      } catch (error) {
        console.error('處理消息時發生錯誤:', error);
      }
    };

    const handleOpen = () => {
      if (!isSubscribed) return;
      console.log('已連接到抽獎系統');
      setIsConnected(true);
      setError('');
      reconnectAttempts = 0;
    };

    const handleClose = (event) => {
      if (!isSubscribed) return;
      console.log('連線已關閉，狀態碼:', event.code);
      setIsConnected(false);

      if (event.code !== 1000 && event.code !== 1001 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        setError(`與伺服器連線中斷，正在嘗試重新連接... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(connectWebSocket, RECONNECT_DELAY);
      } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        setError('無法連接到伺服器，請重新整理頁面');
      }
    };

    const handleError = (error) => {
      if (!isSubscribed) return;
      console.error('WebSocket錯誤:', error);
      setError('連線發生錯誤');
      setIsConnected(false);
    };

    const connectWebSocket = () => {
      if (!isSubscribed) return;

      if (websocket) {
        websocket.removeEventListener('open', handleOpen);
        websocket.removeEventListener('message', handleMessage);
        websocket.removeEventListener('close', handleClose);
        websocket.removeEventListener('error', handleError);
        websocket.close();
      }

      try {
        websocket = new WebSocket(WS_URL);
        websocket.addEventListener('open', handleOpen);
        websocket.addEventListener('message', handleMessage);
        websocket.addEventListener('close', handleClose);
        websocket.addEventListener('error', handleError);
        setWs(websocket);
      } catch (error) {
        console.error('建立WebSocket連接時發生錯誤:', error);
        handleError(error);
      }
    };

    const initWebSocket = () => {
      if (document.readyState === 'complete') {
        setTimeout(connectWebSocket, 1000);
      } else {
        window.addEventListener('load', () => setTimeout(connectWebSocket, 1000));
      }
    };

    initWebSocket();

    return () => {
      isSubscribed = false;
      if (websocket) {
        websocket.removeEventListener('open', handleOpen);
        websocket.removeEventListener('message', handleMessage);
        websocket.removeEventListener('close', handleClose);
        websocket.removeEventListener('error', handleError);
        websocket.close();
      }
      window.removeEventListener('load', connectWebSocket);
    };
  }, []);

  return {
    ws,
    isConnected,
    error,
    setError,
  };
};
