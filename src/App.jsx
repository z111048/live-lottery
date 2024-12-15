import { useState, useEffect } from 'react';
import Login from './components/Admin/Login';
import Panel from './components/Admin/Panel';
import Display from './components/Lottery/Display';
import Winner from './components/Lottery/Winner';
import List from './components/Lottery/List';
import { useWebSocket } from './hooks/useWebSocket';
import { usePrizes } from './hooks/usePrizes';
import { WS_EVENTS } from './constants/events';
import './App.css';

function App() {
  const { ws, isConnected, error, setError } = useWebSocket();
  const {
    prizes,
    setPrizes,
    winner,
    setWinner,
    isSpinning,
    setIsSpinning,
    spinningPrizes,
    setSpinningPrizes,
    fileName,
    handleFileUpload,
    handleSpin,
  } = usePrizes(ws, isConnected, setError);

  const [isAdmin, setIsAdmin] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case WS_EVENTS.STATE_UPDATE:
          setPrizes(data.prizes);
          setIsSpinning(data.isSpinning);
          setWinner(data.winner);
          if (data.winner && !data.isSpinning) {
            setSpinningPrizes([data.winner]);
          } else if (!data.isSpinning) {
            setSpinningPrizes(data.prizes);
          }
          break;

        case WS_EVENTS.SPIN_START:
          setIsSpinning(true);
          setWinner('');
          if (data.prizes?.length > 0 && data.selectedPrize) {
            const currentPrizes = [...data.prizes];
            const firstSection = [...currentPrizes].sort(() => Math.random() - 0.5);
            const middleSection = [...currentPrizes].sort(() => Math.random() - 0.5);
            const lastSection = [...currentPrizes.filter((prize) => prize !== data.selectedPrize), data.selectedPrize];

            const fullList = [...firstSection, ...middleSection, ...lastSection];
            setSpinningPrizes(fullList);
          }
          break;

        case WS_EVENTS.ADMIN_AUTH_SUCCESS:
          setIsAdmin(true);
          setError('');
          break;

        case WS_EVENTS.USERS_COUNT:
          setConnectedUsers(data.count);
          break;

        case WS_EVENTS.ERROR:
          setError(data.message);
          break;
      }
    };
  }, [ws, setError, setIsSpinning, setPrizes, setSpinningPrizes, setWinner]);

  // 新增：全局監聽空白鍵按下事件
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' && isAdmin && isConnected && prizes.length > 0 && !isSpinning) {
        event.preventDefault(); // 防止空白鍵的默認滾動行為
        handleSpin(); // 執行抽獎邏輯
      }
    };

    // 添加鍵盤事件監聽
    window.addEventListener('keydown', handleKeyPress);

    // 清理鍵盤事件監聽
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAdmin, isConnected, prizes.length, isSpinning, handleSpin]);

  const handleAdminLogin = (token) => {
    console.log('Attempting login with token:', token); // 添加調試日誌
    if (!token.trim()) {
      setError('請輸入管理員密碼');
      return;
    }
    if (!isConnected || !ws) {
      setError('未連接到伺服器');
      return;
    }
    try {
      ws.send(
        JSON.stringify({
          type: WS_EVENTS.AUTH_ADMIN,
          token: token,
        }),
      );
    } catch (error) {
      console.error('Send error:', error);
      setError('發送請求時發生錯誤');
    }
  };

  return (
    <div className='container'>
      <header className='header'>
        <h1>即時抽獎系統</h1>
        <div className='users-count'>在線人數: {connectedUsers}</div>
      </header>

      {!isAdmin ? (
        <Login onSubmit={handleAdminLogin} isConnected={isConnected} error={error} />
      ) : (
        <Panel
          onFileUpload={handleFileUpload}
          onSpin={handleSpin}
          fileName={fileName}
          isConnected={isConnected}
          isSpinning={isSpinning}
          prizesCount={prizes.length}
        />
      )}

      {error && <div className='error-message'>{error}</div>}

      <div className='lottery-section'>
        <Display isSpinning={isSpinning} spinningPrizes={spinningPrizes} />

        {winner && !isSpinning && <Winner winner={winner} />}
      </div>

      <List prizes={prizes} />
    </div>
  );
}

export default App;
