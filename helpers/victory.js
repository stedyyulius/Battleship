import Router from 'next/router';

import { updateUser } from '../api/user';
import { updateRoom } from '../api/room';

export const victory = (user, room) => {

    updateUser({
        ...user,
        win: user.win + 1
    })

    updateRoom({
        id: room.id,
        boards: [],
        players: [],
        timer: false
    })

    alert(`${user.name} Win!`);

    // Router.push('/');
} 