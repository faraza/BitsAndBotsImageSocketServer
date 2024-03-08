export interface User {
    uuid: string;
    displayName: string;
    isHost: boolean;
    generatedImage?: GeneratedImage;
}
export interface GeneratedImage {
    prompt: string;
    url_base64: string;
}

export enum RoomStatus {
    "waitingToStart" = "waitingToStart",
    "roundInProgress" = "roundInProgress",
    "judging" = "judging",
    "gameOver" = "gameOver"
}


export interface GameState{
    hostUser?: User;
    roomStatus: RoomStatus;
    roundLengthInSeconds: number;
    timeRemaining: number;
    users: User[];
    roomCode: string;

    round?: RoundState;
}

export interface FirestoreSchema extends GameState{
    creationTimestamp: number;
    archived: boolean;
}

export interface RoundState{
    players: User[]
    judge: User
    winner: User | null
    roundStartTimestamp: number
}