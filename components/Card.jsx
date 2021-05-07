import { useEffect, useState, useRef } from 'react';
import { Modal, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Router from 'next/router'
import { v1 } from 'uuid';

import { updateRoom } from '../api/room';
import { saveUserClient, getUserById, updateUser } from '../api/user';

import { generateBoard } from '../helpers/generateBoard';

import timerDuration from '../constants/timerDuration';

let startInterval = null;

const Card = props => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [timer, setTimer] = useState(null);

    const cardRef = useRef(null);
    const seatRef = useRef(null);

    useEffect(() => {

        const registered = localStorage.getItem('user');
        const cachedName = localStorage.getItem('name');

        setPlayerId(registered);
        setName(cachedName);

        clearInterval(startInterval);

        return () => {
            clearInterval(startInterval);
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

            if (currentRoom.status === 'start' && !timer) {

                setTimer(timerDuration);

                startInterval = setInterval(() => {
                    const beepSound = new Audio('../assets/sounds/beep.mp3');

                    beepSound.play();

                    setTimer((previousTime) => previousTime - 1)

                }, 1000)
            }

            setPlayers(props.allRooms[props.index].players || [])
        }
    }, [props.allRooms])

    useEffect(() => {
        if (timer === 0) {
            Router.push(`/duelroom/${props.index}`);
        }
        if (players.length < 2) {
            clearInterval(startInterval);
            setTimer(null);
        }

    }, [timer])


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

                const newPlayer = {
                    id: newId,
                    name,
                    win: 0
                }

                saveUserClient(newPlayer);

                localStorage.setItem('user', newId);

                setPlayerId(newId)

                const newPlayers = players;

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
                okButtonProps={{
                    className: 'set-username-btn'
                }}
            >
                <Input
                    className="player-name-input"
                    autoFocus
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)} />
            </Modal>
        )
    }

    const playerList = () => {
        return players.map((player, index) =>
            <p key={index} className="player-name"><UserOutlined />&nbsp;{player.name}</p>
        )
    }

    const leave = () => {

        clearInterval(startInterval);

        updateRoom({
            id: props.index,
            players: players.filter((p) => p.id !== playerId),
            status: 'idle'
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
            status: 'start'
        })

    }

    const roomButton = () => {

        if (timer) {
            return <button className="btn">{timer}</button>
        }

        if (players.length === 2) {
            return <button className="btn start-button" onClick={() => start()}>Start</button>
        }

        return <button className={`btn enter-button-${props.index}`} onClick={() => setIsModalVisible(true)} disabled={isJoinedPlayer() || players.length === 2}>Enter</button>
    }

    const leaveButton = () => {
        if (playerJoined()) {
            return <button className="leave-button" onClick={() => leave()}>Leave</button>
        }
    }

    return (
        <div className="card-container" ref={cardRef}>
            {userRegisterModal()}
            <div className="card-body">
                <div className="progress-container">
                    <div className="progress" >
                        <div className="seat" ref={seatRef}></div>
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