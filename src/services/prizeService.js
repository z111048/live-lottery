// src/services/prizeService.js
import { WS_EVENTS } from '../constants/events';

export const prizeService = {
  updatePrizes(ws, prizes) {
    ws.send(WS_EVENTS.UPDATE_PRIZES, { prizes });
  },

  startSpin(ws) {
    ws.send(WS_EVENTS.START_SPIN);
  },

  adminLogin(ws, token) {
    ws.send(WS_EVENTS.AUTH_ADMIN, { token });
  },
};
