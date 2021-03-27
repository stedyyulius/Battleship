import totalShips from '../constants/totalShips';
import totalCells from '../constants/totalCells';

export const generateBoard = () => {
    const newBoard = [];
    let occupied = [];

    for (let i = 0; i < totalCells; i++) {
        newBoard.push(0);
    }

    while(occupied.length < totalShips) {
       const randomCell = Math.floor(Math.random() * newBoard.length);
       
       if (!occupied.includes(randomCell)) {
        newBoard[randomCell] = 1;
        occupied.push(randomCell);
       }
    }

    return newBoard;

}