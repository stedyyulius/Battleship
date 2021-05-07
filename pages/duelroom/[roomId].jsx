import { useEffect, useState } from 'react';
import Router from 'next/router'
import Image from 'next/image';

import { Col, Row } from 'antd';

import totalShips from '../../constants/totalShips';

import Board from '../../components/Board';
import EnemyBoard from '../../components/EnemyBoard';

import { unDestroyedShip } from '../../helpers/unDestroyedShip';
import { victory } from '../../helpers/victory';

import { getRoomDetails } from '../../api/room.js';

let afkTimeout = null;
let endGameInterval = null;

const DuelRoom = props => {
    const [players, setPlayers] = useState([{}, {}]);
    const [boards, setBoards] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [roomData, setRoomData] = useState({});
    const [winner, setWinner] = useState(null);
    const [endGameTimeout, setEndGameTimeout] = useState(20);

    let url = null;
    let roomId = null;

    if (typeof window !== 'undefined') {
        url = window.location.href.split('/');
        roomId = url[url.length - 1];
    }

    useEffect(() => {
        const id = localStorage.getItem('user');

        setPlayerId(id);

        const unSubScribeRoom = async () => {
            const roomSubscription = await getRoomDetails(roomId);

            roomSubscription.off();
        }

        const subscribeRoom = async () => {
            const roomSubscription = await getRoomDetails(roomId);

            roomSubscription.on('value', snapshot => {

                const data = snapshot.val();

                clearTimeout(afkTimeout);

                if (data && data.boards && data.boards.length === 2 && data.players) {

                    const currentPlayerid = data.players.map((d) => d.id === id);

                    const mi = currentPlayerid.indexOf(true);
                    const oi = currentPlayerid.indexOf(false);

                    if (data) {
                        setRoomData(data);
                        setPlayers(data.players);
                        setBoards(data.boards);
                    }

                    const miLives = unDestroyedShip(data.boards[mi]);
                    const oiLives = unDestroyedShip(data.boards[oi]);

                    if (miLives === 0) {
                        unSubScribeRoom()
                        victory(data.players[oi], data);
                        setWinner(data.players[oi]);
                    }

                    if (oiLives === 0) {
                        unSubScribeRoom();
                        victory(data.players[mi], data);
                        setWinner(data.players[mi]);
                    }
                } else {
                    unSubScribeRoom()
                    Router.push('/');
                }

            })
        }

        subscribeRoom();

        return () => unSubScribeRoom();

    }, [])

    // useEffect(() => {
    //     if (winner) {
    //         endGameInterval = setInterval(() => {
    //             setEndGameTimeout((state) => state - 1)
    //         }, 1000)
    //     }
    // }, [winner])

    useEffect(() => {
        if (endGameTimeout === 0) {
            Router.push('/');
        }
    }, [endGameTimeout])


    const mainPlayerIndex = () => {

        for (let i = 0; i < players.length; i++) {
            if (players[i].id === playerId) {
                return i;
            }
        }

        return 0;
    }

    const opponentPlayerIndex = () => {

        for (let i = 0; i < players.length; i++) {
            if (players[i] && players[i].id !== playerId) {
                return i;
            }
        }

        return 1;
    }

    const playerWins = (index) => {
        if (players[index]) {
            return players[index].win;
        }

        return 0;
    }

    const destroyedShip = (index) => {
        if (boards[index]) {

            return totalShips - unDestroyedShip(boards[index]);

        }
        return 0
    }

    const lives = (index) => {
        let result = [];

        if (boards[index] && players[index]) {
            for (let i = 0; i < unDestroyedShip(boards[index]); i++) {
                result.push(
                    <Image key={i} src={'/assets/ship.png'} alt="ship" width={40} height={40} />
                )
            }
        }

        return result;
    }

    const endGameAnimation = (id) => {

        if (winner) {
            if (winner.id === id) {
                return <img className="end-game-animation" src={'../../assets/victory.gif'} alt="win" />
            } else {
                return <img className="end-game-animation" src={'../../assets/lose.gif'} alt="lose" />
            }
        }

        return null;
    }

    const gameWilEnd = () => {
        if (winner) {
            return <h2 className="white-text">Game will end in {endGameTimeout}</h2>
        }

        return null;
    }


    const mi = mainPlayerIndex();
    const oi = opponentPlayerIndex();

    return (
        <div className="duel-room">
            <div className="board-container">
                <Row>
                    <Col span={7}>
                        <h1 className="white-text">{players[mi].name}</h1>
                    </Col>
                    <Col span={6}>
                        <h1 className="white-text">Win: {playerWins(mi)}</h1>
                    </Col>
                    <Col span={10}>
                        <Row gutter={15}>
                            {lives(mi)}
                        </Row>
                    </Col>
                </Row>
                {endGameAnimation(players[mi].id)}
                <Board board={boards[mi]} boardIndex={mi} />
            </div>
            <div className="middle-container">
                {(winner)
                    ? <h3 className="white-text">{winner.name} win!</h3>
                    : <h3 className="white-text">Destroy {totalShips} ships to win</h3>
                }
                <br />
                <br />
                <br />
                <h1 className="white-text">{players[mi]?.name}: {destroyedShip(oi)}</h1>
                <h1 className="white-text">VS</h1>
                <h1 className="white-text">{players[oi]?.name}: {destroyedShip(mi)}</h1>
                <br />
                <br />
                {gameWilEnd()}
            </div>
            <div className="board-container">
                <Row>
                    <Col span={7}>
                        <h1 className="white-text">{players[oi]?.name}</h1>
                    </Col>
                    <Col span={7}>
                        <h1 className="white-text">Win: {playerWins(oi)}</h1>
                    </Col>
                    {/* <Col span={10}>
                        <Row gutter={15}>
                            {lives(oi)}
                        </Row>
                    </Col> */}
                </Row>
                {endGameAnimation(players[oi].id)}
                <EnemyBoard board={boards[oi]} roomData={roomData} boardIndex={oi} />
            </div>
        </div>
    )
}

export default DuelRoom;