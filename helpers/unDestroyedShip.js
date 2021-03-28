export const unDestroyedShip = (board) => {
    const shipLeft = board.join().match(/1/g);
    
    if (!shipLeft) {
        return 0;
    }

    return shipLeft.length;
}