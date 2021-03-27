import { useEffect, useState } from 'react';
import Image from 'next/image'

import { Row } from 'antd';

const Board = props => {

    const [cells, setCells] = useState([]);

    useEffect(() => {
        
        if (props.board) {
            setCells(props.board);
        }

    }, [props.board]);


    const displayBoard = () => {
        let result = [];

        for (let i = 0; i < cells.length; i++) {

            if (cells[i] === 0) {
                result.push(
                    <div className="cell" key={i}></div>
                )
            }

            if (cells[i] === 1) {
                result.push(
                    <div className="cell" key={i}>
                        <Image src={'/assets/ship.png'} alt="ship" width={40} height={40} />
                    </div>
                );
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

export default Board;