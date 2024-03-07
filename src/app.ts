import WebSocket, { WebSocketServer } from 'ws';
import {db} from './firestoreSetup';

const wss = new WebSocketServer({ port: (process.env.PORT || 8080) });


interface Client{
  UUID: string;
  RoomCode: string;
  websocket: WebSocket;
}

const rooms = new Map<string, Set<Client>>();
const firestoreSubscriptions = new Map<string, () => void>();

wss.on('connection', function connection(ws: WebSocket) {  
  let client: Client | null = null;

  ws.on('message', async function incoming(message: string) {                  
    const data = JSON.parse(message);
    if (!data.UUID || !data.RoomCode){
      console.error('Invalid message received: ', data);
      return;
    }
    client = {
      UUID: data.UUID,
      RoomCode: data.RoomCode,
      websocket: ws
    }
    
    if(!rooms.has(client.RoomCode)){
      rooms.set(client.RoomCode, new Set<Client>());
      const unsubscribe = db.collection('rooms').doc(client.RoomCode).onSnapshot((doc) => {        
        const roomData = doc.data();
        //TODO: Convert doc to gameState format
        
        rooms.get(client.RoomCode)?.forEach((client) => {
          client.websocket.send(JSON.stringify(roomData));
        })
      }, (error) => {
        console.error('Error fetching room data: ', error);
      })
      
      firestoreSubscriptions.set(client.RoomCode, unsubscribe);      
    }
    else{
      try {
        const roomDoc = await db.collection('rooms').doc(client.RoomCode).get();
        const roomData = roomDoc.data(); 
        // TODO: Convert doc to gameState format if necessary
        client.websocket.send(JSON.stringify(roomData));
      } catch (error) {
        console.error('Error sending current room state: ', error);
      }
    }
    
    rooms.get(client.RoomCode).add(client);
  });
  
  ws.on('close', function close() {        
    if (!client) return;
    if(!rooms.has(client.RoomCode)) return;
    
    rooms.get(client.RoomCode)?.delete(client);
    if (rooms.get(client.RoomCode)!.size === 0){
      rooms.delete(client.RoomCode);
      const unsubscribe = firestoreSubscriptions.get(client.RoomCode);
      if(unsubscribe){
        unsubscribe();
      }
    }
  });
});

console.log('WebSocket server started on port ' + (process.env.PORT || 8080));
