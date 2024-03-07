import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define a type for our client object
interface Client {
  ws: WebSocket;
  roomCode: string | null;
}

// Creating a new WebSocket server
const wss = new WebSocketServer({ port: 8080 });

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
  const id = uuidv4(); // Assign a unique ID to the connection
  clients[id] = { ws, roomCode: null }; // Add the connection to our list of clients

  console.log(`Client has connected: ${id}`);

  // Define what happens when a message is received from a client
  ws.on('message', function incoming(message: string) {
    console.log(`received from ${id}: ${message}`);
    
    // The first message from the client is expected to be their roomCode
    if (clients[id].roomCode === null) {
      clients[id].roomCode = message;
      ws.send(`Room code received: ${message}`);
    }
  });

  // Define what happens when a client connection is closed
  ws.on('close', function close() {
    console.log(`Client disconnected: ${id}`);
    delete clients[id]; // Remove the client from our list
  });
});

console.log('WebSocket server started on port 8080');
