import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define a type for our client object
interface Client {
  ws: WebSocket;
  roomCode: string | null;
}

// Creating a new WebSocket server
const wss = new WebSocketServer({ port: (process.env.PORT || 8080) });

// This will store clients with their roomCode and id
let clients: Record<string, Client> = {};

// This function will send a message to all connected clients
function broadcastMessage(): void {
  Object.keys(clients).forEach(clientID => {
    const client = clients[clientID].ws;
    if (client.readyState === WebSocket.OPEN) {
      const message = `Your room code is: ${clients[clientID].roomCode}`;
      client.send(message);
    }
  });
}

// Set interval for broadcasting messages every 10 seconds
setInterval(broadcastMessage, 10000);

// Define what happens when a WebSocket connection is established
wss.on('connection', function connection(ws: WebSocket) {


  ws.on('message', function incoming(message: string) {

    ws.send(`Room code received: ${message}`);

  });

  // Define what happens when a client connection is closed
  ws.on('close', function close() {
    //TODO      
  });
});

console.log('WebSocket server started on port ' + (process.env.PORT || 8080));
