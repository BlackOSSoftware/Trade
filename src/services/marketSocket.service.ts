// services/marketSocket.service.ts
export class MarketSocket {
  private socket: WebSocket | null = null;
  private pendingSubscriptions: Set<string> = new Set();
  private urlBase: string;
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private onMessageCb: ((m: any) => void) | null = null;
  private tokenInUrl: string | null = null;

  constructor() {
    this.urlBase = process.env.NEXT_PUBLIC_SOKETAPIBASE_URL || "";
  }

  connect(token: string, onMessage: (msg: any) => void) {
    // store callback & token for reconnect attempts
    this.onMessageCb = onMessage;
    this.tokenInUrl = token;

    // close existing socket if any
    if (this.socket) {
      try { this.socket.close(); } catch {}
      this.socket = null;
    }

    const url = `${this.urlBase}/market?token=${token}`;
    try {
      this.socket = new WebSocket(url);
    } catch (e) {
      // fallback to reconnect logic
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        window.clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      // flush pending subs (if any)
      this.pendingSubscriptions.forEach((symbol) => {
        this.sendSubscribe(symbol);
      });
      // don't clear pendingSubscriptions here — keep it so we can re-send on reconnects
      // but we can keep it cleared to avoid duplicates next time:
      // this.pendingSubscriptions.clear();
      console.debug("[MarketSocket] connected, flushed subscriptions:", Array.from(this.pendingSubscriptions));
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.warn("[MarketSocket] failed to parse message", err);
      }
    };

    this.socket.onclose = (ev) => {
      console.warn("[MarketSocket] closed", ev);
      this.scheduleReconnect();
    };

    this.socket.onerror = (ev) => {
      console.warn("[MarketSocket] error", ev);
      // let onclose handle reconnect
    };
  }

  // Always queue subscriptions. If socket is null or not open, add to pending set.
  subscribe(symbol: string) {
    // ensure it's in pending set so it's sent once socket opens
    this.pendingSubscriptions.add(symbol);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // send immediately AND keep it in pending set (so it can be re-sent after reconnect)
      this.sendSubscribe(symbol);
    } else {
      // if socket not ready, it will be flushed onopen
      // do nothing else
      console.debug("[MarketSocket] queued subscribe", symbol);
    }
  }

  unsubscribe(symbol: string) {
    // remove from pending list always
    this.pendingSubscriptions.delete(symbol);

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(
          JSON.stringify({
            type: "unsubscribe",
            market: "crypto",
            symbol,
          })
        );
      } catch (e) {
        console.warn("[MarketSocket] unsubscribe send failed", e);
      }
    } else {
      // nothing to send now, but pending list already cleaned
      console.debug("[MarketSocket] unsubscribed from pending", symbol);
    }
  }

  private sendSubscribe(symbol: string) {
    try {
      this.socket?.send(
        JSON.stringify({
          type: "subscribe",
          market: "crypto",
          symbol,
          depth: 1,
        })
      );
    } catch (e) {
      console.warn("[MarketSocket] sendSubscribe failed, queuing", symbol, e);
      this.pendingSubscriptions.add(symbol);
    }
  }

  close() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    try {
      this.socket?.close();
    } catch {}
    this.socket = null;
    // keep pendingSubscriptions if you want subscriptions restored on next connect
    // this.pendingSubscriptions.clear();
  }

  private scheduleReconnect() {
    // exponential backoff capped
    this.reconnectAttempts = Math.min(10, this.reconnectAttempts + 1);
    const delay = Math.min(30000, 500 * Math.pow(1.6, this.reconnectAttempts)); // cap 30s
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      if (!this.tokenInUrl || !this.onMessageCb) return;
      console.debug("[MarketSocket] attempting reconnect, attempt", this.reconnectAttempts);
      this.connect(this.tokenInUrl, this.onMessageCb);
    }, delay);
  }
}
