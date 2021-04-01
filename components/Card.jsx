import { useEffect, useState, useRef } from 'react';
import { Col, Modal, Input } from 'antd';
import { isMobile } from 'react-device-detect';
import { UserOutlined } from '@ant-design/icons';
import Router from 'next/router'
import { v1 } from 'uuid';

import { updateRoom } from '../api/room';
import { saveUserClient, getUserById, updateUser } from '../api/user';

import { generateBoard } from '../helpers/generateBoard';

import timerDuration from '../constants/timerDuration';

let startInterval = null;
let timer = timerDuration;
let timerTimeout = null;

const Card = props => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null);

    const cardRef = useRef(null);
    const seatRef = useRef(null);

    useEffect(() => {

        const registered = localStorage.getItem('user');
        const cachedName = localStorage.getItem('name');

        setPlayerId(registered);
        setName(cachedName);

        clearInterval(startInterval);

        return () =>{ 
            clearInterval(startInterval);
            timer = timerDuration
        }

    }, [])

    useEffect(() => {
        const currentRoom = props.allRooms[props.index];

        if (currentRoom) {

        const detectedPlayers = (currentRoom.players) ? currentRoom.players.length : 0;
        const occupiedSeat = detectedPlayers / 2 * 100;
        seatRef.current.style.width = `${occupiedSeat}%`;

        if (occupiedSeat === 100) {
            cardRef.current.style['background-image'] = 'url("../assets/war.gif")';
            cardRef.current.style['background-size'] = 'cover';
        } else {
            cardRef.current.style['background-image'] = 'url("../assets/idle.gif")';
        }

            if (currentRoom.timer) {
                
                clearTimeout(timerTimeout);

                timerTimeout= setTimeout(() => {
                        updateRoom({
                            ...currentRoom,
                            timer: false
                        })
                    }, 1500);
            }

            if (currentRoom.timer === 0) {
                clearTimeout(timerTimeout);
                Router.push(`/duelroom/${props.index}`);
            }

            if (currentRoom.timer && currentRoom.players.length < 2) {
                clearInterval(startInterval);
                timer = timerDuration;

                updateRoom({
                    ...currentRoom,
                    timer: false
                })
            }

            setPlayers(props.allRooms[props.index].players || [])
        }
    }, [props.allRooms])

            
    if (typeof window !== 'undefined') {
        window.addEventListener("unload", () => leave());
    }

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

                const newPlayers = players;

                const newPlayer = {
                    id: newId,
                    name,
                }
    
                updateUser(newPlayer)
    
                newPlayers.push(newPlayer);

                updateRoom({
                    id: props.index,
                    players: newPlayers
                })
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


        } else {
            alert('set up a name first');
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

       startInterval = setInterval(() => {
            const beepSound = new Audio('../assets/sounds/beep.mp3');

            beepSound.play();

            let newTimer = timer -= 1

            updateRoom({
                id: props.index,
                players,
                boards: [generateBoard(), generateBoard()], 
                timer: newTimer
            })

        }, 1000)

    }

    const roomButton = () => {

        if (props.allRooms[props.index] && typeof props.allRooms[props.index].timer === 'number') {
            return  <button className="btn">{props.allRooms[props.index].timer.toString()}</button>
        }

        if (players.length === 2) {
            return  <button className="btn" onClick={() => start() }>Start</button>
        }

        return  <button className="btn" onClick={() =>  setIsModalVisible(true)} disabled={isJoinedPlayer() || players.length === 2}>Enter</button>
    }

    const leaveButton = () => {
        if (playerJoined()) {
            return <button className="leave-button" onClick={() =>  leave()}>Leave</button>
        }
    }

    return (
        <div className="card-container" ref={cardRef}>
            {userRegisterModal()}
            <div className="card-body">
                <div className="progress-container">
                    <div className="progress" >
                        <div className="seat"ref={seatRef}></div>
                    </div>
                </div>
                <div className="players">
                    {playerList()}
                </div>
                {leaveButton()}
                {roomButton()}
            </div>
        </div>
    )
}

export default Card;