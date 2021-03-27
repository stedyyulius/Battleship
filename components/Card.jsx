import { useEffect, useState } from 'react';
import { Col, Modal, Input } from 'antd';
import { isMobile } from 'react-device-detect';
import { UserOutlined } from '@ant-design/icons';
import Router from 'next/router'
import { v1 } from 'uuid';

import { updateRoom } from '../api/room';
import { saveUserClient, getUserById, updateUser } from '../api/user';

import { generateBoard } from '../helpers/generateBoard';

const Card = props => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null);

    useEffect(() => {

        const registered = localStorage.getItem('user');
        const cachedName = localStorage.getItem('name');

        setPlayerId(registered);
        setName(cachedName);

        return () => setIsModalVisible(false);

    }, [])

    useEffect(() => {
        const currentRoom = props.allRooms[props.index];
        if (currentRoom) {

            if (currentRoom.isStart) {
                Router.push(`/duelroom/${props.index}`);
            }

            setPlayers(props.allRooms[props.index].players || [])
        }
    }, [props.allRooms])

    const playerJoined = () => {

        const exist = players.filter((p) => p.id === playerId);
        
        return exist.length > 0;
    };

    const enterRoom = async () => {

        if (name) {
            setIsModalVisible(false);
            localStorage.setItem('name', name);
    
            if (!playerId) {
                const newId = v1();
      
               saveUserClient({
                    id: newId,
                    name,
                });
    
                localStorage.setItem('user', newId);
                setPlayerId(newId)
            }
        } else {
            alert('set up a name first');
        }

        const playerData = await getUserById(playerId);
        
        if (!playerJoined() && playerData) {
            const newPlayers = players;

            const newPlayer = {
                ...playerData.val(),
                name
            }

            updateUser(newPlayer)

            newPlayers.push(newPlayer);

            updateRoom({
                id: props.index,
                players: newPlayers
            })
        }
   
    }

    const userRegisterModal = () => {
        return (
          <Modal 
          title="Enter Name" 
          visible={isModalVisible}
          onOk={() => enterRoom()}
          onCancel={() => setIsModalVisible(false)}
          >
            <Input 
            defaultValue={name}
            onChange={(e) => setName(e.target.value) } />
          </Modal>
        )
    }

    const playerList = () => {
        return players.map((player, index) =>
            <p key={index}><UserOutlined />&nbsp;{player.name}</p>
        )
    }

    const leave = () => {
        updateRoom({
            id: props.index,
            players: players.filter((p) => p.id !== playerId)
        })
    }

    const isJoinedPlayer = () => {
        for (const r of props.allRooms) {
            if (r.players && r.players.length > 0) {
                if (r.players[0].id === playerId) {
                    return true;
                }
                if (r.players.length > 1 && r.players[1].id === playerId) {
                    return true;
                }
            }
        }

        return false;
    }

    const start = () => {

        updateRoom({
            id: props.index,
            players,
            boards: [generateBoard(), generateBoard()],
            isStart: true 
        })

    }

    const roomButton = () => {

        if (players.length === 2) {
            return  <button className="btn" onClick={() =>  start() }>Start</button>
        }

        return  <button className="btn" onClick={() =>  setIsModalVisible(true)} disabled={isJoinedPlayer() || players.length === 2}>Enter</button>
    }

    const leaveButton = () => {
        if (playerJoined()) {
            return <button className="leave-button" onClick={() =>  leave()}>Leave</button>
        }
    }

    return (
        <Col span={isMobile ? 12 : 6}>
            {userRegisterModal()}
            <div className="card-container">
                <div className="card-body">
                    <div className="progress-container">
                        <div className="progress"></div>
                        <span className="progress-text">
                            1/2 Challenges
                        </span>
                    </div>
                    <div className="players">
                       {playerList()}
                    </div>
                    {leaveButton()}
                    {roomButton()}
                </div>
            </div>
        </Col>
    )
}

export default Card;