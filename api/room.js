import db from '../firebase/clientApp'

export const getRooms = async (id) => {

  const room = await db.ref(`rooms`);
  
  return room;
}


export const getRoomDetails = async (id) => {

  const room = await db.ref(`rooms/${id}`);
  
  return room;
}

export const saveNewRoom = details => {
  db.ref(`rooms/${details.id}`).set({
    id: details.id,
    players: details.players,
    board: [[], []]
  });
}

export const updateRoom = details => {
  const roomRef = db.ref(`rooms/${details.id}`);
  roomRef.update(details);
}


