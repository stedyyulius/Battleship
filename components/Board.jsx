import { useEffect, useState } from 'react';

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
                        <img src={'../assets/ship.png'} alt="ship" />
                    </div>
                );
            }

            if (cells[i] === 3) {
                result.push(
                    <div className="cell" key={i}>
                        <img src={'../assets/wrong.png'} alt="x" />
                    </div>
                );
            }

            if (cells[i] === 4) {
                result.push(
                <div className="cell" key={i}>
                    <image src={'../assets/explosion.gif'} alt="explosion" /> 
                </div>
                );
            }
        }

        return result;
    }

    return (
        <Row gutter={15}>
            {displayBoard()}
        </Row>
    )
}

export default Board;