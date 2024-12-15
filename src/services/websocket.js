// src/services/websocket.js
// import { WS_EVENTS } from '../constants/events';

class WebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          resolve(this.ws);
        };

        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onerror = reject;
      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const handler = this.handlers.get(data.type);
      if (handler) {
        handler(data);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  on(event, handler) {
    this.handlers.set(event, handler);
  }

  send(type, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketService;
