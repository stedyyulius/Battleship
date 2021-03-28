import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Row } from 'antd';

import { updateRoom } from '../api/room';

const EnemyBoard = props => {

    const [cells, setCells] = useState([]);

    useEffect(() => {
        
        if (props.board) {
            setCells(props.board);
        }
        
    }, [props.board]);

    const fire = (index) => {

        const fireSound = new Audio('../public/assets/sounds/laser.mp3');
        const shipHit = new Audio('../public/assets/sounds/explosion.wav');

        const newBoard = props.roomData.boards;

        if (cells[index] === 1) {
            shipHit.play();

            newBoard[props.boardIndex][index] = 4;

        } else {
            fireSound.play();

            newBoard[props.boardIndex][index] = 3;
        }
        
        updateRoom({
            ...props.roomData,
            boards: newBoard 
        })
    }

    const displayBoard = () => {
        let result = [];

        for (let i = 0; i < cells.length; i++) {

            if (cells[i] === 0 || cells[i] === 1) {
                result.push(
                    <div className="cell" key={i} onClick={() => fire(i)}></div>
                )
            }


            if (cells[i] === 3) {
                result.push(
                    <div className="cell" key={i}>
                        <Image src={'/assets/wrong.png'} alt="x" width={30} height={0} />
                    </div>
                );
            }

            if (cells[i] === 4) {
                result.push(
                <div className="cell" key={i}>
                    <Image src={'/assets/explosion.gif'} alt="explosion" width={20} height={10} /> 
                </div>
                );
            }
            
        }

        return result;
    }

    return (
        <Row gutter={24}>
            {displayBoard()}
        </Row>
    )
}

export default EnemyBoard;