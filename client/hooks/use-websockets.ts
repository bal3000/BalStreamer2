import { Chromecast } from '../models/chromecast';

export function useWebSockets(
  url: string,
  messageEventHandler: (event: MessageEvent<Chromecast>) => void
) {
  if (WebSocket) {
    const socket = new WebSocket(url);

    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log(`Connection opened to ${url}`);
    });

    // Listen for messages
    socket.addEventListener('message', messageEventHandler);
  }
}
