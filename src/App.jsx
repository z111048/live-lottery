// /* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import './App.css';

const WS_URL = import.meta.env.VITE_WS_URL;

function App() {
  const [ws, setWs] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [spinningPrizes, setSpinningPrizes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let websocket = null;
    let isSubscribed = true;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const handleMessage = (event) => {
      if (!isSubscribed) return;
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'STATE_UPDATE':
            setPrizes(data.prizes);
            setIsSpinning(data.isSpinning);
            setWinner(data.winner);

            if (data.winner && !data.isSpinning) {
              setSpinningPrizes([data.winner]);
            } else if (!data.isSpinning) {
              setSpinningPrizes(data.prizes);
            }
            break;

          case 'SPIN_START':
            setIsSpinning(true);
            setWinner('');
            if (data.prizes?.length > 0 && data.selectedPrize) {
              const currentPrizes = [...data.prizes];
              const firstSection = [...currentPrizes].sort(() => Math.random() - 0.5);
              const middleSection = [...currentPrizes].sort(() => Math.random() - 0.5);
              const lastSection = [
                ...currentPrizes.filter((prize) => prize !== data.selectedPrize),
                data.selectedPrize,
              ];

              const fullList = [...firstSection, ...middleSection, ...lastSection];
              setSpinningPrizes(fullList);
            }
            break;

          case 'ADMIN_AUTH_SUCCESS':
            setIsAdmin(true);
            setError('');
            break;

          case 'USERS_COUNT':
            setConnectedUsers(data.count);
            break;

          case 'ERROR':
            setError(data.message);
            break;
        }
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

      if (event.code !== 1000 && event.code !== 1001 && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setError(`與伺服器連線中斷，正在嘗試重新連接... (${reconnectAttempts}/${maxReconnectAttempts})`);
        setTimeout(connectWebSocket, 3000);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
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

      // 清理現有連接
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

    // 延遲初始化 WebSocket 連接
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

  const handleSpin = useCallback(() => {
    if (!isConnected || !ws) {
      setError('未連接到伺服器');
      return;
    }
    if (prizes.length === 0) {
      setError('請先上傳獎項');
      return;
    }
    ws.send(JSON.stringify({ type: 'START_SPIN' }));
  }, [isConnected, prizes.length, ws]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && isAdmin && !isSpinning && prizes.length > 0 && isConnected) {
        event.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin, isSpinning, prizes.length, handleSpin, isConnected]);

  const handleAdminLogin = useCallback(
    (e) => {
      e.preventDefault();
      if (!adminToken.trim()) {
        setError('請輸入管理員密碼');
        return;
      }
      if (!isConnected || !ws) {
        setError('未連接到伺服器');
        return;
      }
      ws.send(
        JSON.stringify({
          type: 'AUTH_ADMIN',
          token: adminToken,
        }),
      );
    },
    [adminToken, isConnected, ws],
  );

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        setError('請上傳 CSV 檔案');
        return;
      }

      Papa.parse(file, {
        complete: (results) => {
          const validPrizes = results.data.flat().filter((prize) => prize && prize.trim() !== '');

          if (validPrizes.length === 0) {
            setError('CSV 檔案中沒有有效的獎項');
            return;
          }

          if (validPrizes.length > 20) {
            setError('獎項數量不能超過 20 個');
            return;
          }

          if (!isConnected || !ws) {
            setError('未連接到伺服器');
            return;
          }

          ws.send(
            JSON.stringify({
              type: 'UPDATE_PRIZES',
              prizes: validPrizes,
            }),
          );

          setFileName(file.name);
          setError('');
        },
        error: (error) => {
          setError('檔案解析錯誤：' + error.message);
        },
      });
    },
    [isConnected, ws],
  );

  return (
    <div className='container'>
      <header className='header'>
        <h1>即時抽獎系統</h1>
        <div className='users-count'>在線人數: {connectedUsers}</div>
      </header>

      {!isAdmin ? (
        <div className='login-section'>
          <h2>管理員登入</h2>
          <form onSubmit={handleAdminLogin} className='login-form'>
            <input
              type='password'
              id='adminPassword' // 添加 id
              name='adminPassword' // 添加 name
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder='請輸入管理員密碼'
              className='password-input'
            />
            <button type='submit' className='login-button' disabled={!isConnected}>
              登入
            </button>
          </form>
        </div>
      ) : (
        <div className='admin-panel'>
          <div className='file-upload'>
            <h3>上傳獎項清單</h3>
            <input
              type='file'
              id='prizeFile' // 添加 id
              name='prizeFile' // 添加 name
              accept='.csv'
              onChange={handleFileUpload}
              className='file-input'
              disabled={!isConnected}
            />
            {fileName && <div className='file-name'>已上傳：{fileName}</div>}
          </div>

          <button
            onClick={handleSpin}
            disabled={prizes.length === 0 || isSpinning || !isConnected}
            className='spin-button'
          >
            {isSpinning ? '抽獎中...' : '開始抽獎 (空白鍵)'}
          </button>
        </div>
      )}

      {error && <div className='error-message'>{error}</div>}

      <div className='lottery-section'>
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

        {winner && !isSpinning && (
          <div className='winner-announcement'>
            <h2>🎉 恭喜得獎！</h2>
            <div className='winner-prize'>{winner}</div>
          </div>
        )}
      </div>

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
    </div>
  );
}

export default App;
