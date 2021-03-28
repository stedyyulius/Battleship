import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import Card from '../components/Card';

import { getRooms } from '../api/room';

const Rooms = props => {
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {

        const subscribeRoom = async () => {
            const roomSubscription = await getRooms();
      
             roomSubscription.on('value', snapshot => {
                setAllRooms(snapshot.val());
            });
        }

        const unSubscribeRoom = async () => {
            const roomSubscription = await getRooms();
      
             roomSubscription.off();
        }

        subscribeRoom()

    return () => unSubscribeRoom();

    }, [])

    const RoomList = () => {
        const result = [];

        for (let i = 0; i < 12; i++) {
            result.push(<Card key={i} index={i} allRooms={allRooms} />);
        }

        return result;
    }

    return (
        <div>
            <h1 className="white-text">Version 1.00</h1>
            <Row>
                {RoomList()}
            </Row>
        </div>
    )
}

export default Rooms;