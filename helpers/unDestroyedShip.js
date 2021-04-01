export const unDestroyedShip = (board) => {
    let shipLeft = '';

    if (board) {
        shipLeft = board.join().match(/1/g) || '';
    }

    return shipLeft.length;
}