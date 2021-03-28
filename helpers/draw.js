import Router from 'next/router';

import { updateRoom } from '../api/room';

export const draw = (room) => {

    updateRoom({
        id: room.id,
    })

    // Router.push('/');
} 