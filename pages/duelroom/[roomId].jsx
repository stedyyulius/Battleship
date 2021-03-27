import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { Col, Row } from 'antd';

import totalShips from '../../constants/totalShips'; 

import Board from '../../components/Board';
import EnemyBoard from '../../components/EnemyBoard';

import { getRoomDetails } from '../../api/room.js';

const DuelRoom = props => {
    const [players, setPlayers] = useState([]);
    const [boards, setBoards] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [roomData, setRoomData] = useState({})

    const router = useRouter();
    const { roomId } = router.query;

    useEffect(() => {
        const id = localStorage.getItem('user');

        setPlayerId(id);

        const subscribeRoom = async () => {
            const roomSubscription = await getRoomDetails(roomId);
            
            roomSubscription.on('value', snapshot => {
                const data = snapshot.val();
                
                if (data) {
                    setRoomData(data);
                    setPlayers(data.players);
                    setBoards(data.boards);
                }
   
            })
        }

        const unSubScribeRoom = async () => {
            const roomSubscription = await getRoomDetails(roomId);
            
            roomSubscription.off();
        }

        subscribeRoom();

        return () => unSubScribeRoom();

    }, [])

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

            console.log(players[index])
            return players[index].win;
        }

        return 0;
    }

    const destroyedShip = (index) => {
        if (boards[index]) {
            const unDestroyedShip = boards[index].join().match(/1/g);
            console.log(unDestroyedShip)
            return totalShips -  unDestroyedShip.length;
        }
        return 0
    }

    const mi = mainPlayerIndex();
    const oi = opponentPlayerIndex();

    return (
        <div className="duel-room">
            <Col span={9}>
                <Row>
                    <Col span={10}>
                        <h1 className="white-text">Score: {destroyedShip(oi)}</h1>
                    </Col>
                    <Col span={7}>
                        <h1 className="white-text">Win: {playerWins(mi)}</h1>
                    </Col>
                </Row>
               
                <Board board={boards[mi]} boardIndex={mi} />
            </Col>
            <Col span={5} style={{textAlign:'center'}}>
                <h3 className="white-text">Destroy {totalShips} ships to win</h3>
                <br />
                <br />
                <br />
                <h1 className="white-text">ABC</h1>
                <h1 className="white-text">VS</h1>
                <h1 className="white-text">CBA</h1>
            </Col>
            <Col span={9}>
                <Row>
                    <Col span={10}>
                        <h1 className="white-text">Score: {destroyedShip(mi)}</h1>
                    </Col>
                    <Col span={7}>
                        <h1 className="white-text">Win: {playerWins(oi)}</h1>
                    </Col>
                </Row>
                <EnemyBoard board={boards[oi]} roomData={roomData} boardIndex={oi} />
            </Col>
        </div>
    )
}

export default DuelRoom;