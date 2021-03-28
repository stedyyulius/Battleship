import { getRoomDetails } from '../api/room';

const id = localStorage.getItem('user');

export const mainPlayerIndex = async (roomId) => {
    const roomData = await getRoomDetails(roomId);

    const { players } = roomData.val();

    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            return i;
        }
    }
    
    return 0;
}

export const opponentPlayerIndex = async () => {
    const roomData = await getRoomDetails(roomId);

    const { players } = roomData.val();

    for (let i = 0; i < players.length; i++) {
        if (players[i] && players[i].id !== id) {
            return i;
        }
    }
    
    return 1;
}