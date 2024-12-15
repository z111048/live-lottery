// src/hooks/usePrizes.js
import { useState, useCallback } from 'react';
import { validatePrizes } from '../utils/validators';
import { parseCSV } from '../utils/csvParser';
import { WS_EVENTS } from '../constants/events';

export const usePrizes = (ws, isConnected, setError) => {
  const [prizes, setPrizes] = useState([]);
  const [winner, setWinner] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningPrizes, setSpinningPrizes] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = useCallback(
    async (file) => {
      try {
        const parsedPrizes = await parseCSV(file);
        validatePrizes(parsedPrizes);

        if (!isConnected || !ws) {
          throw new Error('未連接到伺服器');
        }

        ws.send(
          JSON.stringify({
            type: WS_EVENTS.UPDATE_PRIZES,
            prizes: parsedPrizes,
          }),
        );

        setFileName(file.name);
        setError('');
      } catch (error) {
        setError(error.message);
      }
    },
    [isConnected, ws, setError],
  );

  const handleSpin = useCallback(() => {
    // console.log('Handle Spin executed', { isConnected, prizes, ws });
    if (!isConnected || !ws) {
      setError('未連接到伺服器');
      return;
    }
    if (prizes.length === 0) {
      setError('請先上傳獎項');
      return;
    }
    ws.send(JSON.stringify({ type: WS_EVENTS.START_SPIN }));
  }, [isConnected, prizes.length, ws, setError]);

  return {
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
  };
};
