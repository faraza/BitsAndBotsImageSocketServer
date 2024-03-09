import WebSocket, { WebSocketServer } from 'ws';
import { db } from './firestoreSetup';
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { GameState } from './commonTypes';


const wss = new WebSocketServer({ port: (process.env.PORT || 8080) });

interface Client {
  UUID: string;
  RoomCode: string;
  websocket: WebSocket;
}

const rooms = new Map<string, Set<Client>>();
const firestoreSubscriptions = new Map<string, () => void>();

wss.on('connection', function connection(ws: WebSocket) {
  let client: Client | null = null;

  console.info("New connection made")
  ws.on('message', async function incoming(message: string) {
    try {
      const data = JSON.parse(message);
      console.info('Handshake message received: ', data);
      if (!data.UUID || !data.RoomCode) {
        console.error('Invalid message received: ', data);
        return;
      }
      client = {
        UUID: data.UUID,
        RoomCode: data.RoomCode,
        websocket: ws
      }

      if (!rooms.has(client.RoomCode)) {
        rooms.set(client.RoomCode, new Set<Client>());
        const roomRef = doc(db, 'rooms', client.RoomCode);
        const unsubscribe = onSnapshot(roomRef, (doc) => {
          const roomData = doc.data() as GameState;


          console.info("Sending room update for room ", client.RoomCode)          

          rooms.get(client.RoomCode)?.forEach((client) => {
            client.websocket.send(JSON.stringify(roomData));
          })
        }, (error) => {
          console.error('Error fetching room data: ', error);
        });

        firestoreSubscriptions.set(client.RoomCode, unsubscribe);
      }
      else {
        const roomRef = doc(db, 'rooms', client.RoomCode);
        const roomDoc = await getDoc(roomRef);
        const roomData = roomDoc.data() as GameState;
        
        client.websocket.send(JSON.stringify(roomData));
      }

      rooms.get(client.RoomCode).add(client);
    }
    catch (error) {
      console.error(error)
    }
  });

  ws.on('close', function close() {
    if (!client) return;
    if (!rooms.has(client.RoomCode)) return;

    console.info(`Client ${client.UUID} disconnected from room ${client.RoomCode}`)

    rooms.get(client.RoomCode)?.delete(client);
    if (rooms.get(client.RoomCode)!.size === 0) {
      rooms.delete(client.RoomCode);
      const unsubscribe = firestoreSubscriptions.get(client.RoomCode);
      if (unsubscribe) {
        console.info("All clients disconnected. Unsubscribing from room ", client.RoomCode)
        unsubscribe();
      }
      else {
        console.error("No unsubscribe function found for room ", client.RoomCode)
      }
    }
  });
});

console.info('WebSocket server started on port ' + (process.env.PORT || 8080));
